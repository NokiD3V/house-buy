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
    filter = State()

def filterToString(data: dict):
    all_filters = []
    if "low" in data:
        all_filters.append("📉 Мин. цена: {} руб.".format(data["low"]))
    if "max" in data:
        all_filters.append("📈 Макс. цена: {} руб.".format(data["max"]))
    if "adress" in data:
        
        
        all_filters.append("📌 Адрес: {}".format(data["adress"]))
    if "class" in data:
        text_data_class = ""
        match data["class"]:
            case "flat":
                text_data_class = "🛏️ Квартира"
            case "house":
                text_data_class = "🏠 Дом"
            case _:
                text_data_class = "❓ Другое"
        all_filters.append("🏠 Тип недвижимости: {}".format(text_data_class))
    return "\n".join(all_filters)

async def checkAuth(callback: types.CallbackQuery, msg: Message):
    candidate = None
    if callback:
        candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(callback.from_user.id))
    else:
        candidate = database_query("SELECT * FROM users WHERE telegramID = {};".format(msg.from_user.id))
    if len(candidate) < 1:
        await msg.answer("❌ Вы не зарегестрированы в системе. Пожалуйста, активируйте команду /start!")
        return False
    else:
        return True

@router.callback_query(F.data.startswith("start_see"))
async def seeOffers(callback: types.CallbackQuery, state: FSMContext):
    isAuth = await checkAuth(callback, callback.message)
    if isAuth == False: return
    builder = InlineKeyboardBuilder()
    builder.add(types.InlineKeyboardButton(
        text="✅ Смотреть",
        callback_data="see_ad"),
    )
    builder.add(types.InlineKeyboardButton(
        text="💎 Фильтр",
        callback_data="filter_start"),
    )
    builder.add(types.InlineKeyboardButton(
        text="🗑️ Очистить",
        callback_data="filter_clear"),
    )
    # builder.adjust(1)
    data = await state.get_data()
    filter_str = filterToString(data)
    print(data)
    await callback.message.answer(
        "<b>👀 Просмотр объявлений</b>\n\n<i>Действующие фильтры:</i>\n{}\n\nЧтобы просматривать доступные объявления нажмите на кнопку ниже 👇"
        .format(filter_str),
        reply_markup=builder.as_markup(),
        parse_mode=ParseMode.HTML
    )
    await callback.answer()

@router.callback_query(F.data.startswith("see_ad"))
async def seeOffersBTN(callback: types.CallbackQuery, state: FSMContext):
    message = callback.message
    data = await state.get_data()
    await callback.answer()
    print(data)
    if data == {}:
        sqldata = database_query("SELECT * FROM offers;")
        await state.update_data(maxnum=len(sqldata)-1, sqldata=sqldata, adnum=0)
        data = await state.get_data()
    elif "max" in data or "low" in data or "class" in data or "adress" in data:
        filter_text = []
        if "max" in data:
            filter_text.append("price < {}".format(data["max"]))
        if "low" in data:
            filter_text.append("price > {}".format(data["low"]))
        if "class" in data:
            filter_text.append("type = '{}'".format(data["class"]))
        if "adress" in data:
            filter_text.append("adress LIKE '%{}%'".format(data["adress"]))
        print("SELECT * FROM offers WHERE {};".format(' AND '.join(filter_text)))
        sqldata = database_query("SELECT * FROM offers WHERE {};".format(' AND '.join(filter_text)))
        data = await state.get_data()
        adnum = 0
        if "adnum" in data:
            adnum = data["adnum"]
        await state.update_data(maxnum=len(sqldata), adnum=adnum)
        
    else:
        sqldata = database_query("SELECT * FROM offers;")
        data = await state.get_data()
        adnum = 0
        if "adnum" in data:
            adnum = data["adnum"]
        await state.update_data(maxnum=len(sqldata)-1, adnum=adnum)
    builder = InlineKeyboardBuilder()
    print("USER ID")
    print(callback.from_user.id)
    print(data)
    if len(sqldata) < 1:
        return callback.message.answer("❌ Объявлений по вашим фильтрам не найдено. Попробуйте изменить фильтр.")
    house_data = sqldata
    house_data = house_data[data["adnum"]]
    builder.add(types.InlineKeyboardButton(
        text="👀 Осмотреть",
        callback_data="request_see_{}".format(house_data[0])
    ))
    builder.add(types.InlineKeyboardButton(
        text="💸 Арендовать",
        callback_data="reqest_rent_{}".format(house_data[0])
    ))
    builder.add(types.InlineKeyboardButton(
        text="✅ Перейти на сайт",
        url="http://127.0.0.1:3000/offers/{}".format(house_data[0])
    ))
    builder.add(types.InlineKeyboardButton(
        text="↩️ В меню",
        callback_data="menu"
    ))
    builder.add(types.InlineKeyboardButton(
        text="➡️ Следующее",
        callback_data="see_ad"
    ))

    builder.adjust(2)



    url = house_data[6]
    img_download_data = requests.get(url).content 
    
    f = open(house_data[6].split("/static/banners/")[1],'wb') 
    f.write(img_download_data) 
    f.close() 

    filename = house_data[6].split("/static/banners/")[1]
    print(filename)
    image_send = FSInputFile(filename, filename=filename)

    await message.bot.send_photo(message.chat.id,
        caption="*{}*\n\n_Описание: {}_\n\n_Цена:_ {} руб\n\n_Номер телефона:_ ||{}||"
        .format(house_data[5], house_data[3], house_data[8], house_data[7]).replace(".", "\.").replace("+", "\+"),
        reply_markup=builder.as_markup(),
        parse_mode=ParseMode.MARKDOWN_V2,
        photo=image_send
    )
    data = await state.get_data()
    if data["adnum"] > data["maxnum"]:
        return await state.update_data(adnum=0)
    await state.update_data(adnum=data["adnum"]+1)
    


