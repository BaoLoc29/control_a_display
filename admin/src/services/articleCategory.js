import { axiosInstance, axiosInstanceAuth } from "./index";

const getArticleCategory = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/article-category/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createArticleCategory = (data) => {
    return axiosInstanceAuth.post('/article-category/create', data)
}
const editArticleCategory = (articleCategoryId, data) => {
    return axiosInstanceAuth.put(`/article-category/${articleCategoryId}`, data)
}
const deleteArticleCategory = (articleCategoryId) => {
    return axiosInstanceAuth.delete(`/article-category/${articleCategoryId}`)
}
const searchArticleCategory = (searchQuery) => {
    return axiosInstanceAuth.get('/article-category/search', { params: { name: searchQuery } })
}
const getArticleCategoryById = (articleCategoryId) => {
    return axiosInstanceAuth.get(`/article-category/${articleCategoryId}`)
}
const getAllArticleCategory = () => {
    return axiosInstance.get('/article-category/get-all-category')
}
export {
    getArticleCategory,
    createArticleCategory,
    getArticleCategoryById,
    deleteArticleCategory,
    searchArticleCategory,
    editArticleCategory,
    getAllArticleCategory
}