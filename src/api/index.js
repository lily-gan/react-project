import jsonp from 'jsonp';
import ajax from './ajax'

const prefix = process.env.NODE_ENV === 'development' ? '' : 'http://localhost:5000';

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
          resolve({weather,weatherImg:dayPictureUrl})
        }else{
          reject('请求失败,网络不稳定');
        }
      }
    )
  })
}

// 请求分类列表数据函数
export const reqGetCategories = (parentId)=>ajax(prefix + '/manage/category/list',{parentId});
//请求添加分类函数
export const reqAddCategory = (parentId,categoryName)=>ajax(prefix+'/manage/category/add',{parentId,categoryName},'POST');
//请求修改分类名称函数
export const reqUpdateCategoryName = (categoryId,categoryName)=>ajax(prefix + '/manage/category/update',{categoryId,categoryName},'POST');
//请求商品列表
export const reqGetProducts = (pageNum,pageSize)=>ajax(prefix + '/manage/product/list',{pageNum,pageSize});
//请求添加商品
export const reqAddProducts =(categoryId,pCategoryId,name,price,desc)=>ajax(prefix+'/manage/product/add',{categoryId,pCategoryId,name,price,desc},'POST');

