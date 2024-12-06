import Menu from "../models/menu.js";
import joi from "joi";
import toSlug from '../utils/toSlug.js';

export const createMenu = async (req, res) => {
    try {
        const { title, slug: useSlug, description, type, articleCategoryId } = req.body
        const slug = useSlug ? toSlug(useSlug) : toSlug(title);

        // Validate input data
        const createSchema = joi.object({
            title: joi.string().required().messages({
                "string.base": "Title must be a string",
                "string.empty": "Title cannot be empty",
                "any.required": "Title is required"
            }),
            slug: joi.string().required().messages({
                "string.base": "Slug must be a string",
                "string.empty": "Slug cannot be empty",
                "any.required": "Slug is required"
            }),
            description: joi.string().required().messages({
                "string.base": "Description must be a string",
                "string.empty": "Description cannot be empty",
                "any.required": "Description is required"
            }),
            type: joi.string().required().valid("Option", "Link").messages({
                "string.base": "Type must be a string",
                "string.empty": "Type cannot be empty",
                "any.required": "Type is required",
                "any.only": "Type must be either 'Option' or 'Link'"
            }),
        })

        const { error } = createSchema.validate({ title, slug, description, type });
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Check if the slug already exists
        const findSlug = await Menu.findOne({ slug });
        if (findSlug) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        const menu = await Menu.create({ title, slug, description, type, articleCategoryId })
        return res.status(201).json({
            message: "Created successfully!",
            data: menu
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getMenuById = async (req, res) => {
    try {
        const { id } = req.params
        const menu = await Menu.findById(id)
        if (!menu) {
            return res.status(404).json({ message: "Menu is not found!" })
        }
        return res.status(200).json({ menu })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getPagingMenu = async (req, res) => {
    try {
        const query = req.query
        const menus = await Menu.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countMenu = await Menu.countDocuments()
        const totalPage = Math.ceil(countMenu / query.pageSize)

        return res.status(200).json({ menus, totalPage, count: countMenu })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params
        const menu = await Menu.findByIdAndDelete(id)
        if (!menu) {
            return res.status(404).json({ message: "Menu is not found!" })
        }
        return res.status(200).json({ message: "Deleted successfully!" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const editMenu = async (req, res) => {
    try {
        const { id } = req.params
        const { title, slug: useSlug, description, type } = req.body
        const slug = useSlug ? toSlug(useSlug) : toSlug(title);

        const editSchema = joi.object({
            title: joi.string().required().messages({
                "string.base": "Title must be a string",
                "string.empty": "Title cannot be empty",
                "any.required": "Title is required"
            }),
            slug: joi.string().required().messages({
                "string.base": "Slug must be a string",
                "string.empty": "Slug cannot be empty",
                "any.required": "Slug is required"
            }),
            description: joi.string().required().messages({
                "string.base": "Description must be a string",
                "string.empty": "Description cannot be empty",
                "any.required": "Description is required"
            }),
            type: joi.string().required().valid("Option", "Link").messages({
                "string.base": "Type must be a string",
                "string.empty": "Type cannot be empty",
                "any.required": "Type is required",
                "any.only": "Type must be either 'Option' or 'Link'"
            })
        })

        const { error } = editSchema.validate({ title, slug, description, type });
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        // Kiểm tra nếu slug đã tồn tại trong cơ sở dữ liệu (trừ bản ghi hiện tại)
        const existingMenu = await Menu.findOne({ slug, _id: { $ne: id } });
        if (existingMenu) {
            return res.status(400).json({
                message: "Slug already exists!",
            });
        }

        const menu = await Menu.findByIdAndUpdate(id, { title, slug, description, type }, { new: true })
        return res.status(200).json({ message: "Updated successfully!", data: menu })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchMenu = async (req, res) => {
    try {
        const query = req.query
        const menus = await Menu.find({ title: { $regex: query.title, $options: 'i' } }).sort({ createdAt: "desc" })
        if (menus.length === 0) {
            return res.status(404).json({ message: "Menu not found!" })
        }
        return res.status(200).json({ menus })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAllMenu = async (req, res) => {
    try {
        const menus = await Menu.find().sort({ createdAt: "desc" }).populate({
            path: "articleCategoryId",
            select: "name slug",
        })
        return res.status(200).json({ menus })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
