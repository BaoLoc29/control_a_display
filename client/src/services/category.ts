import { axiosInstance } from "@/services/index";

export const getCategory = () => {
  return axiosInstance.get("/article-category/get-all-category");
};
