/*主页面路由组件*/
import React, {Component} from 'react'
import {getItem} from '../../utils/storage-utils';
import memory from '../../utils/memory-utils'
import {Route,Redirect,Switch} from 'react-router-dom'
import LeftNav from '../../components/left-nav'
import Home from '../home'
import Category from '../category'
import Product from '../product/index'
import HeaderMain from '../../components/header-main/'
import Role from '../../pages/role'
import Bar from '../../pages/charts/bar'
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'
import User from '../../pages/user'

import {
  Layout
} from 'antd';
const {
  Header, Content, Footer, Sider,
} = Layout;
export default class Admin extends Component{
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
    };
    //判断用户是否登录过
    const user = getItem();
    if(user || user._id){
      //在内存中存储用户信息
      memory.user = user;
    }
  }
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  render() {
    if(!memory.user || !memory.user._id){
      return <Redirect to='/login'/>
    }
    const {collapsed} = this.state;
    const opacity = collapsed ? 0:1;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <LeftNav opacity={opacity}/>
        </Sider>
        <Layout>
          <Header style={{  background: '#fff', padding: 0 , height: 100}} >
            <HeaderMain/>
          </Header>
          <Content style={{ margin: '20px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/user' component={User}/>
                <Route path='/role' component={Role}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Redirect to='/home'/>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}