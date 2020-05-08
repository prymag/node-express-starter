import express from "express";
import AuthController from './controllers/auth.controller';

const router = express.Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);

export default router;