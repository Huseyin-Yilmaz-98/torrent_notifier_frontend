import React, { Component } from "react";
import texts from "../texts";
import { fetch_post_json } from "../functions";

export default class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            emailText: '',
            warning: '',
            isSent: false
        }
    }

    //sends email to the server and requests a mail to reset the password
    onSubmitResetPassword = () => {
        this.props.changeIsChecking(true);
        this.setState({ warning: "" });
        fetch_post_json(this.props.serverAddress + "forgot_password", { email: this.state.emailText })
            .then(data => {
                if (data.success) {
                    this.setState({
                        warning: texts.mail_sent_text[this.props.language],
                        isSent: true
                    });
                }
                else {
                    this.setState({ warning: texts.mail_not_sent_error[this.props.language] });
                }
                this.props.changeIsChecking(false);
            })
            .catch(err => {
                this.setState({ warning: texts.mail_not_sent_error[this.props.language] });
                this.props.changeIsChecking(false);
            })
    }

    //watches for the changes in the email field
    onEmailChange = (event) => {
        this.setState({ emailText: event.target.value });
    }

    //if enter is pressed, try to submit
    onKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.onSubmitResetPassword();
        }
    }

    render() {
        return (
            <div className="form-outer">
                <div className="form-container">
                    <div>
                        <p className="form-header-text">{texts.reset_password_text[this.props.language]}</p>
                        <hr className="form-hr" />
                    </div>
                    <div>
                        <div className="form-element-label">{texts.email_text[this.props.language]}</div>
                        <input type="email" name="email" className="form-input-field" disabled={this.state.isSent} onChange={this.onEmailChange} onKeyDown={this.onKeyDown} />
                    </div>
                    <input type="submit" className="form-submit forgot-password-submit" disabled={this.state.isSent} value={texts.reset_password_text[this.props.language]} onClick={this.onSubmitResetPassword} />
                    <p className="form-direct" onClick={() => this.props.changeRoute("sign_in")}>{texts.sign_in_text[this.props.language]}</p>
                    <p className="form-direct" onClick={() => this.props.changeRoute("sign_up")}>{texts.sign_up_text[this.props.language]}</p>
                    <p className="form-warning">{this.state.warning}</p>
                </div>
            </div>
        )
    }
}