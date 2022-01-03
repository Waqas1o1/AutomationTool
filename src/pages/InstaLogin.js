import axios from "axios";
import React from "react";
import './styles/login.css';
export default function Login() {
    const initialFields ={
        username:'',
        password:''
    }
    const [fields,setFields] = React.useState(initialFields) 
    
    const HandleLogin = ()=>{
        axios.post('http://127.0.0.1:8000/insta/login/',{...fields})
        .then((res)=>{
           
            window.location.href = '/';
        }).catch(err=>{
            alert(err);
        })
    }
    const handleFieldChange =(e)=>{
        setFields({
            ...fields,
            [e.target.name] : e.target.value
        });
    }
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Indie+Flower|Overpass+Mono"
        rel="stylesheet"
      />
      <div id="wrapper">
        <div className="main-content">
          <div className="header">
            <img alt="img" src="https://i.imgur.com/zqpwkLQ.png" />
          </div>
          <div className="l-part">
            <input type="text" placeholder="Username" name='username' onChange={handleFieldChange} className="input-1" />
            <div className="overlap-text">
              <input
                type="password"
                placeholder="Password"
                className="input-2"
                name='password'
                onChange={handleFieldChange} 
              />
              <a href="https://www.instagram.com/accounts/password/reset/">Forgot?</a>
            </div>
            <input type="button" value="Log in" className="btn" onClick={HandleLogin}/>
          </div>
        </div>
        <div className="sub-content">
          <div className="s-part">
            Don't have an account?<a href="https://www.instagram.com/accounts/emailsignup/">Sign up</a>
          </div>
        </div>
      </div>

      {/* 
<div className="youtube">
  <a href="https://www.youtube.com/channel/UCtVM2RthR4aC6o7dzySmExA" target="_blank">by coding market</a>
</div> */}
    </div>
  );
}
