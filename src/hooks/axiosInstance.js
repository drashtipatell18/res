import axios from "axios";

const createAxiosInstance = () => { 
  const apiUrl = process.env.REACT_APP_API_URL;
    const axiosInstance = axios.create({
      baseURL: apiUrl, 
    });
    const getToken = async () => {
      const token = await localStorage.getItem("token");
      return token;
    };
    axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken(); 
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  
    return axiosInstance; 
  };
  
  const axiosInstance = createAxiosInstance();

  export default axiosInstance; 
