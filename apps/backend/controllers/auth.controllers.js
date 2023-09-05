const User = require('../models/user.model');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

/**
 * @description Register a new user
 * @param {/api/v1/register} req
 * @param {*} res
 * @param {*} next
 */
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // console.log("Register", req);
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password, avatar });

    sendToken(user, 201, res);
});
/**
 * @description Login a user
 * @param {/api/v1/login} req
 * @param {*} res
 * @param {*} next
 */
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    console.log('LoginUser', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    //   check if user exists in the database by email address and return error if it does not exist in the database already
    const user = await User.findOne({ email }).select('+password').exec();

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    //   check if password is correct or not
    if (!(await user.isValidatePassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 201, res);
});
/**
 * @description Logout a user
 * @param {/api/v1/logout} req
 * @param {*} res
 * @param {*} next
 */
exports.logoutUser = (req, res, next) => {
    /**
     * TODO - Implement logout functionality
     * 1. Clear cookie
     * 2. Clear session
     * 3. Clear local storage
     * 4. Redirect to login page
     * 5. Show success message
     */
    // * Check if user is logged in
    return res
        .status(200)
        .cookie('token', null, {
            expires: new Date(Date.now()), // set cookie to expire in 1 second
            httpOnly: true,
        })
        .json({
            success: true,
            message: 'Logged out',
        });
};

/**
 * @description Forgot password
 * @param {/api/v1/password/forgot} req
 * @param {*} res
 * @param {*} next
 */
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    console.log('ForgotPassword', req.body);
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    const resetToken = await user.getResetPasswordToken();
    //  save the user with the reset token
    await user.save({ validateBeforeSave: false }); // validateBeforeSave: false - to skip the validation

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    console.log({ resetUrl });
    const message = `Your password reset token is as follow:\n\n ${resetUrl} \n\nIf you have not requested this email, then ignore it.`;
    try {
        sendEmail({
            email: user.email,
            subject: 'Qutrix Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        // if email is not sent, then reset the resetPasswordToken and resetPasswordTokenExpire fields in the database to undefined and return error message to the user with status code 500 (internal server error)
        console.log({ error });
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});
/**
 * @description Password Reset
 * @param {/api/v1/password/reset/:token} req
 * @param {*} res
 * @param {*} next
 */
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    console.log('ResetPassword', req.body);
    const resetPasswordToken = req.params.token;
    console.log({ resetPasswordToken });
    //   hash url token and compare it with the resetPasswordToken in the database to see if it matches or not and return error if it does not match with the resetPasswordToken in the database
    const resetPasswordTokenHash = crypto
        .createHash('sha256')
        .update(resetPasswordToken)
        .digest('hex');

    console.log({ resetPasswordTokenHash });
    //  check if the user exists in the database with the resetPasswordTokenHash
    const user = await User.findOne({
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordTokenExpire: { $gt: Date.now() }, // check if the resetPasswordTokenExpire is greater than the current date and time or not and return error if it is not greater than the current date and time (expired)
    });

    if (!user) {
        // if user does not exist in the database with the resetPasswordTokenHash, then return error message to the user with status code 400 (bad request)
        return next(
            new ErrorHandler(
                'Password reset token is invalid or has expired',
                400
            )
        );
    }

    //   if user exists in the database with the resetPasswordTokenHash, then set the new password
    if (req.body.password !== req.body.confirmPassword) {
        // check if password and confirm password matches or not
        return next(new ErrorHandler('Password does not match', 400));
    }

    // setup the new password and save it to the database and return success message to the user with status code 200 (ok)
    user.password = req.body.password;
    user.resetPasswordToken = undefined; // set the resetPasswordToken to undefined
    user.resetPasswordTokenExpire = undefined; // set the resetPasswordTokenExpire to undefined
    await user.save({ validateBeforeSave: false }); // save the user with the new password

    // send the token to the user
    sendToken(user, 200, res);
});

//* =====================================================
/**
 * @description Get currently logged in user details
 * @param {/api/v1/myprofile} req
 * @param {*} res
 * @param {*} next
 */

exports.getMyProfile = catchAsyncErrors(async (req, res, next) => {
    console.log('GetUserProfile', req.body);
    // get the user details from the database with the id from the token
    const user = await User.findById(req.user.id);

    //  return error if user does not exist in the database with the id from the token (user is not logged in)
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // return user details if user exists in the database with the id from the token (user is logged in)
    return res.status(200).json({
        success: true,
        user,
    });
});

