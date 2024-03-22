const authMiddleware = require('../middlewares/auth.middleware')

module.exports = app => {
  const router = require('express').Router()

  const ratingsController = require('../controllers/ratings.controller')

  const { body } = require('express-validator')

  router.get('/all', ratingsController.getAll)

  router.post('/create', authMiddleware, body('message').isLength({min: 30}), ratingsController.create)

  
  router.use((err, req, res, next) => {
    console.log(err)
    if(err.status != 200) res.status(err.status).send({
      success: false,
      message: err.errors[0]
    })
    next(err)
  })
  

  app.use('/api/ratings', router)
}
