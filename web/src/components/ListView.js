import React, { Component } from 'react';
import './css/ListView.css';


class ListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name:"",
      year:"",
      loggedIn: false,
      movies: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateList = this.updateList.bind(this);
    this.deleteListEntry = this.deleteListEntry.bind(this);
    this.getLoggedInUser = this.getLoggedInUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount(){

    if (localStorage.getItem('jwt_token')) {
      this.setState({ loggedIn: true }, function() {
        this.updateList();
      });
    }
  }

  handleNameChange(event){
    this.setState({
      name: event.target.value
    });
  }

  handleYearChange(event){
    this.setState({
      year: event.target.value
    });
  }

  updateList(){
    console.log("called updatelist!");
    fetch("/api/movies",
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-access-token': localStorage.getItem("jwt_token")
      }
    }).then(this.getLoggedInUser()).then((responseText) => responseText.json())
      .then((response) => this.setState({movies: response}));

  }

  handleSubmit(event){
    event.preventDefault();
    fetch("/api/movies",
    {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-access-token': localStorage.getItem("jwt_token")
      },
        body: JSON.stringify({
          name: this.state.name,
          year: this.state.year,
          public: true
        })
    })
    this.updateList();
  }

  getLoggedInUser(){
    console.log("called!");
    fetch("/api/users",
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-access-token': localStorage.getItem("jwt_token")
      }
    }).then((responseText) => responseText.json())
      .then((response) => this.setState({loggedInUser: response.username}));
  }

  deleteListEntry(id){
    console.log(id);
    fetch("/api/userList/" + id,
    {
      method: "DELETE",
    })
    this.updateList();
  }

  logout(){
    console.log("called logout!");
    fetch("/api/logout",
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function(response){
          response.json().then(json =>{
            console.log(json.redirect);
            localStorage.removeItem("jwt_token", json.token);
            window.location = json.redirect;
          });
    });
  }



  render() {

    if (!this.state.loggedIn)
      return window.location = '/login';

    return (
      <div className="ListView">
        <h1>Create a list of your favorite movies! </h1>
        <div id="movieContainer">
          <p id="loggedInUser">Welcome  {this.state.loggedInUser} </p>
          <button className="logoutBtn" onClick={() => {this.logout()}}>Logout!</button>
          <form id="input" onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.name} name="name" onChange={this.handleNameChange} placeholder="Name goes here" required />
            <input type="number" value={this.state.year} name="year" onChange={this.handleYearChange} placeholder="Year goes here" required />
            <input type="submit" value="Add movie!"/>
            <div id="listContainer">
              <h2>Movie</h2>
              <h2>Year</h2>
              <ul>
                {
                  this.state.movies.map(function(movie, index){
                  return <li key={index}>
                    <p className="name">{movie.name}</p>
                    <p className="year">{movie.year}</p>
                    <p className="public">{movie.public}</p>
                    <span className="deleteBtn" onClick={() => {this.deleteListEntry(movie.userListID)}}>X</span>
                  </li>
                },this)
              }
              </ul>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ListView;
