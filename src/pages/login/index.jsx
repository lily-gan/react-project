import React,{Component} from 'react'
import logo from '../../assets/images/logo.png'
import './index.less'
import {reqLogin} from '../../api'
import {setItem} from '../../utils/storage-utils'

import {
  Form, Icon, Input, Button,message
} from 'antd';

const Item = Form.Item;
@Form.create()
 class Login extends Component {
   login = (e) => {
     e.preventDefault();
     this.props.form.validateFields(async(err,values)=>{
       if(!err){
         //校验成功
         const {username,password} = values;
         const result = await reqLogin(username,password)
         console.log(result,'result');
         if(result.status === 0){
           message.success('登录成功~');
           //保存用户信息
           setItem(result.data);
           this.props.history.replace('/')
         }else{
           message.error(result.msg,2)
         }
       }else {
           console.log(values);
           console.log('表单校验失败');
           console.log(err);
           console.log('表单校验失败');
         }
     })
   }
   validator =(rule,value,callback)=>{
     const length=value&&value.length;
     const pwdReg = /^[a-zA-Z0-9_]+$/;
     if(!value){
       callback('必须输入密码');
     }else if(length<4){
       callback('密码必须大于4位')
     }else if(length>12){
       callback('密码必须小于12位')
     }else if(!pwdReg.test(value)){
       callback('密码必须是英文,数组或下划线组成')
     }else{
       callback();
     }
   }
   render() {
     const {getFieldDecorator} = this.props.form;
     return (
       <div className="login">
         <header className="login-header">
           <img src={logo} alt="logo"/>
           <h1>React项目:后台管理系统</h1>
         </header>
         <section className="login-content">
           <h3>用户登录</h3>
           <Form onSubmit={this.login} className="login-form">
             <Item>
               {
                 getFieldDecorator('username',{
                   rules:[
                     {required:true,whiteSpace:true,message:'必须输入用户名'},
                     {min:4,message:'用户名必须大于4位'},
                     {max:12,message:'用户名必须小于12位'},
                     {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文,数组或下划线组成'}
                   ]
                 })(
                   <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
                 )
               }
             </Item>
             <Item>
               {
                 getFieldDecorator('password',{
                   rules:[
                     {validator:this.validator}
                   ]
                 })(
                   <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="Password"/>
                 )
               }
             </Item>
             <Item>
               <Button type="primary" htmlType="submit" className="login-form-button">
                 登录
               </Button>
             </Item>
           </Form>
         </section>
       </div>
     )
   }
 }
export default Login;