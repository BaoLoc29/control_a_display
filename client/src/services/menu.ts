import { axiosInstance } from "@/services/index";

export const getMenu = () => {
  return axiosInstance.get("/menu/get-all-menu");
};
