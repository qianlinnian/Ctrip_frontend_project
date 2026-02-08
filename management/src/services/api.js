const API_BASE_URL = 'http://localhost:8888/api';

class ApiService {
    constructor() {
        //定义基础路由地址
        this.baseURL = API_BASE_URL;
    }

    //将基础路由和端点拼接，组成完整请求；option为可选内容
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                //...操作符将{}中的内容展开并拼接
                ...options.headers,
            },
            ...options
        };


        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const apiService = new ApiService();
export default apiService;
