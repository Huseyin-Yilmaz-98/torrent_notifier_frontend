import React, { Component } from "react";
import "./NavigationBar.css";
import texts from "../texts";


export default class NavigationBar extends Component {
    render() {
        return (
            <div>
                <nav className="NavBar">
                    <h3 className="nav-element change-lang" onClick={this.props.changeLanguage}>{texts.lang[this.props.language]}</h3>
                    <h3 className="nav-element how-to" onClick={this.props.onHowToUseClick}>{texts.how_to_use_text[this.props.language]}</h3>
                    {this.props.signedIn
                        ? <h3 className="nav-element" onClick={this.props.onMyRequestsClick}>{texts.my_requests_text[this.props.language]}</h3>
                        : null
                    }
                    {this.props.signedIn
                        ? <h3 className="nav-element" onClick={this.props.signUserOut}>{texts.log_out[this.props.language]}</h3>
                        : null
                    }
                </nav>
                <hr />
            </div>
        )
    }
}