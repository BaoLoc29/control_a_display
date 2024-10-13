import jwt from 'jsonwebtoken';
import user from '../models/user.js';

const authentication = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;

        if (!bearerToken) {
            return res.status(401).json({ message: "You are not logged in!" });
        }

        const token = bearerToken.split(" ")[1];
        const verify = jwt.verify(token, process.env.SECRET_KEY);

        if (!verify) {
            return res.status(401).json({ message: "Invalid token!" });
        }

        const userId = verify.id;
        const findUser = await user.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        req.user = findUser;
        next();
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default authentication;
