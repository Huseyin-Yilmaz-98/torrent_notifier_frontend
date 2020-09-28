import React from 'react';
import LoggedOut from "../LoggedOut/LoggedOut";
import LoggedIn from "../LoggedIn/LoggedIn";
import Loading from '../Loading';
import NavigationBar from "../NavigationBar/NavigationBar";
import { withCookies } from 'react-cookie';
import HowToUse from "../NavigationBar/HowToUse";
import MyRequests from '../NavigationBar/MyRequests';
import texts from "../texts";
import { fetch_get, fetch_post_json } from '../functions';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            user: {},
            isChecking: true,
            language: props.cookies.get("language") || this.getLanguage() || "en", //if a language is not defined in the browser cookies before, get it from the function
            showHowToUse: false,
            showRequestList: false,
            requestList: [],
            isInitialComplete: false
        }
    }

    //gets the browser language, if the language is not turkish, returns english
    getLanguage = () => {
        const value = navigator.language.split("-")[0] || navigator.userLanguage.split("-")[0] || "en";
        return value === "tr" ? "tr" : "en";
    }

    //when the page is loaded, check if the user is signed in or not
    componentDidMount = () => {
        fetch_get(this.props.serverAddress + "check_status")
            .then(res => res.json())
            .then(data => {
                this.setState({ signedIn: data.signedIn, user: data.user, isChecking: false, isInitialComplete: true })
            })
            .finally(() => {
                this.setState({ isChecking: false, isInitialComplete: true })
            })
    }

    //if the language is turkish, change it to english, and vice versa
    changeLanguage = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        if (this.state.language === "en") {
            this.setState({ language: "tr" })
            this.props.cookies.set('language', "tr", { path: '/', expires: date });
        }
        else {
            this.setState({ language: "en" })
            this.props.cookies.set('language', "en", { path: '/', expires: date });
        }
    }

    //gets user info and signs user in
    signUserIn = (user) => {
        this.setState({ signedIn: true, user: user });
    }

    //signs user out
    signUserOut = () => {
        this.changeIsChecking(true);
        fetch_get(this.props.serverAddress + "logout")
            .finally(() => this.setState({ signedIn: false, user: {}, isChecking: false }))

    }

    //changes the state variable that decides whether the loading bar should be displayed or not
    changeIsChecking = (status) => {
        this.setState({ isChecking: status });
    }

    //hides how to use modal
    onCloseHowToUseClick = () => {
        this.setState({ showHowToUse: false });
    }

    //opens how to use modal
    onHowToUseClick = () => {
        this.setState({ showHowToUse: true });
    }

    //opens my requests modal and gets the request list from the database
    onMyRequestsClick = () => {
        this.changeIsChecking(true);
        fetch_get(this.props.serverAddress + "get_request_list")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({ showRequestList: true, requestList: data.requests });
                }
                if (data.status === "not_signed_in") {
                    this.signUserOut();
                }
            })
            .finally(() => this.changeIsChecking(false))
    }

    //hides my requests modal
    onCloseMyRequestsClick = () => {
        this.setState({ showRequestList: false, requestList: [] });
    }

    //function to delete a request
    onRequestDelete = (movie_id, movie_name, season, episode) => {
        //open a confirm window and make sure the user wants to delete this request
        if (window.confirm(texts.delete_confirm_text[this.state.language] + movie_name)) {
            this.setState({ showRequestList: false });
            this.changeIsChecking(true);
            fetch_post_json(this.props.serverAddress + "delete_request", { movie_id: movie_id, season: season, episode: episode })
                .then(data => {
                    if (data.success) {
                        this.setState({ showRequestList: true, requestList: data.requests });
                    }
                    if (data.status === "not_signed_in") {
                        this.signUserOut();
                    }
                })
                .finally(() => this.changeIsChecking(false))
        }
    }

    //returns the modal to display; if none, returns null
    getModal = () => {
        if (this.state.showHowToUse) {
            return <HowToUse language={this.state.language} onCloseHowToUseClick={this.onCloseHowToUseClick} />;
        }
        else if (this.state.showRequestList) {
            return <MyRequests language={this.state.language} onCloseMyRequestsClick={this.onCloseMyRequestsClick} onRequestDelete={this.onRequestDelete} requestList={this.state.requestList} />;
        }
        else {
            return null;
        }
    }

    getMainFrame = () => {
        if(this.state.isInitialComplete){
            if(this.state.signedIn){
                return <LoggedIn serverAddress={this.props.serverAddress} signUserOut={this.signUserOut} user={this.state.user} changeIsChecking={this.changeIsChecking} language={this.state.language} />
            }
            else{
                return <LoggedOut serverAddress={this.props.serverAddress} signUserIn={this.signUserIn} changeIsChecking={this.changeIsChecking} language={this.state.language} />
            }
        }
        else{
            return null;
        }
    }
    
    render() {
        return (
            <div className="main-container">
                <NavigationBar language={this.state.language} changeLanguage={this.changeLanguage} signedIn={this.state.signedIn} signUserOut={this.signUserOut} onHowToUseClick={this.onHowToUseClick} onMyRequestsClick={this.onMyRequestsClick} changeIsChecking={this.changeIsChecking} />
                {this.state.isChecking ? <Loading /> : null}
                {
                    this.getMainFrame()
                }
                {
                    this.getModal()
                }
            </div>
        )
    }
}

export default withCookies(Home);