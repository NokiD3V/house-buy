const authMiddleware = require('../middlewares/auth.middleware')
const createMiddleware = require('../middlewares/create.middleware')

module.exports = app => {
  const router = require('express').Router()

  const offersController = require('../controllers/offers.controller')


  router.get('/all', offersController.all)
  router.get('/get/:id', offersController.getOffer)

  router.post('/create', authMiddleware, createMiddleware, offersController.create)

  router.use((err, req, res, next) => {
    console.log(err)
    if(err.status != 200) res.status(400).send({
      success: false,
      message: err.errors[0]
    })
    next(err)
  })

  app.use('/api/offers', router)
}
