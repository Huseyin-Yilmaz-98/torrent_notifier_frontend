import React, { Component } from "react";
import MovieCard from "./MovieCard";
import MovieIDForm from "./MovieIDForm";
import './LoggedIn.css';
import Versions from "./Versions";
import texts from "../texts";
import { fetch_post_json } from "../functions";
import SeasonEpisode from "./SeasonEpisode";


class LoggedIn extends Component {
    constructor() {
        super();
        this.state = {
            isMovieFound: false, //if this state is true, the movie info will be shown in the page
            movie: {},
            selectedFormats: [], //release types selected by the user will be in this state variable
            warning: '', //when a warning or info is to be shown to the user, it will be obtained from this variable
            linkInput: '', //this variable holds the text in the search bar
            formats: [], //list of all release types obtained from the server
            isSearching: false, //if true, request to get new suggestions from the server won't be fulfilled
            lastSearched: "", //holds the last search string to get suggestions
            showSuggestions: false, //true when a list of suggestions is obtained from the server
            suggestions: [], //list of suggestions obtained from the server
            isSuccessful: false,
            episode: "-1",
            season: "-1"
        }
    }

    /*when user clicks on a suggestion in the search bar,
    the text will be replaced with the imdb id of the title,
    and the info for that title will be requested*/
    onSuggestionClick = (movie_id) => {
        this.setState({
            linkInput: movie_id,
            lastSearched: movie_id
        });
        document.getElementsByClassName("link-input")[0].value = movie_id; //Replace the text in the search bar with the imdb id
        this.getMovieInformation(movie_id);
    }

    //sets the warning message based on the status response from the server
    setWarningFromStatus = (status) => {
        switch (status) {
            case "movie_id_missing":
            case "movie_id_no_string":
                return texts.movie_id_missing_warning[this.props.language];
            case "not_signed_in":
                return texts.not_signed_in_warning[this.props.language];
            case "parsing_error":
                return texts.parsing_error_warning[this.props.language];
            case "formats_missing":
            case "formats_not_list":
            case "no_formats_selected":
                return texts.no_formats_selected_warning[this.props.language];
            case "invalid_movie_id":
            case "movie_not_in_database":
                return texts.invalid_movie_id[this.props.language];
            default:
                return texts.db_error_warning[this.props.language];
        }
    }

    /*gets the movie information from the server,
    if an m_id is passed as parameter, function will send that to server,
    otherwise the text in the search bar will be sent*/
    getMovieInformation = (m_id) => {
        this.setState({ //resetting all previous state variables about titles
            warning: "",
            isMovieFound: false,
            movie: {},
            selectedFormats: [],
            formats: [],
            showSuggestions: false,
            isSuccessful: false,
            episode: "-1",
            season: "-1"
        });
        const movie_id = m_id ? m_id : this.state.linkInput;
        if (movie_id.length === 0) {
            this.setState({ warning: texts.movie_id_missing_warning[this.props.language] })
            return;
        }
        this.props.changeIsChecking(true); //display the loading bar
        fetch_post_json(this.props.serverAddress + "movie_info", { movie_id: movie_id })
            .then(data => {
                if (data.success) {
                    this.setState({
                        isMovieFound: true,
                        movie: data.movie_info,
                        formats: data.formats,
                        warning: ""
                    })
                }
                else {
                    if (data.status === "not_signed_in") {
                        this.props.signUserOut();
                    }
                    else {
                        this.setState({
                            warning: this.setWarningFromStatus(data.status)
                        });
                    }
                }
            })
            .catch(() => {
                this.setState({ warning: texts.cant_connect_to_server_warning[this.props.language] });
            })
            //hide the loading bar
            .finally(() => this.props.changeIsChecking(false))
    }

    /*sends the imdb id and the selected formats to server,
    asks the server to add the request to database */
    addRequest = () => {
        if (this.state.selectedFormats.length === 0) {
            this.setState({ warning: texts.no_formats_selected_warning[this.props.language] });
            return;
        }
        this.props.changeIsChecking(true); //show loading bar
        fetch_post_json(this.props.serverAddress + "add_request", { movie_id: this.state.movie.movie_id, formats: this.state.selectedFormats, season: this.state.season, episode: this.state.episode })
            .then(data => {
                if (data.success) {
                    this.setState({ //if the request is successful, reset the movie information on the page, set the warning to success, so a checkmark will be shown
                        isMovieFound: false,
                        movie: {},
                        selectedFormats: [],
                        warning: "",
                        formats: [],
                        linkInput: "",
                        isSuccessful: true,
                        episode: "-1",
                        season: "-1"
                    })
                    document.getElementsByClassName("link-input")[0].value = ""; //reset the text in the search bar
                }
                else {
                    if (data.status === "not_signed_in") {
                        this.props.signUserOut();
                    }
                    else {
                        this.setState({
                            warning: this.setWarningFromStatus(data.status)
                        })
                    }
                }
                window.scrollTo(0, document.body.scrollHeight); //scroll to the bottom of the page
            })
            .catch(() => {
                this.setState({ warning: texts.cant_connect_to_server_warning[this.props.language] });
            })
            .finally(()=>this.props.changeIsChecking(false));
    }

