import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

import config
from handlers import router
from notifications import checkNotifications

import database

bot = Bot(token=config.BOT_TOKEN, parse_mode=ParseMode.HTML)
async def main():
    if not database.init():
        return
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


# if __name__ == "__main__":
#     logging.basicConfig(level=logging.INFO)
#     try:
#         asyncio.run(main())
#     except KeyboardInterrupt:
#         database.close()
#         logging.info(msg="Bot stopped.")

#         async def main():
#     # Регистрируем хэндлер cmd_test2 по команде /start
#     dp.message.register(cmd_test2, Command("test2"))

#     # Запускаем бота и пропускаем все накопленные входящие
#     # Да, этот метод можно вызвать даже если у вас поллинг
#     await bot.delete_webhook(drop_pending_updates=True)
#     await dp.start_polling(bot)

async def maindown():
    while True:
        await checkNotifications(bot)
        await asyncio.sleep(30)

def down():
    asyncio.run(maindown())


def polstart():
    asyncio.run(main())

if __name__ == "__main__":
    # threadslist = []
    # thread2=threading.Thread(target=down); threadslist.append(thread2)
    # thread1=threading.Thread(target=polstart); threadslist.append(thread1)
    # for t in threadslist:
    #     t.start()
    # for t in threadslist:
    #     t.join()
    # task = asyncio.create_task(down())    
    # asyncio.run(task, main())
    try:
        loop = asyncio.get_event_loop()
        loop.create_task(main())
        loop.create_task(maindown())
        loop.run_forever()
    except KeyboardInterrupt:
        database.close()
        logging.info(msg="Bot stopped.")