const RatingDto = require('../dtos/rating.dto')
const ApiError = require('../exceptions/api-error')
const db = require('../models/index')
const Ratings = db.ratings

class RatingService {
    async getAll(){
        try {
            let ratings = await Ratings.findAll()
            if (!ratings) {
              throw ApiError.BadRequest(`Ошибка сервера. Пожалуйста, обратитесь к разработчикам для решения проблемы.`)
            }
      
            for(let i = 0; i < ratings.length; i++){
              const item = ratings[i].dataValues      
              const ratingUser = await db.users.findOne({where:{id: item.user}})
              if(!ratingUser?.dataValues) return;

              ratings[i] = {
                rating: new RatingDto(item),
                user:{
                    username: ratingUser.dataValues.username.split(" ")[1],
                    avatarURL: ratingUser.dataValues.avatarURL
                }
              }
            }
            return ratings
        } catch (error) {
            throw error
        }
    }

    async create(user, message){
      if(!user) throw ApiError.BadRequest("Ошибка данных. Повторите попытку позже", ["Ошибка данных. Повторите попытку позже"])
      if(!message) throw ApiError.BadRequest("Ошибка данных. Повторите попытку позже", ["Ошибка данных. Повторите попытку позже"])
      const candidateRating = await Ratings.findOne({where:{user}})

      if(candidateRating?.dataValues) throw ApiError.BadRequest("Вы уже написали отзыв", ["Вы уже написали отзыв"])
      if(!/^[?!,.а-яА-ЯёЁ0-9A-Za-z()*#%*\s]+$/.test(message)) throw ApiError.BadRequest("Ваше сообщение содержит посторонние символы", ["Ваше сообщение содержит посторонние символы"])
      
      await Ratings.create({ user, message })

      return {success: true}
    }
}

module.exports = new RatingService()
