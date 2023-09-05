const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDB = async () => {
    const MONGO_URI = process.env.MONGODB_LOCAL;
    console.log(`\n 🥭 Database URI : ${MONGO_URI}`);

    await mongoose
        .connect(MONGO_URI, {
            useUnifiedTopology: true,
        })
        .then((result) => {
            console.log(
                `\n MongoDB is connected to the host : ${result.connection.host} \n`
            );
        });
};

module.exports = connectDB;
