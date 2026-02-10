const API_BASE_URL = 'http://localhost:8888/api';
const MOCK_BASE_URL = 'https://m1.apifoxmock.com/m1/7818580-7566390-default'

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

    async get(url) {
        try {
            const requestUrl = MOCK_BASE_URL + url;
            const response = await fetch(requestUrl)
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json()
            console.log('data from get:', data)
            return data;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const apiService = new ApiService();
export default apiService;
