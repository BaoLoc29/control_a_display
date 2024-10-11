import express from 'express';
import { Login, createUser, getUserById, getUserProfile } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();
router.get("/get-user-profile", authentication, getUserProfile)
router.get("/:id", authentication, getUserById)

router.post('/login', Login);
router.post('/create-user', authentication, createUser);

export default router;
