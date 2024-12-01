import Permission from "../models/permissions.js";
import toSlug from "../utils/toSlug.js";

export const createPermission = async (req, res) => {
    try {
        const name = toSlug(req.body.name)
        if (!name) {
            return res.status(400).json({ message: "Name is required!" })
        }

        // Kiểm tra nếu name bắt đầu bằng các tiền tố được yêu cầu
        const validPrefixes = ["view-", "create-", "edit-", "delete-"];
        const hasValidPrefix = validPrefixes.some((prefix) => name.startsWith(prefix));

        if (!hasValidPrefix) {
            return res.status(400).json({
                message: "Invalid name permission!"
            });
        }

        // Check name của Permission phải là duy nhất
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
            return res.status(400).json({
                message: "Permission name already exists!"
            });
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
export const editPermission = async (req, res) => {
    try {
        const { id } = req.params
        const name = toSlug(req.body.name)
        if (!name) {
            return res.status(400).json({ message: "Name is required!" })
        }
        // Kiểm tra nếu name bắt đầu bằng các tiền tố được yêu cầu
        const validPrefixes = ["view-", "create-", "edit-", "delete-"];
        const hasValidPrefix = validPrefixes.some((prefix) => name.startsWith(prefix));

        if (!hasValidPrefix) {
            return res.status(400).json({
                message: "Invalid name permission!"
            });
        }
        
        // Check name của Permission phải là duy nhất
        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
            return res.status(400).json({
                message: "Permission name already exists!"
            });
        }
        const permission = await Permission.findByIdAndUpdate(id, { name }, { new: true })
        if (!permission) {
            return res.status(404).json({ message: "Permission not found!" })
        }
        return res.status(200).json({
            message: "Updated successfully!",
            data: permission
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getPagingPermission = async (req, res) => {
    try {
        const { pageSize, pageIndex } = req.query
        const permission = await Permission.find()
            .skip(pageSize * pageIndex - pageSize)
            .limit(pageSize).sort({ createdAt: "desc" })

        const countPermission = await Permission.countDocuments()
        const totalPage = Math.ceil(countPermission / pageSize)

        return res.status(200).json({ permission, totalPage, count: countPermission })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAllPermission = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({ createdAt: "desc" })
        return res.status(200).json({
            permissions
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const deletedPermission = async (req, res) => {
    try {
        const { id } = req.params
        const permission = await Permission.findByIdAndDelete(id)
        if (!permission) {
            return res.status(404).json({ message: "Permission not found!" })
        }
        return res.status(200).json({
            message: "Deleted successfully!"
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchPermission = async (req, res) => {
    try {
        const { name } = req.query
        const permission = await Permission.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: "desc" })
        if (permission.length === 0) {
            return res.status(404).json({ message: "Permission not found!" })
        }
        return res.status(200).json({ permission })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getPermissionById = async (req, res) => {
    try {
        const { id } = req.params
        const permission = await Permission.findById(id)
        if (!permission) {
            return res.status(404).json({ message: "Permission not found!" })
        }
        return res.status(200).json({ permission })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}