import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import './Signup.css';
import {Card} from 'react-bootstrap';
import firebase from '../../Services/Firebase';
import CssBaseLine from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LoginString from '../Login/LoginStrings';
import Typography from '@material-ui/core/Typography';

export default class Signup extends Component{
   constructor(){
       super()
        this.state={
            email:"",
            password:"",
            name:"",
            error:null
        }
        this.handelchange=this.handelchange.bind(this)
        this.handelSubmit=this.handelSubmit.bind(this)
   }
   handelchange(event){
       this.setState({
           [event.target.name]:event.target.value
       });
   }

   async handelSubmit(event){
       const {name,password,email}=this.state;
        event.preventDefault();
        try{
             firebase.auth().createUserWithEmailAndPassword(email,password)
             .then(async result=>{
                 firebase.firestore().collection('users')
                 .add({
                     name,
                     id:result.user.uid,
                     email,
                     password,
                     URL:'',
                     Description:'',
                     messages:[{notificationId:"",number:0}]
                 }).then(docRef=>{
                    localStorage.setItem(LoginString.ID,result.user.uid);
                    localStorage.setItem(LoginString.Name,name);
                    localStorage.setItem(LoginString.Email,email);
                    localStorage.setItem(LoginString.Password,password);
                    localStorage.setItem(LoginString.PhotoURL,"");
                    localStorage.setItem(LoginString.UPLOAD_CHANGED,'state_changed');
                    localStorage.setItem(LoginString.Description,"");
                    localStorage.setItem(LoginString.FirebaseDocumentId,docRef.id);
                    this.setState({
                        name:'',
                        password:'',
                        
                    });
                    this.props.history.push("/chat")
                 })
                 .catch((error)=>{
                     console.error("Error adding Document",error)
                 })
             })
        }catch(error){
              document.getElementById("1").innerHTML="Error in Signing up please try again..."
        }
   }

   render(){
      const Signinsee={
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          color:'White',
          backgroundColor:'#1ebea5',
          width:'100%',
          boxShadow:"0 5px 5px #808888",
          height:"10rem",
          paddingTop:"48px",
          opacity:"0.5",
          borderBottom:'5px solid green'
      }


       return(
           <div>
               <CssBaseLine/>
               <Card style={Signinsee}>
                 <div>
                 <Typography component="h1"  variant="h5">  
                  Sign Up
                  </Typography>
                 </div>
                 <br/>
                 <div>
                     <Link to="/">
                         <button class="btn">HOME</button>
                     </Link>
                 </div>
               </Card>
               <Card className="formacontrooutside">
                 <form className="customform" noValidate onSubmit={this.handelSubmit}>
                   
                   <TextField
                      variant="outlined" margin="normal" required fullWidth id="email" label="Enter your Email Address"
                      name="email" autoComplete="email" autoFocus onChange={this.handelchange} value={this.state.email}
                   />
                   <div>
                       <p style={{color:'grey',fontSize:'15px',marginLeft:'0'}}>
                           Password:length must be greater than 6(alphabet,number,special character)
                       </p>
                   </div>
                   <TextField
                      variant="outlined" margin="normal" required fullWidth id="password" label="Enter your Password"
                      name="password" type="password" autoComplete="current-password" 
                      autoFocus onChange={this.handelchange} value={this.state.password}
                   />

                   <TextField
                      variant="outlined" margin="normal" required fullWidth id="name" label="Enter your Name"
                      name="name" autoComplete="name" 
                      autoFocus onChange={this.handelchange} value={this.state.name}
                   />
                     <br/>
                   <div className="CenterAliningItems">
                      <button class="button1" type="submit">
                          <span>Sign Up</span>
                      </button>
                   </div>
                   <div>
                       <p style={{color:'grey'}}>Already Have An Account?</p>
                       <Link to="/login">
                       <button class="button2">Login</button>
                       </Link>
                   </div>
                   <div className="error">
                      <p id="1" style={{color:'red'}}></p>
                  </div>
                 </form>
               </Card>
           </div>
       )
   }
}