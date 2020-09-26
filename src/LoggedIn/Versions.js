import React from "react";
import texts from "../texts";

const Versions = (props) => {
    const { formats, onFormatChange, selectFormat, deselectFormat, language, warningLength, addRequest } = props;

    const selectAll = () => { //function to select all release formats
        formats.forEach(format => selectFormat(format.vid))
    }

    const deselectAll = () => { //function to deselect all release formats
        formats.forEach(format => deselectFormat(format.vid))
    }

    return (
        <div className="outer">
            <h1>{texts.releases_text[language]}</h1>
            <div className="releases-container-outer br3 ba dark-gray b--black-16">
                <div className="releases-container">
                    {formats.map(format => {
                        return (
                            <div className="release" key={format.vid}>
                                <input type="checkbox" className="release-box" id={format.vid} onChange={() => onFormatChange(format.vid, format.category, format.level)} />
                                {"\u00a0"} {language === "en" ? format.name_en : format.name_tr}
                            </div>
                        )
                    })}
                    {[1, 2, 3, 4].map(i => <div className="release empty" key={i} />) /*added 4 empty divs so that the items in the last row wont go out of line*/}
                </div>
            </div>
            <div className="formats-additional-container">
                <p className="select-all" onClick={selectAll}>{texts.select_all_text[language]}</p>
                <p className="select-all deselect" onClick={deselectAll}>{texts.deselect_all_text[language]}</p>
            </div>

            <button className={"send-formats f6 link dim ph3 pv2 dib dark-blue b bg-white" + (warningLength ? "" : " withMargin")} onClick={addRequest}>{texts.send_text[language]}</button>
        </div>
    )
}

export default Versions;