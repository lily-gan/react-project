/*主页面路由组件*/
import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import {getItem} from '../../utils/storage-utils';
import memory from '../../utils/memory-utils'

export default class Admin extends Component{
  constructor(props){
    super(props);
    //判断用户是否登录过
    const user = getItem();
    if(!user || !user._id){
      //用户没登录就返回登录页面
      return this.props.history.replace('/login');
    }
    memory.user = user;
  }
  render(){
   return(
     <div>
       Admin
     </div>
   )
  }
}