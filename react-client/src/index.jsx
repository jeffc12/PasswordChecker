import React from 'react';
import ReactDOM from 'react-dom';
import SignIn from './components/SignIn.jsx';
import DashBoard from './components/DashBoard.jsx';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={SignIn}/>
          <Route path="/dashboard" component={DashBoard}/>
        </div>
      </Router>
    )
  }
}



ReactDOM.render(<App/>, document.getElementById('app'));
