/*封装axios用来发送请求的模块
* 需求:
*   1.返回值promise
*   2.请求成功,返回值里面就是data数据
*   3.请求失败,统一处理错误
*
* */
import axios from 'axios'
import {message} from 'antd'
export default function ajax(url, data, method = 'GET') {
  method = method.toUpperCase();
  let promise = null;
  //get请求
  if(method === 'GET'){
    promise = axios.get(url,{
      params:data
    })
  } else {
    //post请求
    promise = axios.post(url,data)
  }
  return promise
    .then(res=>{
      return res.data;
    })
    .catch(err=>{
      console.log('*****请求失败了******');
      console.log(err);
      console.log('*****请求失败了******');
      message.error('网络异常,请重试',2)
    })
}
