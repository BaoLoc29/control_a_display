import ArticleCategory from "../models/articleCategory.js";
import Menu from "../models/menu.js";
import joi from "joi";
import toSlug from '../utils/toSlug.js';
import handleUpload from "../utils/cloundinary.js";

export const createArticleCategory = async (req, res) => {
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

        const { name, seo_title, seo_keywords, seo_description, slug: useSlug, menuId } = req.body;
        const slug = useSlug ? toSlug(useSlug) : toSlug(name);
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
            menuId: joi.string().required().messages({
                'string.empty': 'menuId is required!',
            }),
        });

        const { error } = createSchema.validate({ name, slug, seo_title, seo_keywords, seo_description, menuId });
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Check if the slug already exists
        const findSlug = await ArticleCategory.findOne({ slug });
        if (findSlug) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        // Kiểm tra xem menu có tồn tại không (nếu cần)
        const findMenu = await Menu.findById(menuId);
        if (!findMenu) {
            return res.status(400).json({
                message: "Menu not found!",
            });
        }

        // Create a new article category
        const articleCategory = await ArticleCategory.create({ name, slug, seo_title, seo_keywords, seo_description, thumbnail, menuId });

        // Cập nhật Menu với articleCategoryId
        findMenu.articleCategoryId.push(articleCategory._id);
        await findMenu.save();

        return res.status(201).json({
            message: "Created successfully!",
            data: articleCategory,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const editArticleCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, seo_title, seo_keywords, seo_description, slug: useSlug, menuId } = req.body;
        const slug = useSlug ? toSlug(useSlug) : toSlug(name);

        // Validate input data
        const editSchema = joi.object({
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
            menuId: joi.string().required().messages({
                'string.empty': 'menuId is required!',
            }),
        });

        const { error } = editSchema.validate({ name, slug, seo_title, seo_keywords, seo_description, menuId });
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Lấy thông tin articleCategory hiện tại
        const existingCategory = await ArticleCategory.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Article category not found!" });
        }

        const oldMenuId = existingCategory.menuId;
        // Nếu có tệp (ảnh) thì upload lên Cloudinary
        let thumbnail;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await handleUpload(dataURI);
            thumbnail = result.url;
        }
        // Kiểm tra nếu slug đã tồn tại trong cơ sở dữ liệu (trừ bản ghi hiện tại)
        const duplicateSlug = await ArticleCategory.findOne({ slug, _id: { $ne: id } });
        if (duplicateSlug) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        // Tạo object để cập nhật
        const updatedData = { name, seo_title, seo_keywords, seo_description, slug, menuId };

        // Nếu có ảnh thì thêm ảnh vào dữ liệu cần cập nhật
        if (thumbnail) {
            updatedData.thumbnail = thumbnail;
        }

        // Cập nhật thông tin category
        const updatedCategory = await ArticleCategory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Article category not found!",
            });
        }

        // Cập nhật Menu với articleCategoryId mới (nếu chưa có)
        const findMenu = await Menu.findById(menuId);
        if (!findMenu) {
            return res.status(404).json({ message: "Menu not found!" });
        }

        // Xóa articleCategoryId khỏi menuId cũ nếu khác menuId mới
        if (oldMenuId && oldMenuId !== menuId) {
            const oldMenu = await Menu.findById(oldMenuId);
            if (oldMenu) {
                oldMenu.articleCategoryId = oldMenu.articleCategoryId.filter(
                    (categoryId) => categoryId.toString() !== id
                );
                await oldMenu.save();
            }
        }

        // Thêm articleCategoryId vào menuId mới
        const newMenu = await Menu.findById(menuId);
        if (!newMenu) {
            return res.status(404).json({ message: "Menu not found!" });
        }

        if (!newMenu.articleCategoryId.includes(updatedCategory._id)) {
            newMenu.articleCategoryId.push(updatedCategory._id);
            await newMenu.save();
        }

        return res.status(200).json({
            message: "Updated successfully!",
            data: updatedCategory,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getPagingArticleCategory = async (req, res) => {
    try {
        const query = req.query
        const articleCategories = await ArticleCategory.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })
            .populate('menuId', 'title')

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
            return res.status(404).json({ message: "Article category not found!" })
        }
        return res.status(200).json({
            message: "Deleted successfully!"
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
            return res.status(404).json({ message: "ArticleCategory does not exist!" });
        }
        return res.status(200).json({ articleCategory });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchArticleCategory = async (req, res) => {
    try {
        const query = req.query
        const articleCategories = await ArticleCategory.find({ name: { $regex: query.name, $options: 'i' } }).sort({ createdAt: "desc" })
        if (articleCategories.length === 0) {
            return res.status(404).json({ message: "Article category not found!" })
        }
        return res.status(200).json({ articleCategories })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAllArticleCategory = async (req, res) => {
    try {
        const articleCategories = await ArticleCategory.find()
            .sort({ createdAt: "desc" })
        return res.status(200).json({ articleCategories })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
