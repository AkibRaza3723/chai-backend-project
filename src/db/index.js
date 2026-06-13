import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Connected to MongoDB!! DB HOST: ${connectionInstance.connection.host}`); //after successful connection we can use connectionInstance for further operations like querying the database, defining models, etc.
        return connectionInstance; // Return the connection instance for further use, it is useful for testing or if you want to perform operations immediately after connecting
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with a failure code
    }
};

export default connectDB; // we used default export here because we are exporting a single function, it allows us to import this function without using curly braces in other files, making the import statement cleaner and more straightforward. ex: import connectDB from "./db/index.js";