import mongoose from "mongoose";

const ArticleCategory = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    seo_title: {
        type: String,
        required: true
    },
    seo_keywords: {
        type: String,
        required: true
    },
    seo_description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
ArticleCategory.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("articleCategories", ArticleCategory)