import express from "express";
import UserController from './controllers/user.controller';

const router = express.Router();
const controller = new UserController();

router.get('/', controller.index);
router.post('/', controller.store);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;