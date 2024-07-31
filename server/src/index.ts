import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

import app from "./app";
import config from "./config";
import { connectDB } from "./db/prisma.db";
import loggerWithNameSpace from "./utils/logger.utils";



connectDB()
.then(()=>{
    app.on("error", (error)=>{
        const logger = loggerWithNameSpace("Application Start");
        logger.error(error);
        throw error;
    })
    app.listen(config.port || 3000, ()=>{
        console.log(`Server started at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Database connection failed:- ", error);
})