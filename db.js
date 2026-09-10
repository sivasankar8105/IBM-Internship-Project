import mongoose from 'mongoose'

const connectDb = async () => {
    await mongoose.connect("mongodb://muthumaheswaranmm_db_user:FnwVQ34ywdhcUUR0@ac-vnq17dm-shard-00-00.wwh25pt.mongodb.net:27017,ac-vnq17dm-shard-00-01.wwh25pt.mongodb.net:27017,ac-vnq17dm-shard-00-02.wwh25pt.mongodb.net:27017/?ssl=true&replicaSet=atlas-p0z9db-shard-0&authSource=admin&appName=Cluster0");
    console.log("Database Connected Successfully");
}

export default connectDb;
