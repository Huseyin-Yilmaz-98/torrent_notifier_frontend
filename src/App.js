import React from 'react';
import './App.css';
import 'tachyons';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ResetPassword from './Routes/ResetPassword';
import Home from './Routes/Home';

class App extends React.Component {
  render() {
    const server_address = "http://192.168.1.88:3333/";
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/reset_password" render={(props) => <ResetPassword serverAddress={server_address} location={props.location} />} />
            <Route exact path="/" render={() => <Home serverAddress={server_address} />} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
