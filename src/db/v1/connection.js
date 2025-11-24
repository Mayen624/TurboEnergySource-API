import mongoose from 'mongoose';

const dbConnect = async () => {

    try {
        let URI;

        // Prioridad 1: Si MONGODB_URI está definido, usarlo directamente
        if (process.env.MONGODB_URI) {
            URI = process.env.MONGODB_URI;
            console.log('🔌 Conectando a MongoDB...');
            console.log('   Usando MONGODB_URI definido en variables de entorno');
        }
        // Prioridad 2: Si estamos en PRODUCCIÓN → usar MongoDB de Dokploy
        else if (process.env.NODE_ENV === 'production') {
            URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
            console.log('🔌 Conectando a MongoDB (Dokploy - Producción)...');
            console.log('   Host:', process.env.DB_HOST);
        }
        // Prioridad 3: Si estamos en DESARROLLO → usar MongoDB Atlas (cloud)
        else {
            URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayen-mongodb-cluster.becnumd.mongodb.net/${process.env.DB_NAME || 'turboenergy'}?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster`;
            console.log('🔌 Conectando a MongoDB Atlas (Cloud - Desarrollo)...');
            console.log('   Cluster: mayen-mongodb-cluster');
        }

        await mongoose.connect(URI);

        console.info('✅ ***Database successfully connected***');
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

