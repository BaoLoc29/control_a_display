import express from 'express';
import { Login, changePassword, createUser, deleteUser, editUser, getPagingUser, getUserById, getUserProfile, searchUser } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

const router = express.Router();
router.get("/get-user-profile", authentication, authorization(["view-profile-user"]), getUserProfile)
router.get("/get-paging-user", authentication, authorization(["view-user"]), getPagingUser)
router.get("/:id", authentication, authorization(["view-user"]), getUserById)
router.put("/edit-user/:id", authentication, authorization(["edit-user"]), editUser)
router.post('/login', Login);
router.post('/create-user', authentication, authorization(["create-user"]), createUser);
router.put("/change-password/:id", authentication, authorization(["edit-user"]), changePassword)
router.delete("/:id", authentication, authorization(["delete-user"]), deleteUser)
router.post("/search-user", authentication, authorization(["view-user"]), searchUser)
export default router;
