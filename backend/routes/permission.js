import express from 'express';
import { createPermission, getAllPermission } from '../controllers/permission.js';

const router = express.Router();
router.get("/", getAllPermission);
router.post('/create-permission', createPermission);
export default router;
