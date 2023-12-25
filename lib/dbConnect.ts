/** 
Inspo from: 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/
import mongoose from "mongoose";

if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
  throw new Error("Please add your MONGODB_URI & DB_NAME to .env.local");
}

const MONGODB_URI: string = process.env.MONGODB_URI;
const DB_NAME: string = process.env.DB_NAME;


async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
  
    return mongoose.connect(MONGODB_URI, { 
        bufferCommands: false,
        dbName: DB_NAME, 
    });
}

export default dbConnect;
