const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(
            new ErrorHandler('Login first to access this resource', 401)
        );
    }

    //  verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).exec();
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user is set in isAuthenticatedUser middleware above this middleware function
        // console.log(req.user);
        // console.log(roles);
        // if user role is not in roles array, then return error message
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        // if role is allowed, then go to next middleware
        next();
    };
};
