// require("dotenv").config({ path: './.env'}); // Load environment variables from .env file 
import dotenv from "dotenv"; //imporoved method to load environment variables using ES6 import syntax
dotenv.config({ path: './.env' }); // Load environment variables from .env file, 

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import {app} from "./app.js"; 

import connectDB from "./db/index.js";
connectDB().then(() => {
    console.log("Database connection established successfully.");

    app.on("error", (error) => {
        console.error("Error in Express app:", error);
    }); //listening for errors in the Express app
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
});
















/*
import express from "express";
const app = express();
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB");
        app.on("error", (error) => {
            console.error("Error in Express app:", error);
        }); //listening for errors in the Express app
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });// Start the Express server after successful MongoDB connection
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
})(); //this is the first approach
*/