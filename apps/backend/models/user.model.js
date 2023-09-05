const mongoose = require("mongoose");
const validator = require("validator");
const validEvents = [
  "Quiz",
  "WordHunt",
  "SoftwareContest",
  "WebDesign",
  "PPT",
  "Marketing",
];
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
    },
    rollNumber: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Please enter your roll number"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: [true, "This email is already registered"],
      validate: [validator.isEmail, "Please enter valid email address"],
      required: [true, "Please enter your email"],
    },
    mobile: {
      type: String,
      trim: true,
      unique: [true, "This mobile number is already registered"],
      validate: [
        {
          validator: (value) => {
            return validator.isMobilePhone(value, "en-IN");
          },
          message: "Please enter a valid (Indian) mobile number",
        },
      ],
      required: [true, "Please enter your Mobile Number"],
    },

    college: {
      type: String,
      lowercase: true,
      required: [true, "Please provide a college name"],
    },
    department: {
      type: String,
      lowercase: true,
      required: [true, "Please provide a department"],
      enum: {
        values: [
          "b.c.a",
          "b.sc ai&ds",
          "b.sc cs",
          "b.sc it",
          "b.sc ct",
          "b.sc iot",
          "mca",
          "m.sc cs",
          "m.sc ct",
          "m.sc it",
        ],
        message: "Please select correct department",
      },
    },
    event: [
      {
        type: String,
        trim: true,
        required: [true, "Please provide an event"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

/*
event: [
      {
        type: String,
        lowercase: true,
        required: [true, "Please provide an event"],
        validate: [
          {
            validator: function (value) {
              if (!validEvents.includes(value)) {
                return false;
              }

              if (value === "quiz") {
                return true;
              }

              if (
                ["word-hunt", "web-design"].includes(value) &&
                this.event.some((ev) =>
                  ["word-hunt", "web-design"].includes(ev)
                )
              ) {
                return false;
              }

              return true;
            },
            message: "Please select a correct combination of events",
          },
        ],
*/
