import React, { Component } from "react";
import texts from "../texts";
import { fetch_post_json } from "../functions";

export default class Signup extends Component {
    constructor() {
        super();
        this.state = {
            emailText: '',
            passwordText: '',
            nameText: '',
            warning: ''
        }
    }

    //returns the warning based on the status response from the server
    getWarningText = (status) => {
        switch (status) {
            case "missing_credential":
                return texts.fill_all_warning[this.props.language]
            case "password_too_short":
                return texts.password_too_short_warning[this.props.language]
            case "name_too_short":
                return texts.name_too_short_warning[this.props.language]
            case "email_wrong_pattern":
                return texts.email_wrong_pattern_warning[this.props.language]
            case "email_registered":
                return texts.email_registered_warning[this.props.language]
            default:
                return texts.db_error_warning[this.props.language]
        }
    }

    //sends user the info and requests to sign the user up
    onSubmitSignup = () => {
        const email = this.state.emailText;

        if (email.length === 0 || this.state.passwordText.length === 0 || this.state.nameText.length === 0) {
            this.setState({ warning: texts.fill_all_warning[this.props.language] });
            return;
        }

        if (this.state.passwordText.length < 6) {
            this.setState({ warning: texts.password_too_short_warning[this.props.language] });
            return;
        }

        if (this.state.nameText.length < 2) {
            this.setState({ warning: texts.name_too_short_warning[this.props.language] });
            return;
        }

        const email_split = email.split("@");
        if (email_split.length !== 2 || email_split[0].length === 0 || email_split[1].split(".").length === 1) { //check if email contains @ and .
            this.setState({ warning: texts.email_wrong_pattern_warning[this.props.language] });
            return;
        }

        this.props.changeIsChecking(true);
        this.setState({ warning: "" });
        fetch_post_json(this.props.serverAddress + "register", { email: email, password: this.state.passwordText, name: this.state.nameText })
            .then(data => {
                if (data.success) {
                    this.props.signUserIn(data.user);
                }
                else {
                    this.setState({ warning: this.getWarningText(data.status) })
                }
                this.props.changeIsChecking(false);
            })
            .catch(() => {
                this.setState({ warning: texts.cant_connect_to_server_warning[this.props.language] });
                this.props.changeIsChecking(false);
            })
    }

    //watches for changes in the email field
    onEmailChange = (event) => {
        this.setState({ emailText: event.target.value });
    }

    //watches for changes in the password field
    onPasswordChange = (event) => {
        this.setState({ passwordText: event.target.value });
    }

    //watches for changes in the name field
    onNameChange = (event) => {
        this.setState({ nameText: event.target.value });
    }

    //if enter is pressed, try to sign up
    onKeyDown = (event)=>{
        if(event.keyCode===13){
            this.onSubmitSignup();
        }
    }

    render() {
        return (
            <div className="form-outer">
                <div className="form-container">
                    <div>
                        <p className="form-header-text">{texts.sign_up_text[this.props.language]}</p>
                        <hr className="form-hr" />
                    </div>
                    <div>
                        <div className="form-element-label">{texts.name_text[this.props.language]}</div>
                        <input type="text" name="name" className="form-input-field" onChange={this.onNameChange} onKeyDown={this.onKeyDown}/>
                    </div>
                    <div>
                        <div className="form-element-label">{texts.email_text[this.props.language]}</div>
                        <input type="email" name="email" className="form-input-field" onChange={this.onEmailChange} onKeyDown={this.onKeyDown}/>
                    </div>
                    <div>
                        <div className="form-element-label">{texts.password_text[this.props.language]}</div>
                        <input type="password" name="password" className="form-input-field" onChange={this.onPasswordChange} onKeyDown={this.onKeyDown}/>
                    </div>
                    <input type="submit" className="form-submit" value={texts.sign_up_text[this.props.language]} onClick={this.onSubmitSignup} />
                    <p className="form-direct" onClick={() => this.props.changeRoute("sign_in")}>{texts.sign_in_text[this.props.language]}</p>
                    <p className="form-warning">{this.state.warning}</p>
                </div>
            </div>
        )
    }
}