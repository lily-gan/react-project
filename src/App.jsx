import React,{Component} from 'react'
import {Route,Switch,withRouter} from 'react-router-dom'
import Login from './pages/login'
import Admin from './pages/admin'

class App extends Component{
  render(){
    return(
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/' component={Admin}/>
      </Switch>
    )
  }
}
export default withRouter(App);