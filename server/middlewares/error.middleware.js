const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token.service')

module.exports = async (err, req, res, next) => {
    if(err.status != 200) res.status(err.status).send({
        success: false,
        message: err.errors[0]
    })
    else next()
}
