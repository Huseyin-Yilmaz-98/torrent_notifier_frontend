import React from "react";
import Loading from "../Loading";
import { fetch_post_json } from "../functions";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(this.props.location.search); //get the query params from the link
        this.state = {
            email: params.get("email"),
            code: params.get("code"),
            newPasswordInput: "",
            warning: "",
            isChecking: true,
            didCodeMatch: false,
            isExpired: false,
            didConnect: true,
            isDone: false,
            isLoading: false
        }
    }

    componentDidMount = () => {
        this.checkIfLinkIsCorrect();
    }

    //ask server if the email and the code matches and if the link is expired
    checkIfLinkIsCorrect = () => {
        fetch_post_json(this.props.serverAddress + "password_reset_code_check", { email: this.state.email, code: this.state.code })
            .then(data => {
                if (data.success) {
                    this.setState({ didCodeMatch: true, isChecking: false });
                }
                else {
                    if (data.status === "expired") {
                        this.setState({ isExpired: true })
                    }
                    this.setState({ isChecking: false })
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isChecking: false, didConnect: false })
            })
    }

    //Watches changes in the password field
    onPasswordChange = (event) => {
        this.setState({ newPasswordInput: event.target.value });
    }

    //sends the new password to the server and asks to old one with it
    onPasswordSubmit = () => {
        this.setState({ warning: "", isLoading: true });
        fetch_post_json(this.props.serverAddress + "change_password", { email: this.state.email, code: this.state.code, password: this.state.newPasswordInput })
            .then(data => {
                if (data.success) {
                    this.setState({
                        isDone: true,
                        warning: "Successful/Başarılı",
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        warning: data.status === "password_too_short" || data.status === "password_no_string" ? "Password Too Short\nŞifre Çok Kısa" : "Error/Hata",
                        isLoading: false
                    })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    warning: "Error/Hata",
                    isLoading: false
                })
            })
    }

    //component that displays an error
    ErrorText = (props) => {
        return (
            <h1 className="white center mv5">
                {props.text_eng}
                <br />
                <br />
                {props.text_tr}
            </h1>
        )
    }

    //returns the component to display based on state variables
    getComponentToDisplay = () => {
        if (this.state.isChecking) {
            return <div><h1> </h1><Loading /></div>
        }
        else if (!this.state.didConnect) {
            return <this.ErrorText text_eng="Error connecting to server!" text_tr="Sunucuya bağlanılamadı" />
        }
        else if (this.state.isExpired) {
            return <this.ErrorText text_eng="Link Expired!" text_tr="Linkin süresi dolmuş!" />
        }
        else if (!this.state.email || !this.state.code || !this.state.didCodeMatch) {
            return <this.ErrorText text_eng="Invalid Link!" text_tr="Hatalı Link!" />
        }
        else {
            return (
                <div>
                    <div className="form-outer">
                        <div className="form-container">
                            <div>
                                <div className="form-element-label">New Password / Yeni Şifre</div>
                                <input type="password" name="password" className="form-input-field" onChange={this.onPasswordChange} disabled={this.state.isDone} />
                            </div>
                            <input type="submit" className="form-submit reset-password-submit" value="Submit / Gönder" onClick={this.onPasswordSubmit} disabled={this.state.isDone} />
                            <a className="form-direct" href="/">Main Page / Ana Sayfa</a>
                            <p className="form-warning">{this.state.warning}</p>
                        </div>
                    </div>
                    {this.state.isLoading ? <Loading /> : null}
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.getComponentToDisplay()}
            </div>
        )
    }
}

export default ResetPassword;