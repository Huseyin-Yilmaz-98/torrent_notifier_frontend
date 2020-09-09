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
import info from "./info.json";

class App extends React.Component {
  render() {
    const server_address = info.server_address;
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
