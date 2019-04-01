import React,{Component} from 'react'
export default function withHoc(name) {
  return (WrappedComponent)=>class extends Component{
    static displayName = `Form(${getDisplayName(WrappedComponent)})`
    state={
      username:'',
      password:'',
      rePassword:''
    }
    composeChange=(name)=>{
      return (e)=>{
        this.setState({
          [name]:e.target.value
        })
      }
    }
    //统一所有提交表单函数名
    handleSubmit=(e)=>{
      e.preventDefault();
      const {username,password,rePassword} = this.state;
      alert(`用户名:${username},密码:${password},确认密码:${rePassword}`)
    }
    render(){
      const mapMethodToProp={
        composeChange:this.composeChange,
        handleSubmit:this.handleSubmit
      }
      return <div>
        <h2>{name}</h2>
        <WrappedComponent {...mapMethodToProp}{...this.state}/>
      </div>
    }
  }
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name ||'Component'
}