    //sends the text in the search bar to the server and requests the suggestions from imdb database
    getSuggestions = () => {
        //if there is a search going on, or the input is the same as the last searched text, the function will return before doing anything
        if (this.state.isSearching || this.state.lastSearched === this.state.linkInput) {
            return;
        }
        //if the search bar is empty, dont get suggestions and hide the suggestions box
        if (this.state.linkInput === "") {
            this.setState({ showSuggestions: false, lastSearched: "" });
            return;
        }
        const text = this.state.linkInput; //get the text in the search bar
        this.setState({ isSearching: true }); //declare that there is a search going on
        fetch_post_json(this.props.serverAddress + "get_suggestions", { text: text })
            .then(data => {
                if (data.status === "not_signed_in") {
                    this.props.signUserOut();
                }
                else {
                    this.setState({ isSearching: false, lastSearched: text, showSuggestions: true, suggestions: data.suggestions });
                }
            })
            .catch(() => {
                this.setState({ isSearching: false, lastSearched: text, showSuggestions: true, suggestions: [] });
            })
            .finally(() => this.getSuggestions()) //call the function again in case there is a change in the input, if there is no change, nothing will be done
    }

    //when there is change in the search bar, update the linkInput and call the getSuggestions function
    onLinkInputChange = (event) => {
        this.setState({ linkInput: event.target.value, isSuccessful: false, warning: "" });
        this.getSuggestions();
    }

    //when a paste in the search bar is detected, update the linkInput and call the getSuggestions function
    onLinkPaste = (event) => {
        this.setState({ linkInput: event.clipboardData.getData('Text'), isSuccessful: false, warning: "" });
        this.getSuggestions();
    }

    //when a change in the release type boxes is detected, update the selectedFormats list
    onFormatChange = (vid, category, level) => {
        if (this.state.selectedFormats.indexOf(vid) === -1) {
            //if category number is below zero, select all formats with a higher category number than this
            if (category < 0) {
                this.state.formats.filter(format => category <= format.category)
                    .forEach(format => this.selectFormat(format.vid));
            }
            //if category number is higher than zero, select all formats with this category number and with a higher level number
            else {
                this.state.formats.filter(format => category === format.category && level <= format.level)
                    .forEach(format => this.selectFormat(format.vid));
            }
        }
        else {
            //if category number is below zero, deselect all formats with a lower category number
            if (category < 0) {
                this.state.formats.filter(format => category >= format.category)
                    .forEach(format => this.deselectFormat(format.vid));
            }
            //if category number is higher than zero, deselect all formats with the same category number and with a lower level number or whose category number is below zero
            else {
                this.state.formats.filter(format => (category === format.category && level >= format.level) || format.category < 0)
                    .forEach(format => this.deselectFormat(format.vid));
            }
        }
    }

    //remove format type from the list
    deselectFormat = (vid) => {
        if (this.state.selectedFormats.indexOf(vid) !== -1) {
            this.state.selectedFormats.splice(this.state.selectedFormats.indexOf(vid), 1);
            document.getElementById(vid).checked = false;
        }
    }

    //add the format type to list
    selectFormat = (vid) => {
        if (this.state.selectedFormats.indexOf(vid) === -1) {
            this.state.selectedFormats.push(vid);
            document.getElementById(vid).checked = true;
        }
    }

    onSeasonChange = (event) => {
        this.setState({ season: event.target.value });
    }

    onEpisodeChange = (event) => {
        this.setState({ episode: event.target.value });
    }


    render() {
        return (
            <div>
                <MovieIDForm onLinkPaste={this.onLinkPaste} onSuggestionClick={this.onSuggestionClick} onLinkInputChange={this.onLinkInputChange} getMovieInformation={this.getMovieInformation} language={this.props.language} showSuggestions={this.state.showSuggestions} suggestions={this.state.suggestions} isSearching={this.state.isSearching}></MovieIDForm>
                {
                    this.state.isMovieFound ?
                        <div>
                            <MovieCard movie={this.state.movie} language={this.props.language} />
                            {
                                this.state.movie.type === "TVSeries"
                                    ? <SeasonEpisode language={this.props.language} episode={this.state.episode} season={this.state.season} onSeasonChange={this.onSeasonChange} onEpisodeChange={this.onEpisodeChange} />
                                    : null
                            }
                            <Versions selectFormat={this.selectFormat} deselectFormat={this.deselectFormat} formats={this.state.formats} onFormatChange={this.onFormatChange} language={this.props.language} addRequest={this.addRequest} warningLength={this.state.warning.length} />
                        </div>
                        : null
                }
                {
                    this.state.isSuccessful ?
                        <div className="circle-loader load-complete">
                            <div className="checkmark draw"></div>
                        </div>
                        : null
                }
                {
                    //if warning is empty, dont display anything, otherwise display the warning
                    this.state.warning === "" ? null
                        : <h2 className="statusText">{this.state.warning}</h2>
                }
            </div>
        )
    }
}

export default LoggedIn;