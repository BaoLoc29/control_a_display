
import joi from "joi";
import toSlug from '../utils/toSlug.js';
import handleUpload from "../utils/cloundinary.js";
import ArticleCategory from "../models/articleCategory.js";
import Article from "../models/article.js"

export const createArticle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Thumbnail image is required!",
            });
        }
        // Convert the image to base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload the image to Cloudinary
        const result = await handleUpload(dataURI);

        const {
            title,
            slug: useSlug,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            status,
            popular,
            articleCategoryId
        } = req.body;
        const user = req.user;

        const slug = useSlug ? toSlug(useSlug) : toSlug(title);
        const thumbnail = result.url;

        // Validate input data
        const createSchema = joi.object({
            title: joi.string().required().messages({
                'string.empty': 'Title article is required!',
            }),
            summary: joi.string().required().messages({
                'string.empty': 'Summary article is required!',
            }),
            seo_title: joi.string().required().messages({
                'string.empty': 'SEO title article is required!',
            }),
            seo_keywords: joi.string().required().messages({
                'string.empty': 'SEO keywords article is required!',
            }),
            seo_description: joi.string().required().messages({
                'string.empty': 'SEO description article is required!',
            }),
            description: joi.string().required().messages({
                'string.empty': 'Description article is required!',
            }),
            articleCategoryId: joi.string().required().messages({
                'string.empty': 'Article category ID is required!',
            }),
        });

        const { error } = createSchema.validate({
            title,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            articleCategoryId,
        });

        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Check if the slug already exists
        const findSlug = await Article.findOne({ slug });
        if (findSlug) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        const findCategory = await ArticleCategory.findById(articleCategoryId)
        if (!findCategory) {
            return res.status(404).json({
                message: "Category not found!"
            });
        }

        const article = await Article.create({
            title,
            slug,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            status,
            popular,
            thumbnail,
            articleCategoryId,
            author: user._id,
        })
        // Cập nhật Menu với articleCategoryId
        findCategory.articleId.push(article._id);
        await findCategory.save();

        return res.status(201).json({
            message: "Created successfully!",
            data: article
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const editArticle = async (req, res) => {
    try {
        const { id } = req.params
        const {
            title,
            slug: useSlug,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            status,
            popular,
            articleCategoryId
        } = req.body;
        const user = req.user;
        const slug = useSlug ? toSlug(useSlug) : toSlug(title);

        // Validate input data
        const createSchema = joi.object({
            title: joi.string().required().messages({
                'string.empty': 'Title article is required!',
            }),
            summary: joi.string().required().messages({
                'string.empty': 'Summary article is required!',
            }),
            seo_title: joi.string().required().messages({
                'string.empty': 'SEO title article is required!',
            }),
            seo_keywords: joi.string().required().messages({
                'string.empty': 'SEO keywords article is required!',
            }),
            seo_description: joi.string().required().messages({
                'string.empty': 'SEO description article is required!',
            }),
            description: joi.string().required().messages({
                'string.empty': 'Description article is required!',
            }),
            articleCategoryId: joi.string().required().messages({
                'string.empty': 'Article category ID is required!',
            }),
        });

        const { error } = createSchema.validate({
            title,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            articleCategoryId,
        });

        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Lấy thông tin article hiện tại
        const existingArticle = await Article.findById(id);
        if (!existingArticle) {
            return res.status(404).json({ message: "Article not found!" });
        }

        const oldArticle = existingArticle.articleCategoryId;

        // Nếu có tệp (ảnh) thì upload lên Cloudinary
        let thumbnail;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await handleUpload(dataURI);
            thumbnail = result.url;
        }

        // Kiểm tra nếu slug đã tồn tại trong cơ sở dữ liệu (trừ bản ghi hiện tại)
        const duplicateSlug = await Article.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        // Tạo object để cập nhật
        const updatedData = {
            title,
            slug,
            summary,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            articleCategoryId,
            status,
            popular,
            articleCategoryId,
            author: user._id
        };

        // Nếu có ảnh thì thêm ảnh vào dữ liệu cần cập nhật
        if (thumbnail) {
            updatedData.thumbnail = thumbnail;
        }

        const updateArticle = await Article.findByIdAndUpdate(id, updatedData, { new: true })

        if (!updateArticle) {
            return res.status(400).json({ message: "Failed to update article!" });
        }

        const findCategory = await ArticleCategory.findById(articleCategoryId)
        if (!findCategory) {
            return res.status(400).json({ message: "Category not found!" });
        }

        if (oldArticle && oldArticle !== articleCategoryId) {
            const findOldCategory = await ArticleCategory.findById(oldArticle)
            if (findOldCategory) {
                findOldCategory.articleId = findOldCategory.articleId.filter(
                    (articleId) => articleId.toString() !== id
                );
                await findOldCategory.save();
            }
        }
        // Thêm articleId vào category mới
        const newArticle = await ArticleCategory.findById(articleCategoryId);
        if (!newArticle) {
            return res.status(404).json({ message: "Article not found!" });
        }

        if (!newArticle.articleId.includes(updateArticle._id)) {
            newArticle.articleId.push(updateArticle._id);
            await newArticle.save();
        }

        return res.status(200).json({
            message: "Updated successfully!",
            data: updateArticle,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getPagingArticle = async (req, res) => {
    try {
        const query = req.query
        const articles = await Article.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })
            .populate('author', 'name')

        const countArticles = await Article.countDocuments()
        const totalPage = Math.ceil(countArticles / query.pageSize)

        return res.status(200).json({ articles, totalPage, count: countArticles })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const searchArticle = async (req, res) => {
    try {
        const { title } = req.query
        const articles = await Article.find({ title: { $regex: title, $options: 'i' } }).sort({ createdAt: "desc" })
        if (articles.length === 0) {
            return res.status(404).json({ message: "Article not found!" })
        }
        return res.status(200).json({ articles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findByIdAndDelete(id)
        if (!article) {
            return res.status(404).json({ message: "Article not found!" })
        }
        return res.status(200).json({ message: "Deleted successfully!" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findById(id)
        if (!article) {
            return res.status(404).json({ message: "Article does not exist!" });
        }
        return res.status(200).json({ article });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}