import express from "express";
import cookieparser from "cookie-parser";
import { ErrorHandler } from "@core/middlewares/error-handler";

export default function(app) {
    //
    console.info('Setting up middlewares...');
    try {
        app.use(express.json());
        app.use(cookieparser());
        app.use(ErrorHandler);
    } catch (e) {
        console.error(e);
    }

}