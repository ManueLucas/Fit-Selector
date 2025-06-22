import { useState } from "react";
import "./index.css";
import Header from "./header";
import Prompt from "./prompt";
import Logo from "./logo";
import Options from "./options";
import Card from "./card";

function App() {
    const [fileName, setFileName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [category, setCategory] = useState("");
    const [inputtedImage, setInputtedImage] = useState("");
    const [uploadedClothes, setUploadedClothes] = useState([]);

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

        setUploadedClothes((prev) => [
            ...prev,
            {
                image: inputtedImage,
                category: type,
            },
        ]);
    };

    return (
        <>
            <Header />
            <Prompt />
            <Options
                handleFileChange={handleFileChange}
                showPopup={showPopup}
                inputtedImage={inputtedImage}
                handleCategorySelect={handleCategorySelect}
            />
            {uploadedClothes.length > 0 && (
                <div className="clothes-grid">
                    {uploadedClothes.map((item, idx) => (
                      <>
                        <div class="div-card">
                          <Card
                              key={idx}
                              imageSrc={item.image}
                              category={item.category}
                          />
                          <button class="delete">Delete</button>
                        </div>
                        </>
                    ))}
                </div>
            )}
            <Logo className="main-logo" />
        </>
    );
}

export default App;
