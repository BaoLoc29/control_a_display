import express from 'express';
import { createMenu, deleteMenu, editMenu, getMenuById, getPagingMenu, searchMenu } from '../controllers/menu.js';
import authentication from './../middlewares/authentication.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();
router.get('/get-menu/:id', authentication, authorization(["view-menu"]), getMenuById)
router.get('/get-paging-menu', authentication, authorization(["view-menu"]), getPagingMenu)
router.post('/create-menu', authentication, authorization(["create-menu"]), createMenu);
router.delete('/delete-menu/:id', authentication, authorization(["delete-menu"]), deleteMenu)
router.put('/edit-menu/:id', authentication, authorization(["edit-menu"]), editMenu)
router.post('/search-menu', authorization(["view-menu"]), searchMenu)
export default router;
