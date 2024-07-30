import mongoose from 'mongodb';

const dbConnect = () => {

    //"mongodb+srv://<username>:<password>@mayen-mongodb-cluster.becnumd.mongodb.net/?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster";
    let URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayen-mongodb-cluster.becnumd.mongodb.net/?retryWrites=true&w=majority&appName=mayen-mongoDB-cluster`;

    mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },(err,res) => {
        if(!err){
            console.log('***Successfuly connection***');
        }else{
            console.log(err);
        }
    });
}

const dbDesconnect = () => {
    mongoose.disconnect({

    }, (err, res) => {
        if(!err){
            console.log('***Database closed***')
        }else{
            console.log(err)
        }
    })
}

const database = {
    dbConnect,
    dbDesconnect
}

export default database;

