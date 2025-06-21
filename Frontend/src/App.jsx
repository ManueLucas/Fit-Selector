import { use, useState } from "react";
import "./index.css";

import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";

import ProtectedContent from "./ProtectedContent";

function App() {
    const [fileName, setFileName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
  const [category, setCategory] = useState("");
  const [inputtedImage, setInputtedImage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setInputtedImage(URL.createObjectURL(file));
      setShowPopup(true); // trigger popup on file select
    }
    };

      const handleCategorySelect = (type) => {
    setCategory(type);
    setShowPopup(false);
    // optionally: do something with the category (save to state/backend)
    console.log("User selected:", type);
  };

    return (
        <>
            <header>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                    <ProtectedContent />
                </SignedIn>
            </header>
            <h1 id="h1-name">Fit Selector</h1>
            <h2 id="h2-slogan">your fit. your way.</h2>

            <h1 id="h1-question">
                What kind of fit do you want to wear today?
            </h1>
            <div id="div-input">
                <input
                    type="text"
                    placeholder="e.g. I want to look like Chris Hemsworth!"
                    name=""
                    id="input-fit"
                />
            </div>
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

                {/* Display filename */}
                {fileName && (
                    <span className="file-name-display">{fileName}</span>
                )}

                {/* Buttons */}
                <button className="option" id="button-reset">
                    Reset Preferences
                </button>
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
                            <button onClick={() => handleCategorySelect("Shirt")}>Shirt</button>
                            
                            <button onClick={() => handleCategorySelect("Trouser")}>Trouser</button>
                            <button onClick={() => handleCategorySelect("Jacket")}>Jacket</button>
                            <button onClick={() => handleCategorySelect("Accessory")}>Accessory</button>
                        </div>
                        {
                          inputtedImage && (
                            <img src={inputtedImage} alt="Uploaded Image Preview" className="popup-preview-image"/>
                          )
                        }
                        
                    </div>
                </div>
            )}
        </>
    );
}

export default App;

// <Header />

// <main>
//   <Options />
// </main>
