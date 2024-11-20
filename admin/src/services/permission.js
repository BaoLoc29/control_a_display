import { axiosInstanceAuth } from "./index";

const getAllPermission = () => {
    return axiosInstanceAuth.get("/permission/get-all-permission");
}
const createPermission = (data) => {
    return axiosInstanceAuth.post("/permission/create-permission", data);
}
const editPermission = (id, data) => {
    return axiosInstanceAuth.put(`/permission/update-permission/${id}`, data);
}
const deletePermission = (id) => {
    return axiosInstanceAuth.delete(`/permission/delete-permission/${id}`);
}
const searchPermission = (searchQuery) => {
    return axiosInstanceAuth.get('/permission/search-permission', { params: { name: searchQuery } })
}
const getPagingPermission = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/permission/get-paging-permission?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const getPermissionById = (id) => {
    return axiosInstanceAuth.get(`/permission/get-permission/${id}`);
}
export {
    getAllPermission,
    createPermission,
    editPermission,
    deletePermission,
    searchPermission,
    getPagingPermission,
    getPermissionById
}