import mongoose from 'mongoose';

const dbConnection = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB Connected !');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error to connect DB');
    }
}

export {
    dbConnection
}