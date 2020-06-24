import express from "express";
import cookieparser from "cookie-parser";
import expressBearerToken from "express-bearer-token";
import cors from "cors";

function setupBearerToken(app) {
    //
    const cookieSecret = process.env.COOKIE_SECRET || 'Q0KreyGX77';
    
    const opts = {
        cookie: {
            signed: true, // if passed true you must pass secret otherwise will throw error
            secret: cookieSecret,
            key: 'access_token' // default value
        }
    };
    app.use(expressBearerToken(opts));
    app.use(cookieparser(cookieSecret));
}

export default function(app) {
    //
    console.info('Setting up middlewares...');
    try {
        //
        app.use(cors());
        app.use(express.json());
        setupBearerToken(app);
    } catch (e) {
        console.error(`Setup Middlewares Error: ${e}`);
    }

}