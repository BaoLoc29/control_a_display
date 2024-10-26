import { axiosInstance, axiosInstanceAuth } from "./index";

const login = ({ email, password }) => {
    return axiosInstance.post("/user/login", { email, password })
}
const getUserById = (userId) => {
    return axiosInstanceAuth.get(`/user/${userId}`)
}
const createUser = (data) => {
    return axiosInstanceAuth.post('/user/create-user', data);
}
const editUser = (userId, data) => {
    return axiosInstanceAuth.put(`/user/edit-user/${userId}`, data)
}
const deleteUser = (userId) => {
    return axiosInstanceAuth.delete(`/user/${userId}`)
}
const getPagingUser = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/user/get-paging-user?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const searchUser = (keyword, option) => {
    return axiosInstanceAuth.post('/user/search-user', { keyword, option });
}
const getUserProfile = () => {
    return axiosInstanceAuth.get('/user/get-user-profile')
}
const changePassword = (userId, oldPassword, newPassword) => {
    return axiosInstanceAuth.put(`/user/change-password/${userId}`, oldPassword, newPassword)
}
export {
    login,
    createUser,
    editUser,
    getUserProfile,
    changePassword,
    getUserById,
    deleteUser,
    getPagingUser,
    searchUser,
}