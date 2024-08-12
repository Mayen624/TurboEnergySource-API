import mongoose from 'mongoose';

const dbConnect = async () => {

    try {

        //"mongodb+srv://<username>:<password>@mayen-mongodb-cluster.becnumd.mongodb.net/?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster";
        let URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayen-mongodb-cluster.becnumd.mongodb.net/?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster`;

        await mongoose.connect(URI);

        console.info('***Database successfully connected***');
    } catch (e) {
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

