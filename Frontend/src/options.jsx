
import handleFileChange from "./App"

export default function() {
    return(
                    <div id="div-all-inputs">
                {/* Custom File Upload */}
                <label
                    htmlFor="input-file"
                    className="custom-file-label option"
                >
                    Add Image
                </label>
                <input
                    type="file"
                    id="input-file"
                    className="hidden-file-input"
                    onChange={handleFileChange}
                />

                {/* Display filename
                {fileName && (
                    <span className="file-name-display">{fileName}</span>
                )} */}

                {/* Buttons */}
                <button className="option" id="button-generate">
                    Generate Fit
                </button>
                <button className="option" id="button-random">
                    I'm Feeling Adventurous
                </button>
            </div>
    )
}