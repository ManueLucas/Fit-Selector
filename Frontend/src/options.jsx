
import { useState } from "react";

export default function Uploader() {
    const [fileName, setFileName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [category, setCategory] = useState("");
    const [inputtedImage, setInputtedImage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setInputtedImage(URL.createObjectURL(file));
            setShowPopup(true);
        }
    };

    const handleCategorySelect = (type) => {
        setCategory(type);
        setShowPopup(false);
        console.log("User selected:", type);
    };

    return (
        <>
            <div id="div-all-inputs">
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

                <button className="option" id="button-generate">
                    Generate Fit
                </button>
                <button className="option" id="button-random">
                    I'm Feeling Adventurous
                </button>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Is this clothe image a:</p>
                        <div className="popup-buttons">
                            <button
                                onClick={() => handleCategorySelect("Shirt")}
                            >
                                Shirt
                            </button>
                            <button
                                onClick={() => handleCategorySelect("Trouser")}
                            >
                                Trouser
                            </button>
                            <button
                                onClick={() => handleCategorySelect("Jacket")}
                            >
                                Jacket
                            </button>
                            <button
                                onClick={() =>
                                    handleCategorySelect("Accessory")
                                }
                            >
                                Accessory
                            </button>
                        </div>
                        {inputtedImage && (
                            <img
                                src={inputtedImage}
                                alt="Uploaded Image Preview"
                                className="popup-preview-image"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
