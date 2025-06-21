import { use, useState } from "react";
import "./index.css";
import Header from "./header";
import Prompt from "./prompt";
import Logo from "./logo";
import Options from "./options";

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
            <Header />
            <Prompt />
            <Options></Options>
            <Logo className="main-logo" />
        </>
    );
}

export default App;
