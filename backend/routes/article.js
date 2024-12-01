import express from 'express';
import upload from '../middlewares/upload.js';
import { createArticle, deleteArticle, editArticle, getArticleById, getPagingArticle, searchArticle } from '../controllers/article.js';
import authentication from "../middlewares/authentication.js"
import authorization from '../middlewares/authorization.js';

const router = express.Router();
router.get('/search', authentication, authorization(["view-article"]), searchArticle)
router.get('/get-paging-article', authentication, authorization(["view-article"]), getPagingArticle)
router.get('/get-article/:id', authentication, authorization(["view-article"]), getArticleById)
router.put('/edit-article/:id', upload.single('thumbnail'), authentication, authorization(["edit-article"]), editArticle)
router.post('/create-article', upload.single('thumbnail'), authentication, authorization(["create-article"]), createArticle);
router.delete('/delete-article/:id', authentication, authorization(["delete-article"]), deleteArticle)


export default router;
