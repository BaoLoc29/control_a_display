import express from 'express';
import { createArticleCategory, editArticleCategory, getPagingArticleCategory, deleteArticleCategory, getArticleCategoryById, searchArticleCategory } from '../controllers/articleCategory.js';
import upload from '../middlewares/upload.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();
router.get('/get-all', authentication, getPagingArticleCategory)
router.get('/search', authentication, searchArticleCategory)
router.get('/:id', authentication, getArticleCategoryById)
router.post('/create', upload.single('thumbnail'), authentication, createArticleCategory);
router.put('/:id', upload.single('thumbnail'), authentication, editArticleCategory)
router.delete('/:id', authentication, deleteArticleCategory)


export default router;
