import React,{Component} from 'react'
import withHoc from './01.hoc'
@withHoc('登录')
class Login extends Component{
  render(){
    const {username,password,handleSubmit,composeChange} = this.props;
    return(
      <div>
        <form onSubmit={handleSubmit}>
          用户名:<input type="text" name="username" value={username} onChange={composeChange('username')}/><br/>
          密码:<input type="password" name="password" value={password} onChange={composeChange('password')}/><br/>
          <input type="submit" name="submit" value="登录"/>
        </form>
      </div>
    )
  }
}
export default Login;