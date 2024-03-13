const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

module.exports = app => {
  const router = require('express').Router()

  const offersController = require('../controllers/offers.controller')


  router.get('/all', offersController.all)
  router.get('/get/:id', offersController.getOffer)

  router.use((err, req, res, next) => {
    console.log(err.message)
    if(err.status != 200) res.status(err.status).send({
      success: false,
      message: err.errors[0]
    })
    next(err)
  })

  app.use('/api/offers', router)
}
