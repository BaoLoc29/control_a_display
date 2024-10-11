import User from "../models/user.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import jwt from "jsonwebtoken"

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
                error: validate.error.details[0].message
            })
        }
        const findUser = await User.findOne({ email }).lean()
        if (!findUser) {
            return res.status(402).json({ success: false, error: "Email does not exist!" })
        }

        const checkPassword = compareSync(password, findUser.password)
        const accessToken = jwt.sign({
            id: findUser._id,
        }, process.env.SECRET_KEY, { expiresIn: '1d' })
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
                message: "Login successful.",
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
        const { email, password } = data

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
            role: joi.string().required().valid("editor", "super-admin").messages({
                'string.empty': 'Role is required!',
            })

        });

        const { error } = createSchema.validate(data)
        if (error) {
            return res.status(400).json({
                error: error.details.map((e) => e.message),
            });
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(401).json({ success: false, message: "This email is already in use!" })
        }

        const salt = genSaltSync();
        const hashedPassword = hashSync(password, salt);

        const result = await User.create({ ...data, password: hashedPassword })

        return res.status(200).json({
            success: true,
            message: 'Account created successfully.',
            user: {
                _id: result._id,
                email: result.email
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
