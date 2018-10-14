import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm';
import ListView from './components/ListView';
import { Router, Route, BrowserRouter } from 'react-router-dom';

const Root = () => {
  return (
      <BrowserRouter>
        <div className="container">
          <Route path="/login" component={LoginForm} />
          <Route path="/yourList" component={ListView} />
        </div>
      </BrowserRouter>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
