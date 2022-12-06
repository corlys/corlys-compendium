import axios from "axios";

import { getBaseUrl } from "@/helpers/index";

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

export default axiosInstance;
