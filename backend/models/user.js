import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
User.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("users", User)