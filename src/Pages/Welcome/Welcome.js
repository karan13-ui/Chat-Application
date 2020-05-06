import React,{Component} from 'react';
import './Welcome.css';
import 'react-toastify/dist/ReactToastify.css';


export default class WelcomeCard extends React.Component{
    render(){
        return(
            <div className="viewWelcomeBoard">
              <img 
                className="avatarWelcome"
                src={this.props.currentUserPhoto}
                alt=""
              />
              <span className="textTitleWelcome">
                      {`Welcome, ${this.props.currentUserName}`}
              </span>
              <span className="textDesciptionWelcome">
                      Let's Chat and Have Some Fun..
              </span>
            </div>
        )
    }
}