@router.callback_query(F.data.startswith("filter_start"))
async def StartFilter(callback: types.CallbackQuery, state: FSMContext):
    message = callback.message
    builder = InlineKeyboardBuilder()
    builder.add(types.InlineKeyboardButton(
        text="📉 Мин. цена",
        callback_data="filter_f_low"),
    )
    builder.add(types.InlineKeyboardButton(
        text="📈 Макс. цена",
        callback_data="filter_f_max"),
    )
    builder.add(types.InlineKeyboardButton(
        text="📌 Адрес",
        callback_data="filter_f_adress"),
    )
    builder.add(types.InlineKeyboardButton(
        text="🏠 Тип",
        callback_data="filter_f_class"),
    )
    builder.adjust(2)
    await callback.message.answer(
        "✨ Выберите фильтр, который хоитите установить!",
        reply_markup=builder.as_markup(),
        parse_mode=ParseMode.HTML
    )
    await callback.answer()

@router.callback_query(F.data.startswith("filter_clear"))
async def FilterClear(callback: types.CallbackQuery, state: FSMContext):
    await state.set_data({})
    await state.set_state(None)
    await callback.message.answer("✅ Фильтры успешно очищены!")
    await callback.answer()
@router.callback_query(F.data.startswith("filter_f_"))
async def FilterAwait(callback: types.CallbackQuery, state: FSMContext):
    message = callback.message
    await state.set_state(Form.filter)
    data = await state.get_data()
    data["type"] = callback.data.split("filter_f_")[1]
    if data["type"] == "class":
        builder = InlineKeyboardBuilder()
        builder.add(types.InlineKeyboardButton(
            text="🏠 Дом",
            callback_data="filter_class_house"),
        )
        builder.add(types.InlineKeyboardButton(
            text="🛏️ Квартира",
            callback_data="filter_class_flat"),
        )
        builder.add(types.InlineKeyboardButton(
            text="❓ Другое",
            callback_data="filter_class_other"),
        )
        builder.adjust(3)
        await callback.message.answer(
            "🔍 Выберите тип недвижимости, который хоитите установить!",
            reply_markup=builder.as_markup(),
            parse_mode=ParseMode.HTML
        )
        return True
    await state.set_data(data)
    await message.answer("💬 Введите желаемую характеристику:")
    await callback.answer()
@router.callback_query(F.data.startswith("filter_class_"))
async def FilterClass(callback: types.CallbackQuery, state: FSMContext):
    message = callback.message
    data = callback.data.split("filter_class_")[1]
    data_state = await state.get_data()
    data_state["class"] = data
    await state.set_data(data_state)
    await message.reply("✅ Успешно установлен фильтр")
    await seeOffers(callback, state)
    await callback.answer()

@router.message(StateFilter(Form.filter))
async def FilterGet(message: types.Message, state: FSMContext):
    data = await state.get_data()
    input_data = ""
    if data["type"] == 'low' or data["type"] == 'max':
        print(await state.get_data())
        print(message.text)
        if not message.text.isdigit():
            await message.reply("❌ Введите числовое значение!")
            return False
        input_data = int(message.text)
    else:
        input_data = message.text
    data_name = data["type"]
    data[data_name] = input_data
    await state.set_data(data)
    await state.set_state(None)
    await message.reply("✅ Успешно установлен фильтр")
    builder = InlineKeyboardBuilder()
    builder.add(types.InlineKeyboardButton(
        text="✅ Смотреть",
        callback_data="see_ad"),
    )
    builder.add(types.InlineKeyboardButton(
        text="💎 Фильтр",
        callback_data="filter_start"),
    )
    builder.add(types.InlineKeyboardButton(
        text="🗑️ Очистить",
        callback_data="filter_clear"),
    )
    # builder.adjust(1)
    filter_str = filterToString(data)
    print(data)
    await message.answer(
        "<b>👀 Просмотр объявлений</b>\n\n<i>Действующие фильтры:</i>\n{}\n\nЧтобы просматривать доступные объявления нажмите на кнопку ниже 👇"
        .format(filter_str),
        reply_markup=builder.as_markup(),
        parse_mode=ParseMode.HTML
    )
    return True
