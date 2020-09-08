import React, { Component } from "react";
import texts from "../texts";
import { fetch_post_json } from "../functions";

export default class Signin extends Component {
    constructor() {
        super();
        this.state = {
            emailText: '',
            passwordText: '',
            warning: ''
        }
    }

    //returns the warning text based on the status received from the server
    getWarningText = (status) => {
        switch (status) {
            case "missing_credential":
                return texts.fill_all_warning[this.props.language]
            case "email_not_registered":
                return texts.email_not_registered_warning[this.props.language]
            case "wrong_password":
                return texts.wrong_password_warning[this.props.language]
            default:
                return texts.db_error_warning[this.props.language]
        }
    }

    //sends the email and password to the server and requests to sign the user in
    onSubmitSignin = () => {
        if (this.state.emailText.length === 0 || this.state.passwordText.length === 0) {
            this.setState({ warning: texts.fill_all_warning[this.props.language] });
            return;
        }
        this.props.changeIsChecking(true);
        this.setState({ warning: "" })
        fetch_post_json(this.props.serverAddress + "login", { email: this.state.emailText, password: this.state.passwordText })
            .then(data => {
                if (data.success) {
                    this.props.signUserIn(data.user);
                    this.props.changeIsChecking(false);
                }
                else {
                    this.setState({ warning: this.getWarningText(data.status) });
                    this.props.changeIsChecking(false);
                }
            })
            .catch(() => {
                this.setState({ warning: texts.cant_connect_to_server_warning[this.props.language] });
                this.props.changeIsChecking(false);
            });
    }

    //watches the changes on the email field
    onEmailChange = (event) => {
        this.setState({ emailText: event.target.value });
    }

    //watches the changes on the password field
    onPasswordChange = (event) => {
        this.setState({ passwordText: event.target.value });
    }

    render() {
        return (
            <div className="form-outer">
                <div className="form-container">
                    <div>
                        <p className="form-header-text">{texts.sign_in_text[this.props.language]}</p>
                        <hr className="form-hr" />
                    </div>
                    <div>
                        <div className="form-element-label">{texts.email_text[this.props.language]}</div>
                        <input type="email" name="email" className="form-input-field" onChange={this.onEmailChange} />
                    </div>
                    <div>
                        <div className="form-element-label">{texts.password_text[this.props.language]}</div>
                        <input type="password" name="password" className="form-input-field" onChange={this.onPasswordChange} />
                    </div>
                    <input type="submit" className="form-submit" value={texts.sign_in_text[this.props.language]} onClick={this.onSubmitSignin} />
                    <p className="form-direct" onClick={() => this.props.changeRoute("sign_up")}>{texts.sign_up_text[this.props.language]}</p>
                    <p className="form-direct" onClick={() => this.props.changeRoute("forgot_password")}>{texts.forgot_password_text[this.props.language]}</p>
                    <p className="form-warning">{this.state.warning}</p>
                </div>
            </div>
        );
    }
}
