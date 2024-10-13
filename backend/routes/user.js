import express from 'express';
import { Login, changePassword, createUser, editUser, getUserById, getUserProfile } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();
router.get("/get-user-profile", authentication, getUserProfile)
router.get("/:id", authentication, getUserById)
router.patch("/edit-user/:id", authentication, editUser)
router.post('/login', Login);
router.post('/create-user', authentication, createUser);
router.put("/change-password/:id", authentication, changePassword)
export default router;
