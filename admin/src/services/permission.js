import { axiosInstanceAuth } from "./index";

const getAllPermission = () => {
    return axiosInstanceAuth.get("/permission/get-all");
}
export {
    getAllPermission,
}