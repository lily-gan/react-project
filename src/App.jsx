import React,{Component} from 'react'
import {Route,Redirect,Switch,withRouter} from 'react-router-dom'
import Login from './pages/login'
import Admin from './pages/admin'

class App extends Component{
  render(){
    return(
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/admin' component={Admin}/>
        <Redirect to='/login'/>
      </Switch>
    )
  }
}
export default withRouter(App);