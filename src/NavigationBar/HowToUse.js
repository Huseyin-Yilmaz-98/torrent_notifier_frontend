import React from "react";
import texts from "../texts";


const HowToUse = (props) => {
    return (
        <div className="modal" onClick={(event) => {
            //if user clicks somewhere outside the modal-container, close it
            if (event.target.className === "modal") {
                props.onCloseHowToUseClick();
            }
        }}>
            <div className="modal-container">
                <div className="modal-header">
                    <span className="close" onClick={props.onCloseHowToUseClick}>&times;</span>
                    <h2 className="modal-header-text">{texts.how_to_use_header_text[props.language]}</h2>
                </div>
                <div className="how-to-use-content">{
                    texts.how_to_use_content_text[props.language].split('\n').map((line, index) => <p key={index}>{line}</p>)
                }</div>
            </div>
        </div>
    )
}

export default HowToUse;