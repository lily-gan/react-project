import React,{Component} from 'react'
import './index.less'
import { withRouter } from 'react-router-dom'
import dayjs from 'dayjs'
import {Row,Col,Modal,message} from 'antd'
import {reqWeather} from "../../api";
import {removeItem} from "../../utils/storage-utils";
import memory from '../../utils/memory-utils'
import MyButton from "../my-button";
import menuList from "../../config/menu-config";

@withRouter
class HeaderMain extends Component{
  state = {
    sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherImg:'http://api.map.baidu.com/images/weather/day/qing.png',
    weather:'晴'
  }
  //退出登录
  logout = () =>{
    Modal.confirm({
      title:'您确认要退出登录吗?',
      onOk:() =>{
        //清空所有用户信息
        memory.user = {};
        removeItem();
        //跳转到登录页面
        this.props.history.replace('/login');
      },
      okText:'确认',
      cancelText:'取消'
    })
  }
  componentDidMount(){
    this.timer=setInterval(()=>{
      this.setState({
        sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
    },1000)
    // 请求天气数据
    reqWeather('深圳')
      .then(res=>{
        this.setState({
          weatherImg:res.weatherImg,
          weather:res.weather
        })
      })
      .catch(err=>message.error(err,2))
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  //获取title
  getTitle=()=>{
    /*如果pathname===选中的key的值,那么久返回其title的值*/
    const {pathname} = this.props.location;
    for(let i=0,length=menuList.length;i<length;i++){
      const menu = menuList[i];
      const children =menu.children;
      if(children){
        for(let j=0,length=children.length;j<length; j++){
          const item = children[j];
         if( item.key === pathname ){
           return item.title;
         }
        }
      }else{
        if(menu.key === pathname){
          return menu.title;
        }
      }
    }
  }
    render(){
    const {sysTime,weatherImg,weather}=this.state;
    const title = this.getTitle();
    const username = memory.user.username;
        return(
            <div className="header-main">
               <Row className="header-main-top">
                 <span>欢迎,{username}</span>
                 <MyButton onClick={this.logout}>退出</MyButton>
               </Row>
              <Row className="header-main-bottom">
                <Col className="header-main-left" span={6}>{title}</Col>
                <Col className="header-main-right" span={18}>
                  <span>{sysTime}</span>
                  <img src={weatherImg} alt="天气"/>
                  <span>{weather}</span>
                </Col>
              </Row>
            </div>
        )
    }
}
export default HeaderMain;