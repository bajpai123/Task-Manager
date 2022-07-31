const { customApiError } = require('../errors/customError')

//overriding default error handler method
const errorHandlerFunc = (err, req, res, next) => {

    if (err instanceof customApiError) {
        return res.status(500).json({ msg: 'An error occurred', error: err.message })
    }
    res.status(500).json({ err })

}


module.exports = errorHandlerFunc