import React, { Component } from 'react';
import './css/LoginForm.css';


class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username:"",
      password:""
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount(){

  }

  handleUsernameChange(event){
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event){
    this.setState({
      password: event.target.value
    });
  }


  handleRegister(event){
    event.preventDefault();
    var username = this.state.username;
    var password = this.state.password;
    if(this.state.password.length < 5){
      console.log("password too short!");
      return;
    }
    fetch("/api/users",
    {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({username, password})
      }).then(this.handleLogin(event));
  }

  handleLogin(event){
    event.preventDefault();
    var username = this.state.username;
    var password = this.state.password;
    fetch("/api/login",
    {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({username, password})
    }).then(function(response){
          response.json().then(json =>{
            console.log(json.redirect);
            localStorage.setItem("jwt_token", json.token);
            window.location = json.redirect;
          });
    });
  }

  deleteListEntry(id){
    console.log(id);
    fetch("/api/movies/" + id,
    {
      method: "DELETE",
    })
  }


  render() {

    return (
    <div className="container">
      <div className="RegisterForm">
        <h1>Register user </h1>
        <div id="createUserContainer">
          <form id="input" onSubmit={this.handleRegister}>
            <label>Username:</label>
            <input type="text" value={this.state.username} name="username" onChange={this.handleUsernameChange} placeholder="Username" required />
            <label>Password:</label>
            <input minLength= "4" type="password" value={this.state.password} name="password" onChange={this.handlePasswordChange} placeholder="Password" required />
            <input type="submit" value="Create user!"/>
          </form>
        </div>
      </div>

      <div className="LoginForm">
        <h1>Login</h1>
        <div id="loginContainer">
          <form id="input" onSubmit={this.handleLogin}>
            <label>Username:</label>
            <input type="text" value={this.state.username} name="username" onChange={this.handleUsernameChange} placeholder="Username" required />
            <label>Password:</label>
            <input type="password" value={this.state.password} name="password" onChange={this.handlePasswordChange} placeholder="Password" required />
            <input type="submit" value="Login!"/>
          </form>
        </div>
      </div>
      </div>
    );
  }
}

export default LoginForm;
