import React, {Component,Fragment} from 'react'
import './left-nav.less'
import {Menu,Icon} from 'antd'
import {Link,withRouter} from 'react-router-dom'
import ProtoType from 'prop-types'
import logo from '../../assets/images/logo.png'
import menuList from "../../config/menu-config";
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
/*左侧导航组件*/
@withRouter
 class LeftNav extends Component{
  constructor(props){
    super(props);
    //初始化状态
    const openKeys=[];
    this.menus=this.CreateMenu(menuList,openKeys);
    console.log(this.menus,'111111');
    this.state={
      openKeys
    }
  }
    static protoType={
      opacity:ProtoType.number.isRequired,
    };

    CreateItem(item){
      return <Item key={item.key}>
        <Link to={item.key}>
          <Icon type={item.icon}/>
          <span>{item.title}</span>
        </Link>
      </Item>
    }
    CreateMenu(menuList,openKeys){
      const {pathname} = this.props.location;
      return menuList.map((menu)=>{
        const {children}= menu;
        if(children){
          return  <SubMenu
            key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
            {
              children.map((item) => {
                if(pathname===item.key){
                  openKeys.push(menu.key)
                }
                return this.CreateItem(item)
              })
            }
          </SubMenu>
        }else{
          //返回一级菜单
         return this.CreateItem(menu);
        }
      })
    }
    handleOPenChange=(openKeys)=>{this.setState({openKeys})
    }
    handleClick=()=>{
    this.setState({
      openKeys:[]
    })
  }
  render(){
    const {location:{pathname},opacity} = this.props;
    return (
      <Fragment>
        <Link to="/home" className="logo" onClick={this.handleClick}>
          <img src={logo} alt="logo"/>
          <h1 style={{opacity}}>硅谷后台</h1>
        </Link>
        <Menu theme="dark" selectedKeys={[pathname]} mode="inline" openKeys={this.state.openKeys} onOpenChange={this.handleOPenChange}>
          {
            this.menus
          }
        </Menu>
      </Fragment>
    )
  }
}
export default LeftNav;