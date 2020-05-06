import React,{Component} from 'react';
import './App.css';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

import Home from './Pages/Home/Home';
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import {toast,ToastContainer} from 'react-toastify';

class App extends Component{

  showToast=(type,message)=>{
    switch(type){
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;    
    }
  } 
    render(){
      return (
        <Router>
          <ToastContainer
             autoClose={2000}
             hideProgressBar={true}
             position={toast.POSITION.TOP_CENTER}
             />
             <Switch>
             <Route
             exact
             path="/"
             render={props=><Home {...props}/>}/>
             <Route
                path="/login"
                render={props=><Login showToast={this.showToast}{...props}/>}
             />
             <Route
                path="/profile"
                render={props=><Profile showToast={this.showToast}{...props}/>}
             />
             <Route
                path="/signup"
                render={props=><Signup showToast={this.showToast}{...props}/>}
             />
             <Route
                path="/chat"
                render={props=><Chat showToast={this.showToast}{...props}/>}
             />
             </Switch>
        </Router>
      )
    }

}

export default App

