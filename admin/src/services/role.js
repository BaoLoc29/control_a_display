import { axiosInstanceAuth } from "./index";

const createRole = (data) => {
    return axiosInstanceAuth.post('/role/create-role', data);
}
const editRole = (roleId, data) => {
    return axiosInstanceAuth.put(`/role/edit-role/${roleId}`, data)
}
const deleteRole = (roleId) => {
    return axiosInstanceAuth.delete(`/role/${roleId}`)
}
const getPagingRole = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/role/get-paging-role?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const searchRole = (searchQuery) => {
    return axiosInstanceAuth.get('/role/search-role', { params: { name: searchQuery } })
}
const getRoleById = (roleId) => {
    return axiosInstanceAuth.get(`/role/get-role/${roleId}`)
}
const getAllRole = () => {
    return axiosInstanceAuth.get('/role/get-all-role')
}

export {
    createRole,
    editRole,
    deleteRole,
    getPagingRole,
    searchRole,
    getRoleById,
    getAllRole
}