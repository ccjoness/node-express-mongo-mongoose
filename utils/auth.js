const jwtMiddleware = require('express-jwt');
const {JWT_SECRET} = require('./secrets');
const {compose} = require('compose-middleware');

const handleAuthError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log(err);

    }
    next();
};

const jwtAuth = compose([
    jwtMiddleware({secret: JWT_SECRET}),
    handleAuthError
]);

module.exports = {
    handleAuthError,
    jwtAuth
};