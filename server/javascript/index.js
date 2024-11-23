const express = require('express');
const mongoose = require('mongoose');
;
const dotenv=require('dotenv')
const app = express();
const PORT = 8000 || process.env.PORT;
dotenv.config();
// Middleware


// MongoDB Connection
const uri = process.env.MONGODB_URI

// Connect to MongoDB using Mongoose
const connectingTODB = async () => {
    const conn=await mongoose.createConnection(uri)
    console.log("Connected to MongoDB");
}
// Schema and Model
app.listen(PORT,()=>{
    console.log("server is running on port 3000");
    connectingTODB();
})

