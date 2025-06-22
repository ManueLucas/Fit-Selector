// src/ProtectedContent.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Only need useAuth here

function ProtectedContent() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProtectedData = async () => {
    if (!isSignedIn || !isLoaded) {
      console.log("Clerk not loaded or user not signed in. Cannot fetch data.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Get the JWT from Clerk.
      // This token will be passed to your FastAPI backend for validation.
      const token = await getToken();

      if (!token) {
        setError("Authentication token not available. Please ensure you are signed in.");
        setLoading(false);
        return;
      }

      console.log("Attempting to fetch protected data with token...");
      // const inputFile = document.getElementById("input-file");
      // if (!inputFile || !inputFile.files || inputFile.files.length === 0) {
      //   setError("No file selected. Please choose a file to upload.");
      //   setLoading(false);
      //   return;
      // }

      // testing search
      const search_body = new FormData();
      search_body.append("query", "give me sunglasses")
      const searchtest = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`, // <-- Pass the JWT as a Bearer token
        },
        body: search_body
      });

      const searchResponse = await searchtest.json();
      console.log("Search response:", searchResponse);

      if (searchResponse.image_base64) {
        const imageElement = document.createElement("img");
        imageElement.src = `data:image/png;base64,${searchResponse.image_base64}`;
        imageElement.alt = "Search Result";
        document.body.appendChild(imageElement); // Append the image to the body or a specific container
      }
      
      const inputFile = document.getElementById("input-file");
      if (!inputFile || !inputFile.files || inputFile.files.length === 0) {
        setError("No file selected. Please choose a file to upload.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", inputFile.files[0]);
      formData.append("product_type", "Bottom");


      const response = await fetch("http://localhost:8000/api/add_image", {
        method: "POST",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`, // <-- Pass the JWT as a Bearer token
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, Detail: ${errorData.detail || "Unknown error"}`
        );
      }

      const data = await response.json();
      setBackendData(data);
    } catch (err) {
      console.error("Error fetching protected data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch data when component mounts and user is signed in
    if (isSignedIn && isLoaded) {
      fetchProtectedData();
    }
  }, [isLoaded, isSignedIn]); // Dependency array: re-run if Clerk status changes

  if (!isLoaded || loading) {
    return <div>Loading protected content...</div>;
  }

  // isSignedIn is implicitly true here because ProtectedContent is inside <SignedIn> in App.jsx
  // but keeping this check here adds robustness if it were used elsewhere.

  return (
    <div className="protected-content">
      <h3>Data from FastAPI Backend:</h3>
      <button onClick={fetchProtectedData} disabled={loading}>
        {loading ? 'Fetching...' : 'Refresh Data'}
      </button>

      {error && <p className="error-message">Error: {error}</p>}

      {backendData ? (
        <pre>{JSON.stringify(backendData, null, 2)}</pre>
      ) : (
        <p>No data loaded yet. Click 'Refresh Data' or ensure you are signed in.</p>
      )}
    </div>
  );
}

export default ProtectedContent;