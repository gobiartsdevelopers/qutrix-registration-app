const User = require('../models/user.model');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

/**
 * @description Register or update event participation for a user
 * @route POST /api/v1/register
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.registerOrUpdateEvent = catchAsyncErrors(async (req, res, next) => {
    console.log({ registerOrUpdateEvent: req.body });
    try {
        const { name, rollNumber, email, mobile, college, department, event } =
            req.body;

        // Check if the user with the same roll number or email already exists
        let existingUser = await User.findOne({
            $or: [{ rollNumber }, { email }],
        });

        if (!existingUser) {
            // If the user does not exist, create a new user
            existingUser = new User({
                name,
                rollNumber,
                email,
                mobile,
                college,
                department,
                event,
            });
        } else {
            // Define event participation rules
            const eventRules = {
                Quiz: ['WordHunt', 'WebDesign'],
                WordHunt: ['Quiz', 'SoftwareContest'],
                SoftwareContest: ['WordHunt', 'WebDesign'],
                WebDesign: ['Quiz', 'SoftwareContest'],
            };

            // Check if the user is already participating in the selected event
            if (existingUser.event.includes(event)) {
                return next(
                    new ErrorHandler(
                        `You are already participating in ${existingUser.event}`,
                        400
                    )
                );
            }

            // Check if the user is already participating in an incompatible event
            const existingEvents = existingUser.event[0];

            const incompatibleEvents = eventRules[existingEvents];
            console.log({ incompatibleEvents });
            if (incompatibleEvents) {
                for (const incompatibleEvent of incompatibleEvents) {
                    if (event.includes(incompatibleEvent)) {
                        return next(
                            new ErrorHandler(
                                `Cannot participate in ${event} while participating in ${existingEvents}`,
                                400
                            )
                        );
                    }
                }
            }

            // Filter out duplicate events and append the new events to the existing ones
            const uniqueEvents = [...new Set(existingUser.event.concat(event))];
            existingUser.event = uniqueEvents;
        }

        // Save the user document to the database (either a new user or updated user)
        await existingUser.save();

        res.status(201).json({
            message: 'Event registration updated successfully',
            user: existingUser,
        });
    } catch (err) {
        console.error(err);
        next(new ErrorHandler('Internal server error', 500));
    }
});

exports.getStudentsByEachEvent = async (req, res, next) => {
    try {
        const studentsByEvent = await User.aggregate([
            {
                $unwind: '$event', // Unwind the array field 'event'
            },
            {
                $group: {
                    _id: '$event', // Group by the 'event' field
                    students: {
                        $push: {
                            name: '$name',
                            rollNumber: '$rollNumber',
                            college: '$college',
                            department: '$department',
                            mobile: '$mobile',
                            email: '$email',
                        },
                    },
                },
            },
        ]);

        if (!studentsByEvent?.length)
            return next(new ErrorHandler('No students found', 404));

        res.status(200).json({
            success: true,
            data: studentsByEvent,
        });
    } catch (error) {
        console.log({ myError: error });
        next(new ErrorHandler('Internal server error', 500));
    }
};

exports.getStudentsByEachCollege = async (req, res, next) => {
    try {
        const studentsByCollege = await User.aggregate([
            {
                $group: {
                    _id: '$college', // Group by the 'college' field
                    students: {
                        $push: {
                            name: '$name',
                            rollNumber: '$rollNumber',
                            department: '$department',
                            event: '$event',
                            mobile: '$mobile',
                            email: '$email',
                        },
                    },
                },
            },
        ]);

        if (!studentsByCollege?.length)
            return next(new ErrorHandler('No students found', 404));

        res.status(200).json({
            success: true,
            data: studentsByCollege,
        });
    } catch (error) {
        console.log({ getStudentsByCollegeError: error });
        next(new ErrorHandler('Internal server error', 500));
    }
};

exports.getStudentsBySpecificEvent = async (req, res, next) => {
    try {
        const { event } = req.body;

        const studentsBySpecificEvent = await User.find({
            event, // Filter by the specified event
        }).select('college name rollNumber mobile event email');

        if (!studentsBySpecificEvent?.length)
            return next(new ErrorHandler('No students found', 404));

        res.status(200).json({
            success: true,
            data: studentsBySpecificEvent,
        });
    } catch (error) {
        console.log({ getStudentsBySpecificEventError: error });
        next(new ErrorHandler('Internal server error', 500));
    }
};

exports.getStudentsBySpecificCollege = async (req, res, next) => {
    try {
        const { college } = req.body;

        const studentsBySpecificCollege = await User.find({
            college, // Filter by the specified college
        }).select('college name rollNumber mobile event');

        if (!studentsBySpecificCollege?.length) {
            return next(new ErrorHandler('No students found', 404));
        }

        res.status(200).json({
            success: true,
            data: studentsBySpecificCollege,
        });
    } catch (error) {
        console.log({ getStudentsSpecificCollege: error });
        next(new ErrorHandler('Internal server error', 500));
    }
};

exports.getStudentsWithSpecificEventAndCollege = async (req, res, next) => {
    try {
        const { event, college } = req.body;

        const studentsWithSpecificEventAndCollege = await User.find({
            event, // Filter by the specified event
            college, // Filter by the specified college
        }).select('college name rollNumber mobile event');

        if (!studentsWithSpecificEventAndCollege?.length) {
            return next(new ErrorHandler('No students found', 404));
        }

        res.status(200).json({
            success: true,
            data: studentsWithSpecificEventAndCollege,
        });
    } catch (error) {
        console.log({ getStudentsWithSpecificEventAndCollege: error });
        next(new ErrorHandler('Internal server error', 500));
    }
};
