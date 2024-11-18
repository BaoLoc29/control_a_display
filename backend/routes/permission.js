import express from 'express';
import { createPermission, getAllPermission } from '../controllers/permission.js';

const router = express.Router();
router.get("/get-all", getAllPermission);
router.post('/create-permission', createPermission);
export default router;
