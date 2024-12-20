import User from '../models/user.js';
import Role from '../models/role.js';

const authorization = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user);

            if (!user) {
                return res.status(403).json({ message: "User not found" });
            }

            // Tìm Role của người dùng, cùng lúc populate permissionIds để lấy dữ liệu quyền
            const userRole = await Role.findOne({ _id: user.roleId })
                .populate('permissionIds', 'name');

            if (!userRole) {
                return res.status(403).json({ message: "Role not found" });
            }

            // Kiểm tra xem người dùng có quyền yêu cầu hay không
            const hasPermission = requiredPermissions.every(permission =>
                userRole.permissionIds.some(rolePermission => rolePermission.name === permission)
            );

            if (!hasPermission) {
                return res.status(403).json({ message: "Forbidden: You don't have permission to perform this action." });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };
};

export default authorization;
