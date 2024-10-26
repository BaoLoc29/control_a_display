import User from "../models/user.js"
import Role from "../models/role.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import jwt from "jsonwebtoken"
import moment from 'moment';

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
                success: false,
                error: validate.error.details[0].message
            })
        }
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.status(402).json({ success: false, error: "Email does not exist!" })
        }

        const checkPassword = compareSync(password, findUser.password)
        const accessToken = jwt.sign({
            id: findUser._id,
        }, process.env.SECRET_KEY, { expiresIn: '9d' })
        const {
            password: userPassword,
            ...returnUser
        } = findUser

        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                error: "Incorrect password!"
            })
        }

        if (findUser) {
            return res.status(200).json({
                success: true,
                message: "Login successfully.",
                user: returnUser,
                accessToken
            })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
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
                success: false,
                error: error.details.map((e) => e.message),
            });
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(401).json({ success: false, message: "This email is already in use!" })
        }

        const salt = genSaltSync();
        const hashedPassword = hashSync(password, salt);


        // Check role
        const findRole = await Role.findOne({ name: role })
        if (!findRole) {
            return res.status(401).json({ success: false, message: `Role ${role} does not exist!` });
        }

        const result = await User.create({ ...data, password: hashedPassword })

        return res.status(200).json({
            success: true,
            message: 'Account created successfully.',
            user: {
                _id: result._id,
                email: result.email,
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
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
                'any.required': `Old password is required`
            }),
            newPassword: joi.string().min(6).max(32).required().messages({
                'string.empty': `New password is required`,
                'string.min': `New password must be at least 6 characters long`,
                'string.max': `New password must be at most 32 characters long`,
                'any.required': `New password is required`
            })
        });

        const { error } = changePasswordSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist!" });
        }

        const checkPassword = compareSync(oldPassword, user.password);
        if (!checkPassword) {
            return res.status(400).json({ success: false, message: "Old password is incorrect!" });
        }

        const salt = genSaltSync();
        const hashPassword = hashSync(newPassword, salt);

        await User.findByIdAndUpdate(id, {
            password: hashPassword
        }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        if (error.details) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ success: false, message: errorMessage });
        } else {
            return res.status(500).json({ success: false, message: "Password change failed!" });
        }
    }
};
export const editUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const { id } = req.params;

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
                success: false,
                error: error.details.map(e => e.message)
            });
        }

        const findUserByEmail = await User.findOne({ email });
        if (findUserByEmail && findUserByEmail._id.toString() !== id) {
            return res.status(400).json({ success: false, message: "Email is already in use. Please try using a different email!" });
        }

        // Check role
        const findRole = await Role.findOne({ name: role })
        if (!findRole) {
            return res.status(401).json({ success: false, message: `Role ${role} does not exist!` });
        }

        const updateUser = await User.findByIdAndUpdate(id, {
            name, email, role
        }, { new: true }).select("-password");

        if (!updateUser) {
            return res.status(400).json({ success: false, message: "User does not exist!" });
        }
        return res.status(200).json({
            success: true,
            message: "User information updated successfully.",
            user: { updateUser }
        });
    } catch (error) {
        console.error(error);
        if (error.details) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ success: false, message: errorMessage });
        } else {
            return res.status(500).json({ success: false, message: error.message });
        }
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

        return res.status(200).json({ users, totalPage, count: countUsers })
    } catch (error) {
        return res.status(500).json(error)
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
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }
        return res.status(200).json({ users });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
