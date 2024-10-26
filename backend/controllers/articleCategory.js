import ArticleCategory from "../models/articleCategory.js";
import joi from "joi";
import toSlug from '../utils/toSlug.js';
import handleUpload from "../utils/cloundinary.js";

export const createArticleCategory = async (req, res) => {
    try {
        // Convert the image to base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload the image to Cloudinary
        const result = await handleUpload(dataURI);

        const { name, seo_title, seo_keywords, seo_description, slug: userSlug } = req.body;
        const slug = userSlug ? toSlug(userSlug) : toSlug(name);
        const thumbnail = result.url;

        // Validate input data
        const createSchema = joi.object({
            name: joi.string().required().messages({
                'string.empty': 'Name article category is required!',
            }),
            slug: joi.string().required().messages({
                'string.empty': 'Slug article category is required!',
            }),
            seo_title: joi.string().required().messages({
                'string.base': 'SEO Title must be a string!',
            }),
            seo_keywords: joi.string().required().messages({
                'string.base': 'SEO Keywords must be a string!',
            }),
            seo_description: joi.string().required().min(50).max(160).messages({
                'string.empty': 'SEO Description article category is required!',
                'string.min': 'SEO Description must be at least 50 characters long!',
                'string.max': 'SEO Description must be at most 160 characters long!'
            }),
        });

        // Check if the file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Thumbnail image is required!",
            });
        }

        const { error } = createSchema.validate({ name, slug, seo_title, seo_keywords, seo_description });
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details.map((e) => e.message),
            });
        }

        // Check if the slug already exists
        const findSlug = await ArticleCategory.findOne({ slug });
        if (findSlug) {
            return res.status(400).json({
                success: false,
                error: "Slug already exists!",
            });
        }

        // Create a new article category
        const articleCategory = await ArticleCategory.create({ name, slug, seo_title, seo_keywords, seo_description, thumbnail });

        return res.status(201).json({
            success: true,
            data: articleCategory,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const editArticleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, seo_title, seo_keywords, seo_description, slug: userSlug } = req.body;
        const slug = userSlug ? toSlug(userSlug) : toSlug(name); 
        
        // Nếu có tệp (ảnh) thì upload lên Cloudinary
        let thumbnail;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await handleUpload(dataURI);
            thumbnail = result.url;
        }
        // Kiểm tra nếu slug đã tồn tại trong cơ sở dữ liệu (trừ bản ghi hiện tại)
        const existingCategory = await ArticleCategory.findOne({ slug, _id: { $ne: id } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: "Slug already exists!",
            });
        }

        // Tạo object để cập nhật
        const updatedData = { name, seo_title, seo_keywords, seo_description, slug };

        // Nếu có ảnh thì thêm ảnh vào dữ liệu cần cập nhật
        if (thumbnail) {
            updatedData.thumbnail = thumbnail;
        }

        // Cập nhật thông tin category
        const updatedCategory = await ArticleCategory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                error: "Article category not found!",
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedCategory,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getPagingArticleCategory = async (req, res) => {
    try {
        const query = req.query
        const articleCategories = await ArticleCategory.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countArticleCategories = await ArticleCategory.countDocuments()
        const totalPage = Math.ceil(countArticleCategories / query.pageSize)

        return res.status(200).json({ articleCategories, totalPage, count: countArticleCategories })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const deleteArticleCategory = async (req, res) => {
    try {
        const { id } = req.params
        const articleCategory = await ArticleCategory.findByIdAndDelete(id)
        if (!articleCategory) {
            return res.status(404).json({ success: false, error: "Article category not found!" })
        }
        return res.status(200).json({
            success: true, message: "Delete article category successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getArticleCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const articleCategory = await ArticleCategory.findById(id)
        if (!articleCategory) {
            return res.status(404).json({ success: false, message: "articleCategory does not exist!" });
        }
        return res.status(200).json({ success: true, articleCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const searchArticleCategory = async (req, res) => {
    try {
        const query = req.query
        const articleCategories = await ArticleCategory.find({ name: { $regex: query.name, $options: 'i' } }).sort({ createdAt: "desc" })
        if (articleCategories.length === 0) {
            return res.status(404).json({ success: false, message: "Article category not found!" })
        }
        return res.status(200).json({ success: true, articleCategories })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

