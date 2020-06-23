import express from "express";

import setupDotenv from "./setup/dotenv";
import setupDb from "./setup/setup-db";
import setupMiddlewares from "./setup/middlewares";
import setupRoutes from "./setup/routes";
import startServer from "./setup/start-server";

const app = express();

setupDotenv();

setupDb();

setupMiddlewares(app);

setupRoutes(app);

startServer(app);