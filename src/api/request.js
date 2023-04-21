import axios from 'axios'

const service = axios.create({
    baseURL: "http://localhost:8080"
  })
  
  // 请求拦截器
  service.interceptors.request.use(
    (config)=>{
      config.headers = {
        //jwt
        Authorization: 'aaa.bbb.ccc'
      }
      return config
    },
    (error)=>{
      return Promise.reject(error)
    }
  )
  
  // 响应拦截器
  service.interceptors.response.use(
    (response)=>{
      if(response.data.code === 200) {
        return response
      }     
    //   else if(response.data.code === 401) {       
    //     return Promise.resolve({})
    //   }
    },
    (error)=>{
      console.error(error)
    //   if(error.response.status === 400) {
    //     // 情况1
    //   } else if(error.response.status === 401) {
    //     // 情况2
    //   } 
      return Promise.resolve({})
    }
  )
  
  export default service