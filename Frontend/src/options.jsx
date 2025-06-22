export default function Options({
    handleFileChange,
    showPopup,
    inputtedImage,
    handleCategorySelect,
}) {
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
                            <button
                                onClick={() => handleCategorySelect("Shoes")}
                            >
                                Shoes
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
