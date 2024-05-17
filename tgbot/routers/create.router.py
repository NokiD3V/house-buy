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
    creating = State()

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

@router.callback_query(F.data.startswith("create_ad"))
async def createRequestSee(callback: types.CallbackQuery, state: FSMContext):
    isAuth = await checkAuth(callback.message, callback.from_user.id)
    if isAuth == False: return
    if isAuth[5] != 1:
        return await callback.answer("❌ У вас нет прав на создание объявлений")
    await state.set_state(Form.creating)
    
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
