import express from 'express';
import { Login, changePassword, createUser, deleteUser, editUser, getPagingUser, getUserById, getUserProfile, searchUser } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();
router.get("/get-user-profile", authentication, getUserProfile)
router.get("/get-paging-user", authentication, getPagingUser)
router.get("/:id", authentication, getUserById)
router.patch("/edit-user/:id", authentication, editUser)
router.post('/login', Login);
router.post('/create-user', authentication, createUser);
router.put("/change-password/:id", authentication, changePassword)
router.delete("/:id", authentication, deleteUser)
router.post("/search-user", authentication, searchUser)
export default router;
