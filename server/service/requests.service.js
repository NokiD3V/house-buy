const db = require('../models/index')
const Requests = db.requests
const ApiError = require('../exceptions/api-error')
const RequestDto = require('../dtos/request.dto')
const OfferDto = require('../dtos/offer.dto')


class RequestsService {
  async getAll (type = null) {
    try {
      let requests = type ? await Requests.findAll({where: {type, closed: false}}) : await Requests.findAll({where:{closed: false}})
      if (!requests) {
        throw ApiError.BadRequest(`Ошибка сервера. Пожалуйста, обратитесь к разработчикам для решения проблемы.`)
      }

      for(let i = 0; i < requests.length; i++){
        const item = requests[i].dataValues
        const offer = await db.offers.findOne({where:{id: item.offer}})
        if(!offer?.dataValues) return;

        const offerUser = await db.users.findOne({where:{id: offer.user}})
        if(!offerUser?.dataValues) return;

        const requestUser = await db.users.findOne({where:{id: item.user}})
        if(!requestUser?.dataValues) return;

        requests[i] = {
          requests: new RequestDto(item),
          offer: new OfferDto(offer.dataValues),
          requestUser:{
            username: requestUser.username
          },
          offerUser:{
            username: offerUser.username
          }
        }
      }

      return requests
    } catch (error) {
      throw error;
    }
  }

  async getAllSelf(userID){
    try {
      let requests = await Requests.findAll({where: {user: userID}})


      for(let i = 0; i < requests.length; i++){
        let item = requests[i];

        const offer = await db.offers.findOne({where:{id: item.offer}})
        if(!offer?.dataValues) return;
        const user = await db.users.findOne({where:{id: offer.user}})
        if(!user?.dataValues) return;
        let adminClosed = null;
        if(item.closed){
          let adminUser = await db.users.findOne({where:{id: item.closedBy}})
          if(adminUser?.dataValues){
            adminClosed = {
              username: adminUser.username,
              phoneNumber: adminUser.phoneNumber
            }
          }
        }
        item = {
          request: new RequestDto(item.dataValues),
          offer: new OfferDto(offer.dataValues),
          offerContact:{
            name: user.dataValues.username.split(" ")[1]
          },
          admin: adminClosed
        }

        requests[i] = item;
      }

      return requests

    } catch (error) {
      throw error
    }
  }

  async find(offerID, userID){
    const candidate = await Requests.findAll({where: {offer: offerID, user: userID}})

    return candidate
  }

  async create(offerID, userID, phoneNumber, rentdays){
    const response = await Requests.create({
      user: userID,
      offer: offerID,
      phoneNumber,
      rentTime: rentdays
    })

  
    if(response.dataValues) return {success: true}
    else return {success: false}
  }

  async close(requestID, closedBy, closedType, closedComment) {
    try {

      let request = await Requests.findOne({where: {id: requestID}})
      if(!request) throw ApiError.BadRequest("Не найден данный запрос по уникальному индентификатору! Попробуйте заново.")

      Requests.update({ closed: true, closedType, closedBy, closedComment }, {where: {id: requestID}})
      let requestUser = await db.users.findOne({where: {id: request.user}})
      if(requestUser && requestUser?.telegramID != null){
        db.notf.create({
          offer: request.offer,
          closedType,
          closedBy, 
          closedComment: closedComment || "",
          telegramID: requestUser.telegramID
        })
      }

      return {success: true}
    } catch (error) {
      throw error;
    }
  }

}


// async setTask (userID, taskID) {
//   const user = await Users.findOne({
//     where: { id: userID }
//   })
//   if (!user) {
//     throw ApiError.BadRequest('Ошибка системы. Неверный ID пользователя')
//   }
//   const task = await Tasks.findOne({
//     where: { id: taskID }
//   })
//   if (!task) {
//     throw ApiError.BadRequest('Ошибка системы. Неверный ID задачи')
//   }

//   user.update({ currentTask: taskID })

//   await user.save()
// }

module.exports = new RequestsService()
