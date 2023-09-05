const User = require('../models/user.model');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

/**
 * @description Register a new student with event participation
 * @route POST /api/v1/register
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.registerStudent = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, rollNumber, email, mobile, college, department, event } =
            req.body;

        // Check if the user with the same roll number or email already exists
        // const existingUser = await User.findOne({
        //     $or: [{ rollNumber }, { email }],
        // });
        const validEvents = [
            'quiz',
            'word-hunt',
            'software-contest',
            'web-design',
            'ppt',
            'marketing',
        ];
        // if (existingUser) {
        //     return next(
        //         new ErrorHandler(
        //             400,
        //             'User with the same roll number or email already exists'
        //         )
        //     );
        // }

        // Define event participation rules
        const eventRules = {
            quiz: ['word-hunt', 'web-design'],
            'word-hunt': ['quiz', 'software-contest'],
            'software-contest': ['word-hunt', 'web-design'],
            'web-design': ['quiz', 'software-contest'],
        };

        // Check event selections against the rules
        for (const selectedEvent of event) {
            const incompatibleEvents = eventRules[selectedEvent];
            if (incompatibleEvents) {
                const intersection = incompatibleEvents.filter((e) =>
                    event.includes(e)
                );
                if (intersection.length > 0) {
                    return next(
                        new ErrorHandler(
                            400,
                            `Cannot participate in "${selectedEvent}" while participating in "${intersection.join(
                                ', '
                            )}"`
                        )
                    );
                }
            }
        }

        // Create a new user document
        const newUser = new User({
            name,
            rollNumber,
            email,
            mobile,
            college,
            department,
            event,
        });

        // Save the user document to the database
        await newUser.save();

        res.status(201).json({
            message: 'Student registered successfully',
            user: newUser,
        });
    } catch (err) {
        console.error(err);
        next(new ErrorHandler(500, 'Internal server error'));
    }
});
