import express from 'express';
import userRouter from "./user.js";
import roleRouter from "./role.js"
import permissionRouter from "./permission.js"
import articleCategoryRouter from "./articleCategory.js"

const router = express.Router()
router.use("/user", userRouter)
router.use("/role", roleRouter)
router.use("/permission", permissionRouter)
router.use("/article-category", articleCategoryRouter)
export default router