import express from 'express';
import { createRole, deleteRole, editRole, getAllRole, getPagingRole, getRoleById, searchRole } from '../controllers/role.js';
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

const router = express.Router();
router.get("/get-all-role", authentication, authorization(["view-role"]), getAllRole)
router.get('/search-role', authentication, authorization(["view-role"]), searchRole)
router.post('/create-role', authentication, authorization(["create-role"]), createRole)
router.get('/get-role/:id', authentication, authorization(["view-role"]), getRoleById)
router.get('/get-paging-role', authentication, authorization(["view-role"]), getPagingRole)
router.put('/edit-role/:id', authentication, authorization(["edit-role"]), editRole)
router.delete('/:id', authentication, authorization(["delete-role"]), deleteRole)
export default router;
