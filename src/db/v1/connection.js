import mongoose from 'mongoose';

const dbConnect = async () => {

    try {
        let URI;

        // Producción → MongoDB de Dokploy (interno)
        if (process.env.NODE_ENV === 'production') {
            URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_INTERNAL_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
            console.log('Conectando a MongoDB (Dokploy - Producción)');
        }
        // Desarrollo → MongoDB Atlas (cloud)
        else {
            URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayen-mongodb-cluster.becnumd.mongodb.net/?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster`;
            console.log('Conectando a MongoDB Atlas (Cloud - Desarrollo)');
        }

        await mongoose.connect(URI);

        console.info('***Database successfully connected***');
    } catch (e) {
        console.error('❌ Error conectando a MongoDB:', e.message);
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