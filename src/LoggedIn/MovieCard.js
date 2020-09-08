import React from "react";
import texts from "../texts";
import no_poster_en from "./no-poster-en.png";
import no_poster_tr from "./no-poster-tr.png";

const MovieCard = (props) => {
    const { name, sum, rating, poster, type } = props.movie;
    const year = props.movie.year !== "0000" ? " (" + props.movie.year + ")" : ""; //if year is 0000, that means there was no date information on imdb, so it wont be displayed
    return (
        <div className="outer">
            <div className="movie-container br3 ba white b--black-16 center">
                <div className="movie-img-container">
                    <img className="movie-img" alt="" src={poster !== "-" ? poster : props.language === "tr" ? no_poster_tr : no_poster_en}></img>
                </div>
                <div className="movie-info">
                    <div className="movie-info-inner">
                        <li><b>{texts.movie_name_text[props.language]}</b> {name + year}</li>
                        <li><b>{texts.movie_rating_text[props.language]}</b> {rating + " / 10"}</li>
                        <li><b>{texts.movie_type_text[props.language]}</b> {type}</li>
                        <li><b>{texts.movie_summary_text[props.language]}</b> {sum}</li>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;