
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import axios from "axios";
// import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import propertyRoutes from"./routes/propertyRoute.js"
//configure env
dotenv.config();

//DBCONNECTION
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Dbconnection sucessfull"))
    .catch((err) => {
        console.log(err);
    });

//rest object
const app = express();

app.use(express.json());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});