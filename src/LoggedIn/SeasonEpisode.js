import React from "react";
import texts from "../texts";

const SeasonEpisode = (props) => {
    const seasonOptions = [<option value="-1" key="-1">-</option>];
    const episodeOptions = [<option value="-1" key="-1">-</option>]
    for (let i = 0; i < 100; i++) {
        seasonOptions.push(<option value={i} key={i}>{i}</option>)
        episodeOptions.push(<option value={i} key={i}>{i}</option>)
    }
    
    return (
        <div className="outer">
            <div className="season-episode-container">
                <div className="season-episode-field">
                    <div className="season-episode-text">{texts.season_option[props.language]}</div>
                    <select name="season" id="season" onChange={props.onSeasonChange}>
                        {seasonOptions}
                    </select>
                </div>
                <div className="season-episode-field">
                    <div className="season-episode-text">{texts.episode_option[props.language]}</div>
                    <select name="episode" id="episode" disabled={props.season === "-1"} onChange={props.onEpisodeChange}>
                        {episodeOptions}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SeasonEpisode;