import mongoose from 'mongodb';

const dbConnect = () => {

    let URI = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@younotes.lqxi7zf.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;

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

