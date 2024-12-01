import Role from "../models/role.js"
import Permission from "../models/permissions.js";
import joi from "joi";
import toSlug from "../utils/toSlug.js";
import mongoose from "mongoose";

export const createRole = async (req, res) => {
    try {
        const name = toSlug(req.body.name)
        const { permissionIds } = req.body;

        // Validation schema với Joi
        const createSchema = joi.object({
            name: joi.string().required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name must not be empty",
                "any.required": "Name is required"
            }),
            permissionIds: joi.array().items(joi.string()).required().messages({
                "array.base": "Permissions must be an array",
                "any.required": "Permissions are required",
            })
        });

        const { error } = createSchema.validate({ name, permissionIds });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Kiểm tra xem Role đã tồn tại chưa
        const findRole = await Role.findOne({ name });
        if (findRole) {
            return res.status(400).json({ message: "This role is already in use!" });
        }

        // Tìm kiếm các quyền trong Permission
        const permissions = await Permission.find({ _id: { $in: permissionIds } });
        if (permissions.length !== permissionIds.length) {
            return res.status(404).json({ message: "Some permissions not found!" });
        }

        // Tạo Role mới
        const newRole = await Role.create({
            name,
            permissionIds
        });

        // Cập nhật vào bảng trường roleIds của bảng Permission
        const updatePermissions = permissionIds.map(async (permissionId) => {
            const permission = await Permission.findById(permissionId);
            if (!permission.roleIds) {
                permission.roleIds = [];
            }
            permission.roleIds.push(newRole._id);
            await permission.save();
        });

        // Đợi tất cả các bản cập nhật hoàn thành
        await Promise.all(updatePermissions);

        return res.status(201).json({
            newRole,
            message: "Created successfully!",
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const editRole = async (req, res) => {
    try {
        const name = toSlug(req.body.name)
        const { permissionIds } = req.body;
        const { id } = req.params;

        const createSchema = joi.object({
            name: joi.string().required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name must not be empty",
            }),
            permissionIds: joi.array().items(joi.string()).required().messages({
                "array.base": "Permissions must be an array",
                "any.required": "Permissions are required",
            })
        })

        const { error } = createSchema.validate({ name, permissionIds });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Tìm Role
        const role = await Role.findById(id);
        if (!role) return res.status(400).json({ message: "Role not found!" });

        // Tìm các Permission hợp lệ
        const foundPermissions = await Permission.find({ _id: { $in: permissionIds } });
        if (foundPermissions.length !== permissionIds.length) return res.status(400).json({ message: "Invalid permissions!" });

        // Cập nhật Role và các Permission liên quan
        role.name = name;
        role.permissionIds = permissionIds;
        await Promise.all([
            Permission.updateMany({ _id: { $nin: permissionIds } }, { $pull: { roleIds: id } }),
            Permission.updateMany({ _id: { $in: permissionIds } }, { $addToSet: { roleIds: id } })
        ]);
        await role.save();

        return res.status(200).json({ role, message: "Updated successfully!" });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const deleteRole = async (req, res) => {
    const { id } = req.params
    try {
        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            return res.status(400).json({

                message: "Role does not exist!",
            })
        }
        return res.status(200).json({
            message: "Deleted successfully!",
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getPagingRole = async (req, res) => {
    try {
        const query = req.query
        const roles = await Role.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize)
            .sort({ createdAt: "desc" })
            .populate('permissionIds', 'name')

        const countRoles = await Role.countDocuments()
        const totalPage = Math.ceil(countRoles / query.pageSize)

        return res.status(200).json({ roles, totalPage, count: countRoles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchRole = async (req, res) => {
    try {
        const { name } = req.query
        const roles = await Role
            .find({ name: { $regex: name, $options: 'i' } })
            .sort({ createdAt: "desc" })
            .populate("permissionIds", "name")
        if (roles.length === 0) {
            return res.status(404).json({ message: "Role not found!" })
        }
        return res.status(200).json({ roles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params
        const role = await Role.findById(id)
        if (!role) {
            return res.status(404).json({ message: "Role does not exist!" });
        }
        return res.status(200).json({ role });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAllRole = async (req, res) => {
    try {
        const roles = await Role.find()
        if (!roles) {
            return res.status(404).json({ message: "Role does not exist!" })
        }

        return res.status(200).json({ roles })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}