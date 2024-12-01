import { axiosInstanceAuth } from "./index";

const getArticle = ({ pageSize, pageIndex }) => {
    return axiosInstanceAuth.get(`/article/get-paging-article?pageSize=${pageSize}&pageIndex=${pageIndex}`);
}
const createArticle = (data) => {
    return axiosInstanceAuth.post('/article/create-article', data)
}
const deleteArticle = (id) => {
    return axiosInstanceAuth.delete(`/article/delete-article/${id}`)
}
const searchArticle = (searchQuery) => {
    return axiosInstanceAuth.get('/article/search', { params: { title: searchQuery } })
}
const getArticleById = (articleId) => {
    return axiosInstanceAuth.get(`/article/get-article/${articleId}`)
}
const editArticle = (data, articleId) => {
    return axiosInstanceAuth.put(`/article/edit-article/${articleId}`, data);
};

export {
    getArticle,
    createArticle,
    deleteArticle,
    searchArticle,
    editArticle,
    getArticleById
}