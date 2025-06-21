import { use, useState } from "react";
import "./index.css";
import Header from "./header"
import Prompt from "./prompt"
import Options from "./options"

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
            <Header/>
            <Prompt/>
            <Options/>

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
