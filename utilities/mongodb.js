// utilities/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://vercel-admin-user:BQPSBIQGwT0wFaYR@baxterdms.cjvream.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let dbInstance = null;

export const connectToDatabase = async () => {
    if (dbInstance) return dbInstance;
    try {
        const client = new MongoClient(uri);
        await client.connect();
        dbInstance = client.db("baxterdms"); // Adjust database name as needed
        return dbInstance;
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        throw error;
    }
};
