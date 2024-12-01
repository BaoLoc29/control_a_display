import { axiosInstanceAuth } from "./index";

const getPagingMenu = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/menu/get-paging-menu?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createMenu = (data) => {
    return axiosInstanceAuth.post('/menu/create-menu', data)
}
const editMenu = (menuId, data) => {
    return axiosInstanceAuth.put(`/menu/edit-menu/${menuId}`, data)
}
const deleteMenu = (menuId) => {
    return axiosInstanceAuth.delete(`/menu/delete-menu/${menuId}`)
}
const getMenuById = (menuId) => {
    return axiosInstanceAuth.get(`/menu/get-menu/${menuId}`)
}
const searchMenu = (searchQuery) => {
    return axiosInstanceAuth.get('/menu/search-menu', { params: { title: searchQuery } })
}
const getAllMenu = () => {
    return axiosInstanceAuth.get('/menu/get-all-menu')
}
export {
    getPagingMenu,
    createMenu,
    getMenuById,
    deleteMenu,
    editMenu,
    searchMenu,
    getAllMenu
}