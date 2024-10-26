import mongoose from "mongoose";

const Role = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    permissions: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
Role.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("roles", Role)