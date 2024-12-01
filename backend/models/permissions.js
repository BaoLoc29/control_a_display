import mongoose from "mongoose";

const Permission = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    roleIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles'
        }
    ]
}, { timestamps: true })
// Định dạng lại createdAt và updatedAt khi trả về JSON
Permission.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = this.createdAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    obj.updatedAt = this.updatedAt.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    return obj;
}
export default mongoose.model("permissions", Permission)