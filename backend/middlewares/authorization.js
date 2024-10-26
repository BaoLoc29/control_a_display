// middleware/authorization.js
import User from '../models/user.js';
import Role from '../models/role.js';

const authorization = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user);

            if (!user) {
                return res.status(403).json({ message: "User not found" });
            }

            const userRole = await Role.findOne({ name: user.role });
            if (!userRole) {
                return res.status(403).json({ message: "Role not found" });
            }

            const hasPermission = requiredPermissions.every(permission =>
                userRole.permissions.includes(permission)
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
