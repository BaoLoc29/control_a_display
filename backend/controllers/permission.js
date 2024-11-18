import Permission from "../models/permissions.js";
import joi from "joi"

export const createPermission = async (req, res) => {
    try {
        const { name } = req.body;

        const permissionSchema = joi.object({
            name: joi.string().required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name must not be empty",
                "any.required": "Name is required"
            }),
        })

        const validate = permissionSchema.validate({ name })

        if (validate.error) {
            return res.status(400).json({
                message: validate.error.details[0].message
            })
        }
        const permission = await Permission.create({ name })
        return res.status(201).json({
            message: "Created successfully!",
            data: permission
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAllPermission = async (req, res) => {
    try {
        const permissions = await Permission.find()
        return res.status(200).json({
            permissions
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}