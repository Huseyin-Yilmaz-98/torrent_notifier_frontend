import React, { useState } from "react";
import texts from "../texts";
import icon from "./delete.png";

const MyRequests = (props) => {
    const [selected, setSelected] = useState([null, null, null]);
    const getNumberString = (number) => {
        return number >= 10 ? "" + number : "0" + number
    }

    const editName = (name, season, episode) => {
        if (season === -1) {
            return name;
        }
        else if (episode === -1) {
            return "(S" + getNumberString(season) + ") " + name;
        }
        else {
            return "(S" + getNumberString(season) + "E" + getNumberString(episode) + ") " + name;
        }
    }

    return (
        <div className="modal" onClick={(event) => {
            //if user clicks somewhere outside the modal-container, close it
            if (event.target.className === "modal") {
                props.onCloseMyRequestsClick();
            }
        }}>
            <div className="modal-container">
                <div className="modal-header">
                    <span className="close" onClick={props.onCloseMyRequestsClick}>&times;</span>
                    <h2 className="modal-header-text">{texts.my_requests_text[props.language]}</h2>
                </div>
                <table className="my-requests-content">
                    <tbody className="requests-table">
                        {
                            //add each request as a seperate row
                            props.requestList.map(request => {
                                const name = editName(request.name, request.season, request.episode)
                                return (
                                    <tr key={request.tid} className="request-tr">
                                        <td className="movie-name-row">
                                            <div className="movie-name" onClick={() => setSelected([request.tid, request.season, request.episode])}>{name}</div>
                                            <img src={icon} className="delete-request" alt="delete-request" onClick={() => props.onRequestDelete(request.tid, name, request.season, request.episode)} />
                                        </td>
                                        {
                                            //if the row is selected, display the requested release formats
                                            selected.toString() === [request.tid, request.season, request.episode].toString() ? <td className="releases-row">{props.language === "tr" ? request.versions_tr : request.versions_en}</td> : null
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyRequests;