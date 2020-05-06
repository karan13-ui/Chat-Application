import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

function Header(){
    return(
        <header className="header-login-signup">
         <div className="header-limiter">
           <h1><a href="/"><u>ChatApp</u></a></h1>
           <nav>
              <Link to="/">Home</Link>
           </nav>
           <ul>
               <li><Link to="/login">Login</Link></li>
               <li><Link to="/signup">Sign Up</Link></li>
           </ul>
         </div>
        </header>
    )
}

export default Header