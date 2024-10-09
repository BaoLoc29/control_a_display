import express from 'express';
import { Login, createUser } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();

router.post('/login', Login);
router.post('/create-user', authentication, createUser);

export default router;
