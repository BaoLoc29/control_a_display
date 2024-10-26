import Role from "../models/role.js"
import Permission from "../models/permissions.js";
import joi from "joi";

export const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Validation schema với Joi
        const createSchema = joi.object({
            name: joi.string().required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name must not be empty",
            }),
            permissions: joi.array().items(joi.string()).required().messages({
                "array.base": "Permissions must be an array",
                "any.required": "Permissions are required",
            })
        });

        const { error } = createSchema.validate({ name, permissions });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Kiểm tra xem Role đã tồn tại chưa
        const findRole = await Role.findOne({ name });
        if (findRole) {
            return res.status(401).json({ success: false, message: "This role is already in use!" });
        }

        // Tìm các quyền tương ứng dựa trên name trong bảng Permission
        const foundPermissions = await Permission.find({ name: { $in: permissions } });
        if (foundPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid or do not exist."
            });
        }

        // Lưu trực tiếp tên quyền vào Role
        const permissionNames = foundPermissions.map(permission => permission.name);

        // Tạo Role mới với ObjectId của permissions
        const newRole = await Role.create({ name, permissions: permissionNames });
        return res.status(201).json({
            success: true,
            newRole,
            message: "Role created successfully",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const editRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const { id } = req.params;

        const createSchema = joi.object({
            name: joi.string().required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name must not be empty",
            }),
            permissions: joi.array().items(joi.string()).required().messages({
                "array.base": "Permissions must be an array",
                "any.required": "Permissions are required",
            })

        })

        const { error } = createSchema.validate({ name, permissions });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const findRoleById = await Role.findById(id)
        if (!findRoleById) {
            return res.status(400).json({ success: false, message: "Role is already in use. Please try using a different role!" });
        }

        // Tìm các quyền tương ứng dựa trên name trong bảng Permission
        const foundPermissions = await Permission.find({ name: { $in: permissions } });
        if (foundPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid or do not exist."
            });
        }

        // Lưu trực tiếp tên quyền vào Role
        const permissionNames = foundPermissions.map(permission => permission.name);
        // Cập nhật role
        findRoleById.name = name;
        findRoleById.permissions = permissionNames;
        await findRoleById.save();

        return res.status(200).json({
            success: true,
            role: findRoleById,
            message: "Role updated successfully",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const deleteRole = async (req, res) => {
    const { id } = req.params
    try {
        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role does not exist!",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const getPagingRole = async (req, res) => {
    try {
        const query = req.query
        const roles = await Role.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countRoles = await Role.countDocuments()
        const totalPage = Math.ceil(countRoles / query.pageSize)

        return res.status(200).json({ roles, totalPage, count: countRoles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchRole = async (req, res) => {
    try {
        const { keyword, option } = req.body;

        if (!keyword || !option) {
            const noKeyword = await Role.find()
            return res.status(200).json({ success: true, noKeyword });
        }

        let searchField = {};
        if (option === "name") {
            searchField = { name: { $regex: keyword, $options: 'i' } };
        } else if (option === "permissions") {
            searchField = { permissions: { $regex: keyword, $options: 'i' } };
        }

        const roles = await Role.find({ ...searchField });
        if (!roles || roles.length === 0) {
            return res.status(404).json({ success: false, message: "Role does not exist!" });
        }
        return res.status(200).json({ success: true, roles });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params
        const role = await Role.findById(id)
        if (!role) {
            return res.status(404).json({ success: false, message: "Role does not exist!" });
        }
        return res.status(200).json({ success: true, role });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const getAllRole = async (req, res) => {
    try {
        const roles = await Role.find()
        if (!roles) {
            return res.status(404).json({ message: "Role does not exist" })
        }

        return res.status(200).json({ roles })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}