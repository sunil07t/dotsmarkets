/** 
Inspo from: 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI: string = process.env.MONGODB_URI;

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
  
    return mongoose.connect(MONGODB_URI, { 
        bufferCommands: false,
        dbName: 'DotsMarkets', 
    });
}

export default dbConnect;
