import mongoose from 'mongoose';

const dbConnect = async () => {

    try {
        let URI;

        URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayen-mongodb-cluster.becnumd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster`;
        console.log('Conectando a MongoDB Atlas (Cloud)');
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
        await mongoose.connect(URI);

        console.info('**Database successfully connected**');
    } catch (e) {
        console.error('**Error conectando a MongoDB** :', e.message);
        console.error(e);
    }
}

const dbDesconnect = async () => {
    try {
        await mongoose.disconnect();
        console.info('***Database successfully closed***');
    } catch (e) {
        console.error(e);
    }
}

const connection = {
    dbConnect,
    dbDesconnect
}

export default connection;