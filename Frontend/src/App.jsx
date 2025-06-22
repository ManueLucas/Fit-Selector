import { useState, useEffect } from "react";
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
    const [activeMode, setActiveMode] = useState("search");
    const [loading, setLoading] = useState(false);

    // Fetch user's inventory on component load
    const fetchUserInventory = async () => {
        if (!isSignedIn || !isLoaded) {
            console.log("Clerk not loaded or user not signed in. Cannot fetch inventory.");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();

            if (!token) {
                console.error('Authentication token not available');
                return;
            }

            const response = await fetch("http://localhost:8000/api/get_inventory", {
                method: "GET",
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch inventory');
                return;
            }

            const inventoryData = await response.json();
            console.log("User inventory:", inventoryData);

            // Update the uploadedClothes state with the fetched inventory
            // You might need to adjust this based on your backend response structure
            if (inventoryData) {
                const processedInventory = inventoryData.map(record => {
                    let imageUrl;

                    // Debug: log the first part of the image data to see its format
                    console.log('Image data type:', typeof record.image_base64);
                    console.log('Image data preview:', record.image_base64.substring(0, 50) + '...');
                    console.log('Image data length:', record.image_base64.length);

                    try {
                        // Check if the data is already a data URL
                        if (record.image_base64.startsWith('data:image/')) {
                            imageUrl = record.image_base64;
                        } else {
                            // Assume it's base64 encoded data
                            const binaryString = atob(record.image_base64);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }

                            const imageBlob = new Blob([bytes], { type: 'image/png' });
                            imageUrl = URL.createObjectURL(imageBlob);
                        }
                    } catch (error) {
                        console.error('Error processing image for record:', record, error);
                        // Fallback: try to use the data as-is
                        imageUrl = record.image_base64;
                    }

                    return {
                        image: imageUrl,
                        category: record.product_type || record.category,
                        id: record.id // if your backend provides an id
                    };
                });

                console.log('Processed inventory items:', processedInventory.length);
                console.log('First processed item:', processedInventory[0]);

                setUploadedClothes(processedInventory);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load inventory when component mounts and user is signed in
    useEffect(() => {
        if (isSignedIn && isLoaded) {
            fetchUserInventory();
        }
    }, [isLoaded, isSignedIn]);

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

    const handleModeChange = (mode) => {
        setActiveMode(mode);
        console.log("Mode changed to:", mode);
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

        setUploadedClothes((prev) => {
            return [
                ...prev,
                {
                    image: inputtedImage,
                    category: type,
                },
            ]
        });
    };

    return (
        <>
            <Header />
            <Prompt activeMode={activeMode} />
            <Options
                handleFileChange={handleFileChange}
                showPopup={showPopup}
                inputtedImage={inputtedImage}
                handleCategorySelect={handleCategorySelect}
                activeMode={activeMode}
                onModeChange={handleModeChange}
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
