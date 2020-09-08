import React, { Component } from "react";
import Signin from './Signin';
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";

class LoggedOut extends Component {
    constructor() {
        super();
        this.state = {
            route: "sign_in" //route is sign_in or sign_up or forgot_password
        }
    }

    changeRoute = (route) => {
        this.setState({ route: route });
    }

    getForm = () => {
        switch(this.state.route){
            case "sign_in":
                return <Signin changeRoute={this.changeRoute} serverAddress={this.props.serverAddress} signUserIn={this.props.signUserIn} changeIsChecking={this.props.changeIsChecking} language={this.props.language}></Signin>
            case "sign_up":
                return <Signup changeRoute={this.changeRoute} serverAddress={this.props.serverAddress} signUserIn={this.props.signUserIn} changeIsChecking={this.props.changeIsChecking} language={this.props.language}></Signup>
            default:
                return <ForgotPassword changeRoute={this.changeRoute} serverAddress={this.props.serverAddress} changeIsChecking={this.props.changeIsChecking} language={this.props.language}></ForgotPassword>
                
        }
    }

    render() {
        return (
            <div>
                {this.getForm()}
            </div>
        )
    }
}

export default LoggedOut;