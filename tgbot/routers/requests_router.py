import datetime
from aiogram import types, F, Router
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.enums import ParseMode
from aiogram import Bot
from aiogram.types import FSInputFile

from aiogram.filters import StateFilter
from aiogram.filters import Command as FilterCommand
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State

from database import query as database_query, execute as database_execute

import re, requests

router = Router()

class Form(StatesGroup):
    rent = State()

async def checkAuth(msg: Message, userid = None):
    if userid == None:
        candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(msg.from_user.id))
    else:
        candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(userid))
    if len(candidate) < 1:
        await msg.answer("❌ Вы не зарегестрированы в системе. Пожалуйста, активируйте команду /start!")
        return False
    else:
        return candidate[0]
    
@router.callback_query(F.data.startswith("request_cancel"))
async def createRequestCancel(callback: types.CallbackQuery, state: FSMContext):
    await state.set_state(None)
    await callback.message.answer("⏪ Отмена события")
    await callback.answer()

@router.callback_query(F.data.startswith("request_see_"))
async def createRequestSee(callback: types.CallbackQuery, state: FSMContext):
    isAuth = await checkAuth(callback.message, callback.from_user.id)
    if isAuth == False: return
    house_id = callback.data.split("request_see_")[1]
    candidates = database_query("SELECT * FROM requests WHERE offer = {} AND user = {};".format(house_id, isAuth[0]))
    print(candidates)
    if len(candidates) > 0:
        await callback.message.answer("❌ У вас уже есть отправленная заявка на это объявление!")
        return False
    
    database_execute("INSERT INTO `requests`(`user`, `offer`, `phoneNumber`, `createdAt`, `updatedAt`) VALUES ({}, {}, '{}', '{}', '{}')".format(
        isAuth[0], house_id, isAuth[6], 
        datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S"), datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    ))

    await callback.bot.send_message(callback.message.chat.id,
        "✅ Успешно создана заявка!",
        parse_mode=ParseMode.HTML
    )
    await callback.answer()
#reqest_rent
@router.callback_query(F.data.startswith("reqest_rent_"))
async def createRequestRent(callback: types.CallbackQuery, state: FSMContext):
    isAuth = await checkAuth(callback.message, callback.from_user.id)
    if isAuth == False: return
    house_id = callback.data.split("reqest_rent_")[1]
    candidates = database_query("SELECT * FROM requests WHERE offer = {} AND user = {};".format(house_id, isAuth[0]))
    print(candidates)
    if len(candidates) > 0:
        await callback.message.answer("❌ У вас уже есть отправленная заявка на это объявление!")
        return False
    builder = InlineKeyboardBuilder()
    builder.add(types.InlineKeyboardButton(
        text="❌ Отменить",
        callback_data="request_cancel")
    )
    await callback.message.answer("💬 Введите количество дней, на которое вы хотите арендовать недвижимость:", reply_markup=builder.as_markup())
    await state.set_state(Form.rent)
    await state.update_data({"house_id": house_id})
    await callback.answer()

@router.message(StateFilter(Form.rent))
async def FilterGet(message: types.Message, state: FSMContext):
    isAuth = await checkAuth(message)
    if isAuth == False: return
    text = message.text
    if not text.isdigit():
        return message.answer("❌ Введите число до 30 дней!")
    if int(text) > 30 or int(text) < 1:
        return message.answer("❌ Введите число до 30 дней!")
    data = await state.get_data()
    if "house_id" not in data:
        return message.answer("❌ Произошла ошибка, попробуйте найти объявление заново")
    house_id = data["house_id"]
    database_execute("INSERT INTO `requests`(`user`, `offer`, `rentTime`, `phoneNumber`, `createdAt`, `updatedAt`) VALUES ({}, {}, {}, '{}', '{}', '{}')".format(
        isAuth[0], house_id, int(text), isAuth[6], 
        datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S"), datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    ))

    await message.answer(
        "✅ Успешно создана заявка!",
        parse_mode=ParseMode.HTML
    )
    await state.set_state(None)


# see_my_requests
@router.callback_query(F.data.startswith("see_my_requests"))
async def seeMyRequests(callback: types.CallbackQuery, state: FSMContext):
    isAuth = await checkAuth(callback.message, callback.from_user.id)
    if isAuth == False: return

    all_requests = database_query("SELECT * FROM requests WHERE user = {};".format(isAuth[0]))
    
    if len(all_requests) < 1:
        await callback.message.answer("❌ У вас нет ни одной активной заявки")
    else:
        print("ЗАЯВКИ:")
        for i in all_requests:
            offer = database_query("SELECT * FROM offers WHERE id = {};".format(i[2]))
            if len(offer) < 1:
                return await callback.message.answer("❌ Произошла техническая ошибка, попробуйте заново")
            offer = offer[0]
            _text = "<b>{} [#{}]</b>\n\n<i>Описание:</i> {}".format(
                offer[5], offer[0], offer[3], 
            )
            if i[4] != None:
                _text += "\n\n<i>Время аренды:</i> {} дней".format(i[4])
            _text += "\n\n<b>Статус:</b>"
            if i[5] == 1:
                if i[6] == 0: _text += "❌ Отказано"
                else: _text += "✅ Одобрено"
            await callback.message.answer(_text, parse_mode=ParseMode.HTML)
            await callback.answer()