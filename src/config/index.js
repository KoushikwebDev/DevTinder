require('dotenv').config();

 const config = {
    PORT : process.env.PORT,
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRES_TIME : process.env.JWT_EXPIRES_TIME
};

module.exports = config;