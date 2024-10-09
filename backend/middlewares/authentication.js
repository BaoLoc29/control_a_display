import jwt from 'jsonwebtoken'
import user from '../models/user.js'

const authentication = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization

        if (!bearerToken) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" })
        }

        const token = bearerToken.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            return res.status(401).json({ message: "Token không hợp lệ!" })
        }

        const userId = decoded.id
        const findUser = await user.findById(userId)
        if (!findUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" })
        }
        req.user = findUser
        next()
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export default authentication