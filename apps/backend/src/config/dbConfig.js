const mongoose = require('mongoose');

const connectDB = async () => {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        poolSize: 10,  // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
        family: 4  // Use IPv4, skip trying IPv6
    };

    try {
        await mongoose.connect(process.env.MONGO_URI, dbOptions);
        console.log('MongoDB connected...');

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.error('Mongoose disconnected');
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
