import mongoose from "mongoose"
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DATA_URL
const connectToDb = async () => {
    try {
        await mongoose.connect(url)
        console.log("Database connect successful")
    } catch (error) {
        console.log(error)
    }
}

export default connectToDb