/**
 * @description Change currently logged in user password
 * @param {/api/v1/password/change} req
 * @param {*} res
 * @param {*} next
 */

exports.changeMyPassword = catchAsyncErrors(async (req, res, next) => {
    // console.log("changeMyPassword", req.body);
    const { oldPassword, password } = req.body;
    if (!oldPassword || !password) {
        // check if old password and new password is provided or not and return error if it is not provided
        return next(
            new ErrorHandler(
                'Please provide old password and new password',
                400
            )
        );
    }

    if (oldPassword === password) {
        // check if old password and new password matches or not and return error if it matches
        return next(
            new ErrorHandler('Old password and new password are same', 400)
        );
    }

    // get the user details from the database with the id from the token and select the password field from the database as well (by default password field is not selected)
    const user = await User.findById(req.user?.id).select('+password');

    //  return error if user does not exist in the database with the id from the token (user is not logged in)
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // check if the old password matches with the password in the database or not and return error if it does not match
    if (!(await user.isValidatePassword(oldPassword))) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    // if old password matches with the password in the database, then set the new password and save it to the database
    user.password = password;
    await user.save({ validateBeforeSave: true }); // save the user with the new password

    return res.status(200).json({
        success: true,
    });
});

/**
 * @description Update currently logged in user profile
 * @param {/api/v1/update} req
 * @param {*} res
 * @param {*} next
 */

exports.updateMyProfile = catchAsyncErrors(async (req, res, next) => {
    let newUserData = {
        name: req.body?.name,
        email: req.body?.email,
    };

    let avatar;
    if (req.file) {
        // avatar = `${req.protocol}://${req.get("host")}/uploads/user/${
        //   req.file.filename
        // }`;
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.filename}`;
        newUserData = { ...newUserData, avatar };
    }

    // get the user details from the database with the id from the token
    const user = await User.findByIdAndUpdate(req.user?.id, newUserData, {
        new: true, // return the updated user details to the user
        runValidators: true, // run the validators on the updated user details as well
    });

    //  return error if user does not exist in the database with the id from the token (user is not logged in)
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    return res.status(200).json({ success: true, user });
});

// * ======================== ADMIN =============================

/**
 * @description Get all users
 * @param {/api/v1/admin/users} req
 * @param {*} res
 * @param {*} next
 */

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    // get all the users from the database
    const users = await User.find();
    // return error if users does not exist in the database (no users in the database)
    if (!users) {
        return next(new ErrorHandler('No users found', 404));
    }
    return res.status(200).json({
        success: true,
        users,
    });
});

/**
 * @description Get specific user details
 * @param {/api/v1/admin/user/:id} req
 * @param {*} res
 * @param {*} next
 */

exports.getSpecificUser = catchAsyncErrors(async (req, res, next) => {
    // get the id from the url
    const { id } = req.params;
    // get the user details from the database with the id from the url
    const user = await User.findById(id);
    // return error if users does not exist in the database (no users in the database)
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${id}`, 404));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});

/**
 * @description Update specific user details
 * @param {/api/v1/admin/user/:id} req
 * @param {*} res
 * @param {*} next
 */

exports.updateSpecificUser = catchAsyncErrors(async (req, res, next) => {
    // get the id from the url
    /**
     * TODO: add validation for the role field
     *
     */
    const { id } = req.params;
    const newUserData = {
        name: req.body?.name,
        email: req.body?.email,
        role: req.body?.role,
    };

    // get the user details from the database with the id from the token
    const user = await User.findByIdAndUpdate(id, newUserData, {
        new: true, // return the updated user details to the user
        runValidators: true, // run the validators on the updated user details as well
    });

    //  return error if user does not exist in the database with the id from the token (user is not logged in)
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${id}`, 404));
    }

    return res.status(200).json({ success: true, user });
});

/**
 * @description Delete specific user details
 * @param {/api/v1/admin/user/:id} req
 * @param {*} res
 * @param {*} next
 */

exports.deleteSpecificUser = catchAsyncErrors(async (req, res, next) => {
    // get the id from the url
    const { id } = req.params;
    // get the user details from the database with the id from the token
    const user = await User.findById(id);

    //  return error if user does not exist in the database with the id from the token (user is not logged in)
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${id}`, 404));
    }

    // delete the user from the database
    await user.remove();

    return res.status(200).json({ success: true });
});
