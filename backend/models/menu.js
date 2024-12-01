import mongoose from "mongoose";

const Menu = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Option", "Link"]
    },
    articleCategoryId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "articleCategories"
        }
    ]
}, { timestamps: true })
Menu.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("menus", Menu)