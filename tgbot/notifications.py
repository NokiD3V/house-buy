from database import query as database_query, execute as database_execute
from aiogram.enums import ParseMode

async def checkNotifications(bot):
    notifications = database_query("SELECT * FROM notfs;")
    if len(notifications) > 0:
        for i in notifications:
            text_send = "🔔 <b>Модератор проверил вашу заявку</b>"
            if i[2] == 0:
                text_send += "\n\n❌ Ответ проверки: ОТКАЗАНО"
            else:
                text_send += "\n\n✅ Ответ проверки: ОДОБРЕНО"
            if len(i[3]) > 1:
                text_send += "\n\n💬 <i>Комментарий модератора:</i> {}".format(i[3])
            adminUser = database_query("SELECT * FROM users WHERE id = {};".format(i[4]))
            if len(adminUser) > 0:
                adminUser = adminUser[0]
                text_send += "\n\n👤 Модератор, проверявший заявку - {}\n📞 Номер телефона: {}".format(
                    adminUser[2],
                    adminUser[6]
                )
            await bot.send_message(i[5], text_send, parse_mode=ParseMode.HTML)
            database_execute("DELETE FROM notfs WHERE id = {};".format(i[0]))