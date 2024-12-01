import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles"
    },
    codeId: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    codeExpired: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
User.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("users", User)