import express from 'express';
import { createPermission, deletedPermission, editPermission, getAllPermission, getPagingPermission, getPermissionById, searchPermission } from '../controllers/permission.js';
import authentication from '../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();
router.get("/get-all-permission", authentication, authorization(["view-permission"]), getAllPermission);
router.get("/get-paging-permission", authentication, authorization(["view-permission"]), getPagingPermission)
router.get("/search-permission", authentication, authorization(["view-permission"]), searchPermission)
router.get("/get-permission/:id", authentication, authorization(["view-permission"]), getPermissionById)
router.put("/update-permission/:id", authentication, authorization(["edit-permission"]), editPermission)
router.post('/create-permission', authentication, authorization(["create-permission"]), createPermission);
router.delete("/delete-permission/:id", authentication, authorization(["delete-permission"]), deletedPermission)
export default router;
