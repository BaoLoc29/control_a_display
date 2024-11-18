import User from "../models/user.js"
import Role from "../models/role.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import { v4 as uuidv4 } from "uuid";
import dayjs from 'dayjs';
import jwt from "jsonwebtoken"
import { sendRetryPassword, sendVerificationEmail, sendOldEmail } from "../utils/sendVerificationEmail.js";

export const createUser = async (req, res) => {
    const { hashSync, genSaltSync } = bcrypt;
    try {
        const data = req.body
        const { email, password, role } = data

        const createSchema = joi.object({
            name: joi.string().required().messages({
                'string.empty': 'Username is required!',
            }),
            email: joi.string().email().required().messages({
                'string.email': 'Invalid email!',
                'string.empty': 'Email is required!',
            }),
            password: joi.string().min(6).required().messages({
                'string.min': 'Password must have at least 6 characters!',
                'string.empty': 'Password is required!',
            }),
            role: joi.string().required().messages({
                'string.empty': 'Role is required!',
            })

        });

        const { error } = createSchema.validate(data)
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(401).json({ message: "This email is already in use!" })
        }

        const salt = genSaltSync();
        const hashedPassword = hashSync(password, salt);


        // Check role
        const findRole = await Role.findOne({ name: role })
        if (!findRole) {
            return res.status(401).json({ message: `Role ${role} does not exist!` });
        }

        const result = await User.create({ ...data, password: hashedPassword })

        return res.status(200).json({
            message: 'Created successfully!',
            user: {
                _id: result._id,
                email: result.email,
                name: result.name,
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const Login = async (req, res) => {
    const { compareSync } = bcrypt
    try {
        const { email, password } = req.body

        const loginSchema = joi.object({
            email: joi.string().email().min(3).max(32).required().messages({
                "string.email": "Invalid email format!",
                "string.min": "Email must have at least 3 characters!",
                "string.max": "Email must not exceed 32 characters!"
            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.password": "Invalid password format!",
                "string.min": "Password must have at least 6 characters!",
                "string.max": "Password must not exceed 32 characters!"
            }),
        })

        const validate = loginSchema.validate({ email, password })

        if (validate.error) {
            return res.status(400).json({
                message: validate.error.details[0].message
            })
        }
        const user = await User.findOne({ email }).lean()
        if (!user) {
            return res.status(404).json({
                message: "The account doesn't exist!"
            });
        }

        const checkPassword = compareSync(password, user.password)
        const accessToken = jwt.sign({
            id: user._id,
        }, process.env.SECRET_KEY, { expiresIn: '9d' })

        const {
            password: userPassword,
            ...returnUser
        } = user

        if (!checkPassword) {
            return res.status(401).json({
                message: "Incorrect password!"
            })
        }
        // Check if account is inactive
        if (!user.isActive) {
            return res.status(200).json({
                isActive: false,
                email: user.email,
                message: "The account is inactive!"
            });
        }
        if (user) {
            return res.status(200).json({
                message: "Login successfully!",
                user: returnUser,
                accessToken
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const changePassword = async (req, res) => {
    const { compareSync, genSaltSync, hashSync } = bcrypt;
    try {
        const id = req.params.id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const changePasswordSchema = joi.object({
            oldPassword: joi.string().min(6).max(32).required().messages({
                'string.empty': `Old password is required`,
                'string.min': `Old password must be at least 6 characters long`,
                'string.max': `Old password must be at most 32 characters long`,
            }),
            newPassword: joi.string().min(6).max(32).required().messages({
                'string.empty': `New password is required`,
                'string.min': `New password must be at least 6 characters long`,
                'string.max': `New password must be at most 32 characters long`,
            })
        });

        const { error } = changePasswordSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        const checkPassword = compareSync(oldPassword, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Old password is incorrect!" });
        }

        const salt = genSaltSync();
        const hashPassword = hashSync(newPassword, salt);

        await User.findByIdAndUpdate(id, {
            password: hashPassword
        }).select("-password");

        return res.status(200).json({
            message: "Password changed successfully!",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};
export const editUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Validate input data
        const editSchema = joi.object({
            name: joi.string().required().messages({
                'string.empty': 'User name is required!'
            }),
            email: joi.string().email().required().messages({
                'string.email': 'Invalid email!',
                'string.empty': 'Email is required!'
            }),
            role: joi.string().required().messages({
                'string.empty': 'Role user is required!'
            })
        });

        const { error } = editSchema.validate({ name, email, role });
        if (error) {
            return res.status(400).json({
                message: error.details.map(e => e.message)
            });
        }

        // Check if the new email is already in use
        const findUserByEmail = await User.findOne({ email });
        if (findUserByEmail && findUserByEmail._id.toString() !== id) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        // Check if the role exists
        const findRole = await Role.findOne({ name: role });
        if (!findRole) {
            return res.status(401).json({ message: `Role ${role} does not exist!` });
        }

        // If the email is different, just send verification without updating
        if (email !== user.email) {
            const oldEmail = user.email;
            // Tạo mã xác thực mới
            const codeId = uuidv4();
            const codeExpired = dayjs().add(5, 'minutes');

            user.codeId = codeId;
            user.codeExpired = codeExpired;
            user.isActive = false
            await user.save();
            // Send notification to the old email address
            await sendOldEmail(oldEmail, name, email, codeId);
            return res.status(200).json({
                message: "Please verify the new email!",
            });
        }

        // If the email is the same, update the user data
        const updateFields = { name, role };
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");

        return res.status(200).json({
            message: "Updated successfully!",
            updatedUser
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(400).json({ message: "User is not found!" })
        }
        return res.status(200).json({ message: "Deleted successfully!" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getPagingUser = async (req, res) => {
    try {
        const query = req.query
        const users = await User.find()
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countUsers = await User.countDocuments()
        const totalPage = Math.ceil(countUsers / query.pageSize)

        return res.status(200).json({ users, email: users.email, totalPage, count: countUsers })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const searchUser = async (req, res) => {
    try {
        const { keyword, option } = req.body;

        if (!keyword || !option) {
            const noKeyword = await User.find()
            return res.status(200).json({ noKeyword });
        }


        let searchField = {};
        if (option === "name") {
            searchField = { name: { $regex: keyword, $options: 'i' } };
        } else if (option === "email") {
            searchField = { email: { $regex: keyword, $options: 'i' } };
        }

        const users = await User.find({ ...searchField });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "User is not found!" });
        }
        return res.status(200).json({ users });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Gửi mail để xác thực tài khoảng khi tài khoảng chưa được kích hoạt
export const retryActive = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User is not found!" });
        }
        if (user.isActive) {
            return res.status(400).json({ message: "Account is already activated!" });
        }

        // Tạo mã xác thực mới
        const codeId = uuidv4();
        const codeExpired = dayjs().add(5, 'minutes');

        user.codeId = codeId;
        user.codeExpired = codeExpired;
        await user.save();
        await sendVerificationEmail(user.name, codeId, user.email);

        return res.status(200).json({
            message: 'Check your email for the code!',
            user: user._id,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Check code còn hạn hay ko
export const checkCode = async (req, res) => {
    try {
        const { codeId } = req.body;
        const user = await User.findOne({ codeId });
        if (!user) {
            return res.status(400).json({ message: "Code is not found!" });
        }
        if (user.codeExpired < dayjs().toDate()) {
            return res.status(400).json({
                message: "Code has expired!"
            })
        }
        // Kích hoạt tài khoản
        user.isActive = true;
        await user.save();
        return res.status(200).json({
            message: 'Account activated successfully!',
            user: user._id
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Xác thực email trước khi đổi mật khẩu đã quên
export const retryPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User is not found!" });
        }

        const codeId = uuidv4();
        const codeExpired = dayjs().add(5, 'minutes');

        user.codeId = codeId;
        user.codeExpired = codeExpired;
        await user.save();
        await sendRetryPassword(user.name, codeId, user.email);

        return res.status(200).json({
            message: 'Verification email sent successfully!',
            user: {
                _id: user._id,
                email: user.email,
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
// Quên mật khẩu
export const forgotPassword = async (req, res) => {
    const { genSaltSync, hashSync } = bcrypt;
    try {
        const { password, confirmPassword, codeId } = req.body
        const changePasswordSchema = joi.object({
            password: joi.string().min(6).max(32).required().messages({
                'string.empty': `Password is required`,
                'string.min': `Password must be at least 6 characters long`,
                'string.max': `Password must be at most 32 characters long`,
            }),
            confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
                'string.empty': `Confirm Password is required`,
                'any.only': `Confirm Password must match Password`
            }),
            codeId: joi.string().required().messages({
                'string.empty': `CodeId is required`
            })
        });

        const { error } = changePasswordSchema.validate({ password, confirmPassword, codeId });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check code gửi lên BE có đúng với CSDL ko
        const user = await User.findOne({ codeId });
        if (!user) {
            return res.status(404).json({ message: "Invalid authentication code!" })
        }

        // Kiểm tra thời gian hết hạn mã
        const currentTime = new Date();
        if (currentTime > user.codeExpired) {
            return res.status(400).json({ message: "The authentication code has expired!" });
        }

        // Mã hóa mật khẩu mới
        const salt = genSaltSync();
        const hashPassword = hashSync(password, salt);

        // Cập nhật mật khẩu
        await User.findByIdAndUpdate(user.id, { password: hashPassword }, { new: true });
        return res.status(200).json({ message: "Password changed successfully!" });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
// Change email
export const ChangeEmail = async (req, res) => {
    try {
        const { oldEmail, newEmail, codeId } = req.body;

        // Kiểm tra email cũ và email mới có được cung cấp không
        if (!oldEmail || !newEmail || !codeId) {
            return res.status(400).json({ message: "Both oldEmail and newEmail are required!" });
        }

        // Tìm kiếm người dùng theo email cũ
        const user = await User.findOne({ email: oldEmail });
        if (!user) {
            return res.status(404).json({ message: "User with the old email not found!" });
        }
        // Kiểm tra mã xác thực còn hạn hay ko
        if (user.codeExpired < dayjs().toDate()) {
            return res.status(400).json({
                message: "Code has expired!"
            })
        }

        // Kiểm tra nếu email mới đã được sử dụng bởi người khác
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: "The new email is already in use!" });
        }

        // Cập nhật email mới
        user.email = newEmail;
        user.isActive = true;
        await user.save();
        return res.status(200).json({
            message: 'Updated successfully!',
            user: user._id
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
