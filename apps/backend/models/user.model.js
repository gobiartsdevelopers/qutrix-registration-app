const mongoose = require('mongoose');
const validator = require('validator');
const validEvents = [
    'quiz',
    'word-hunt',
    'software-contest',
    'web-design',
    'ppt',
    'marketing',
];
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please enter your name'],
        },
        rollNumber: {
            type: String,
            lowercase: true,
            trim: true,
            required: [true, 'Please enter your roll number'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: [true, 'This email is already registered'],
            validate: [validator.isEmail, 'Please enter valid email address'],
            required: [true, 'Please enter your email'],
        },
        mobile: {
            type: String,
            trim: true,
            unique: [true, 'This mobile number is already registered'],
            validate: [
                {
                    validator: (value) => {
                        return validator.isMobilePhone(value, 'en-IN');
                    },
                    message: 'Please enter a valid (Indian) mobile number',
                },
            ],
            required: [true, 'Please enter your Mobile Number'],
        },

        college: {
            type: String,
            lowercase: true,
            required: [true, 'Please provide a college name'],
        },
        department: {
            type: String,
            lowercase: true,
            required: [true, 'Please provide a department'],
            enum: {
                values: ['mca', 'it'],
                message: 'Please select correct department',
            },
        },
        event: [
            {
                type: String,
                lowercase: true,
                required: [true, 'Please provide an event'],
                validate: [
                    {
                        validator: function (value) {
                            // Check if the value is a valid event
                            if (!validEvents.includes(value)) {
                                return false;
                            }

                            // Check custom logic for "quiz," "word-hunt," and "web-design"
                            if (value === 'quiz') {
                                return true;
                            }

                            // Check that "word-hunt" and "web-design" are not selected together
                            if (
                                (value === 'word-hunt' ||
                                    value === 'web-design') &&
                                this.event.includes('word-hunt') &&
                                this.event.includes('web-design')
                            ) {
                                return false;
                            }

                            return true;
                        },
                        message:
                            'Please select a correct combination of events',
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
