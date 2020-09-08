import React from 'react';
import texts from "../texts";

class MovieIDForm extends React.Component {
    render() {
        return (
            <div className="center-box">
                <div className="linkform-container">
                    <div className="linkform-upper">
                        <input type="text" className="link-input" onChange={this.props.onLinkInputChange} onPaste={this.props.onLinkPaste}></input>
                        <button className="send-link f6 link dim ph3 pv2 dib dark-blue b bg-white" onClick={() => { this.props.getMovieInformation(false) }}>{texts.detect_text[this.props.language]}</button>
                    </div>
                    {this.props.showSuggestions ? <table className="suggestions-box">
                        <tbody>
                            {
                                this.props.suggestions.map((suggestion => {
                                    return (
                                        <tr key={suggestion.id} className="suggestion" onClick={() => { this.props.onSuggestionClick(suggestion.id) }}>
                                            <td className="suggestion-td">{suggestion.name + " (" + (suggestion.year ? suggestion.year : texts.year_unknown[this.props.language]) + ")"}</td>
                                        </tr>
                                    )
                                }))
                            }
                        </tbody>
                    </table> : null}
                </div>
            </div>
        );
    }
}


export default MovieIDForm;