import { useState, useEffect, useCallback } from "react";
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
    const [inputValue, setInputValue] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Reusable function to convert base64 to blob URL
    const convertBase64ToImageUrl = (base64Data) => {
        try {
            // Check if the data is already a data URL
            if (base64Data.startsWith('data:image/')) {
                return base64Data;
            } else {
                // Assume it's base64 encoded data
                const binaryString = atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const imageBlob = new Blob([bytes], { type: 'image/png' });
                return URL.createObjectURL(imageBlob);
            }
        } catch (error) {
            console.error('Error processing image data:', error);
            // Fallback: try to use the data as-is
            return base64Data;
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(async (searchTerm) => {
        if (!searchTerm.trim() || activeMode == "generate") return;
        
        try {
            const token = await getToken();
            if (!token) {
                console.error('Authentication token not available');
                return;
            }

            const formData = new FormData();
            formData.append("query", searchTerm);

            const response = await fetch("http://localhost:8000/api/search", {
                method: "POST",
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                console.error('Search request failed');
                return;
            }

            const searchResults = await response.json();
            console.log("Search results:", searchResults);
            
            // Process search results and convert images
            if (Array.isArray(searchResults)) {
                const processedResults = searchResults.map(result => {
                    // result is an object like { image_base64: "...", product_type: "..." }
                    try {
                        if (!result.image_base64) {
                            console.error("Search result item missing image_base64:", result);
                            return null;
                        }
                        return {
                            image: convertBase64ToImageUrl(result.image_base64),
                            category: result.product_type || 'Search Result',
                            id: result.image_id || `search-${Date.now()}-${Math.random()}`
                        };
                    } catch (e) {
                        console.error('Error parsing search result object:', result, e);
                        return null;
                    }
                }).filter(Boolean); // Remove null results
                
                console.log("Processed search results:", processedResults);
                
                // Clear uploaded clothes and display search results
                setUploadedClothes([]);
                setSearchResults(processedResults);
            } else {
                console.error("Search results is not an array:", searchResults);
            }
            
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }, [getToken, activeMode]);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Effect to trigger search when debounced value changes
    useEffect(() => {
        if (debouncedValue) {
            debouncedSearch(debouncedValue);
        }
    }, [debouncedValue, debouncedSearch]);

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

            // Update the uploadedClothes state with the fetched inventory
            if (inventoryData) {
                const processedInventory = inventoryData.map(record => {
                    return {
                        image: convertBase64ToImageUrl(record.image_base64),
                        category: record.product_type || record.category,
                        id: record.id || record.image_id
                    };
                });

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

    // Handler for input field changes
    const handleInputChange = (value) => {
        setInputValue(value);
        console.log("Input value changed:", value);
        
        // Clear search results when input is cleared
        if (!value.trim()) {
            setSearchResults([]);
            // Reload inventory when search is cleared
            if (isSignedIn && isLoaded) {
                fetchUserInventory();
            }
        }
    };

    return (
        <>
            <Header />
            <Prompt 
                activeMode={activeMode} 
                inputValue={inputValue}
                onInputChange={handleInputChange}
            />
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
            {searchResults.length > 0 && (
                <div className="clothes-grid">
                    <h3>Search Results:</h3>
                    {searchResults.map((item, idx) => (
                        <div key={idx} className="div-card">
                            <Card
                                key={idx}
                                imageSrc={item.image}
                                category={item.category}
                            />
                        </div>
                    ))}
                </div>
            )}
            {/*<Logo className="main-logo" />*/}
        </>
    );
}

export default App;
