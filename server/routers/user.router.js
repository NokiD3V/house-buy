const authMiddleware = require('../middlewares/auth.middleware')
const errorMiddleware = require('../middlewares/error.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

module.exports = app => {
  const router = require('express').Router()

  const usersController = require('../controllers/users.controller')

  const { body } = require('express-validator')


  // URL: /api/users/...
  router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 32 }),
    usersController.register
  )
  router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 32 }),
    usersController.login
  )
  router.get('/refresh', usersController.refresh)
  router.post('/logout', usersController.logout)

  router.post('/isadmin', authMiddleware, adminMiddleware, usersController.isAdmin)

  
  router.use((err, req, res, next) => {
    console.log(err)
    if(err.status != 200) res.status(err.status).send({
      success: false,
      message: err.errors[0]
    })
    next(err)
  })
  

  app.use('/api/users', router)
}
