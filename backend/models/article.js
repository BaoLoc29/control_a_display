import mongoose from "mongoose";

const Article = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    seo_keywords: {
        type: String,
        required: true
    },
    seo_title: {
        type: String,
        required: true
    },
    seo_description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    popular: {
        type: Boolean,
        default: false
    },
    articleCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'articleCategories'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
Article.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("articles", Article)