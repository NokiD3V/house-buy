const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

module.exports = app => {
  const router = require('express').Router()

  const requestsController = require('../controllers/requests.controller')

  const { body } = require('express-validator')

  router.get('/all', authMiddleware, adminMiddleware, requestsController.all)
  router.get('/all/self', authMiddleware, requestsController.self)

  router.post('/create', 
  authMiddleware, 
  body('offerID').isLength({min: 1}), 
  body('phoneNumber').isString(),

  requestsController.create)

  router.post('/close', 
    authMiddleware, 
    adminMiddleware,     
    requestsController.close
  )

  router.use((err, req, res, next) => {
    console.log(err)
    if(err.status != 200) res.status(err.status).send({
      success: false,
      message: err.errors[0]
    })
    next(err)
  })

  app.use('/api/requests', router)
}
