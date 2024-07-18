import mongoose from "mongoose";
import dontenv from "dotenv";
dontenv.config();

const connectToMongoDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("You are connected to mongoDB.")
    } catch (error) {
        console.log(error.message)
    }
}

export default connectToMongoDb;