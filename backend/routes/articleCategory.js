import express from 'express';
import { createArticleCategory, editArticleCategory, getPagingArticleCategory, deleteArticleCategory, getArticleCategoryById, searchArticleCategory } from '../controllers/articleCategory.js';
import upload from '../middlewares/upload.js';
import authentication from "../middlewares/authentication.js"
import authorization from '../middlewares/authorization.js';

const router = express.Router();
router.get('/get-all', authentication, authorization(["view-article-category"]), getPagingArticleCategory)
router.get('/search', authentication, authorization(["view-article-category"]), searchArticleCategory)
router.get('/:id', authentication, authorization(["view-article-category"]), getArticleCategoryById)
router.post('/create', upload.single('thumbnail'), authentication, authorization(["create-article-category"]), createArticleCategory);
router.put('/:id', upload.single('thumbnail'), authentication, authorization(["edit-article-category"]), editArticleCategory)
router.delete('/:id', authentication, authorization(["delete-article-category"]), deleteArticleCategory)


export default router;
