import jsonp from 'jsonp';
import ajax from './ajax'

const prefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:5000';

//请求登录函数
export const reqLogin = (username,password) =>ajax(prefix + '/login',{username,password},'POST');
//请求天气函数
export const reqWeather = (city)=>{
  return new Promise((resolve,reject)=>{
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      (err,data)=>{
        if(!err){
          const {dayPictureUrl,weather} = data.results[0].weather_data[0];
          console.log(data , '0000000');
          resolve({weather,weatherImg:dayPictureUrl})
        }else{
          reject('请求失败,网络不稳定');
        }
      }
    )
  })
}