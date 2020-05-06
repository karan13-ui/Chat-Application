import React,{Component} from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import './Home.css';
import images from '../../ProjectImages/ProjectImages';
import {Link} from 'react-router-dom';

export default class HomePage extends React.Component{
    render(){
        return(
            <div>
            <Header/>
            <div className="splash-container">
                <div className="splash">
                    <h1 className="splash-head">Welcome To Chat App</h1>
                    <p className="splash-subhead">Let's Chat and Have Some Fun</p>
                    <div id="custom-button-wrapper">
                        <Link to='/login'>
                            <a class="my-super-cool-btn">
                             <div class="dots-container">
                                 <div class="dot"></div>
                                 <div class="dot"></div>
                                 <div class="dot"></div>
                                 <div class="dot"></div>
                             </div>
                             <span className="buttoncooltext">Get Started</span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
         
            <div class="content-wrapper">
                <div class="content">
                   <h2 class="content-head is-center">Features Of Chat App</h2>
                   <div className="Appfeatures">
                   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                       <div className="contenthead">
                           <h3 class="content-subhead">
                               Get Started
                           </h3>
                           <p>
                               just register yourself with this app..
                           </p>
                       </div>
                       &nbsp; &nbsp; &nbsp; &nbsp;
                       <div class="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                       <h3 class="content-subhead">
                               Firebase
                           </h3>
                           <p>
                               Firebase has been used in this app..
                           </p>
                       </div>
                       <div class="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                       <h3 class="content-subhead">   
                           Image Transfer
                           </h3>
                           <p>
                               You can share Images with this app..
                           </p>
                       </div>
                       <div class="1-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                       <h3 class="content-subhead">
                               Updates
                           </h3>
                           <p>
                               Further scope of update..
                           </p>
                       </div>
                   </div>
                </div>
                <div class="AppfeaturesFounder">
                    <div class="1-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
                        <br/>
                        <img width="300" alt="File Icons" class="pure-img-responsive" src={images.karan}/>
                    </div>
                    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
                        <h2 class="content-head content-head-ribbon">Karan Rustagi</h2>
                        <p style={{color:'white'}}>
                            NIT BHOPAL
                        </p>
                        <p style={{color:'white'}}>
                            Currently doing mca from nit bhopal....
                        </p>
                    </div>
                </div>
            <Footer/>
            </div>  
     </div>
        )
    }
}
