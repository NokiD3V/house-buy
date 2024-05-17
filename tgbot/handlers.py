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

import re

from routers.see_router import router as see_router
from routers.requests_router import router as requests_router

class FilterOffers(StatesGroup):
    house_type = State()

class UserGroup(StatesGroup):
    auth = State()

class UserRegister(StatesGroup):
    phone = State()

router = Router()
router.include_routers(see_router, requests_router)

async def checkAuth(msg: Message):
    candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(msg.from_user.id))
    if len(candidate) < 1:
        await msg.answer("❌ Вы не зарегестрированы в системе. Пожалуйста, активируйте команду /start!")
        return False
    else:
        return True

@router.message(Command("start"))
async def start_handler(msg: Message, state: FSMContext):
    candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(msg.from_user.id))
    if(len(candidate) < 1):
        await msg.answer("👋 Привет!\nВаш Telegram аккаунт не зарегестрирован в системе. Пожалуйста, введите номер телефона, который привязан к сайту.")
        await state.set_state(UserRegister.phone)
    else:
        await menuCommand(msg)
    return True

@router.message(UserRegister.phone)
async def registerUser(msg: Message, state: FSMContext):
    if(len(msg.text) < 9):
        return await msg.reply("❌ Введите корректный номер телефона!")
    text = re.findall(r'^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$', msg.text)
    if len(text) < 1:
        return await msg.reply("❌ Введите корректный номер телефона!")
    
    candidate = database_query("SELECT * FROM users WHERE phoneNumber LIKE '%{}%';".format(text[0]))
    if len(candidate) < 1:
        return await msg.reply("❌ Пользователя с таким номером телефона не найдено. Попробуйте ввести корректный номер телефона")
    print(candidate[0])
    database_execute("UPDATE users SET telegramID = '{}' WHERE id = '{}';".format(msg.from_user.id, candidate[0][0]))
    await msg.reply("✅ Вы успешно зарегестрированы в системе! Используйте /menu, чтобы использовать функционал бота!")
    await state.clear()
    return True

@router.message(Command("id"))
async def message_handler(msg: Message, bot: Bot):
    await msg.answer(f"Твой ID: {msg.from_user.id}")
    return True

@router.message(Command("menu"))
async def menuCommand(msg: types.Message):
    builder = InlineKeyboardBuilder()
    builder.add(types.InlineKeyboardButton(
        text="👀 Смотреть объявления",
        callback_data="start_see"),
    )
    builder.add(types.InlineKeyboardButton(
        text="✉️ Мои заявки",
        callback_data="see_my_requests"),
    )
    builder.add(types.InlineKeyboardButton(
        text="✨ Создать объявление",
        callback_data="create_ad"),
    )
    builder.adjust(2)
    await msg.answer(
        "<b>📗 Пользовательское меню</b>\n\nВыберите категорию, в которой вы нуждаетесь, нажав на одну из кнопок 👇",
        reply_markup=builder.as_markup(),
        parse_mode=ParseMode.HTML
    )
    return True

@router.callback_query(F.data.startswith("menu"))
async def seeMenu(callback: types.CallbackQuery, state: FSMContext):
    await menuCommand(callback.message)
    await callback.answer()