import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import "./index.css";
import Header from "./header";
import Prompt from "./prompt";
// import Logo from "./logo";
import Options from "./options";
import Card from "./card";

function App() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [fileName, setFileName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [category, setCategory] = useState("");
    const [inputtedImage, setInputtedImage] = useState("");
    const [uploadedClothes, setUploadedClothes] = useState([]);
    const [pendingFile, setPendingFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setInputtedImage(URL.createObjectURL(file));
            setPendingFile(file);
            setShowPopup(true);
        }
    };

    const handleDelete = (indexToDelete) => {
        setUploadedClothes((prev) =>
            prev.filter((_, idx) => idx !== indexToDelete)
        );
    };

    const handleCategorySelect = async (type) => {
        setCategory(type);
        setShowPopup(false);

        // Send the API request with the selected category
        if (pendingFile) {
            const formData = new FormData();
            formData.append("file", pendingFile);
            formData.append("product_type", type);

            try {
                // Get the JWT token from Clerk
                const token = await getToken();
                
                if (!token) {
                    console.error('Authentication token not available');
                    return;
                }

                const response = await fetch("http://localhost:8000/api/add_image", {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        Authorization: `Bearer ${token}`, // <-- Pass the JWT as a Bearer token
                    },
                    body: formData
                });
                
                // Handle response if needed
                if (!response.ok) {
                    console.error('Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
            
            setPendingFile(null); // Clear the pending file
        }

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
                            <div key={idx} className="div-card">
                                <Card
                                    key={idx}
                                    imageSrc={item.image}
                                    category={item.category}
                                />
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(idx)}
                                >
                                    Delete
                                </button>
                            </div>
                    ))}
                </div>
            )}
            {/*<Logo className="main-logo" />*/}
        </>
    );
}

export default App;
