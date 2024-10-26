import { axiosInstanceAuth } from "./index";

const getAllPermission = () => {
    return axiosInstanceAuth.get("/permission/");
}
export {
    getAllPermission,
}