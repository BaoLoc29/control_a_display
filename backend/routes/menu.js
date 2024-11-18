import express from 'express';
import { createMenu, deleteMenu, editMenu, getMenuById, getPagingMenu, searchMenu } from '../controllers/menu.js';
import authentication from './../middlewares/authentication.js';

const router = express.Router();
router.get('/get-menu/:id', authentication, getMenuById)
router.get('/get-paging-menu', authentication, getPagingMenu)
router.post('/create-menu', authentication, createMenu);
router.delete('/delete-menu/:id', authentication, deleteMenu)
router.put('/edit-menu/:id', authentication, editMenu)
router.post('/search-menu', searchMenu)
export default router;
