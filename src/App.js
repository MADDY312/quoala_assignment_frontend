// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ImageUploader from './Components/sender';

// export default function App() {
//   return (

//     // <div>bhai please yaar</div>
//     <Router>
//       <Routes>
//         <Route path="/products" element={<ImageUploader />} />
//       </Routes>
//     </Router>
//   );
// }
import './App.css';
import React, { useState, useEffect } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Make an API call to retrieve the list of previously uploaded data
    fetch('https://litescanpy.pythonanywhere.com/alluser')
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the retrieved data
        setUserDataList(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array to ensure the effect runs only once on component mount

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (image) {
      // Send the image to the Flask backend
      fetch('https://litescanpy.pythonanywhere.com/get_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: image.toString('base64') }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the backend
          console.log(data);
          // Update the list of uploaded data after successful upload
          setUploadedImages([...uploadedImages, data]);
          // Set the API response to be displayed on the screen
          setApiResponse(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Send the search query to the Flask backend
    fetch('https://litescanpy.pythonanywhere.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchQuery }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log(data);
        // Update the search results
        // setSearchResults(data);
        setSearchResults(Array.isArray(data) ? data : [data]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    
    <div className="container">
       <h1 className="heading">Thai ID Card OCR</h1>
      <p className="attribution">Made by Vasu Gupta (20UCC114) for Qoala Assignment</p>

      <div>
      <input
          type="file"
          onChange={handleImageChange}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <button onClick={handleUpload} className="upload-button">
          Upload Image
        </button>
      </div>
      <div>
        <h2>API Response</h2>
        {apiResponse && (
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        )}
      </div>
      <div>
        <h2>Search</h2>
        <div>
        <input
            type="text"
            placeholder="Enter first name or last name or identification number"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%', // Set the width to 100%
              padding: '15px', // Increase padding for a larger input field
              fontSize: '16px', // Adjust font size
              boxSizing: 'border-box', // Include padding and border in the total width
            }}
/>
          <button onClick={handleSearch} style={{ padding: '10px', cursor: 'pointer' }}>
            Search
          </button>
        </div>
        {/* Display search results */}

        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="search-result">
              <div>
                <strong>ID:</strong> {result.id}
              </div>
              <div>
                <strong>Name:</strong> {result.first_name} {result.last_name}
              </div>
              <div>
                <strong>Date of Birth:</strong> {result.date_of_birth}
              </div>
              <div>
                <strong>Date of Expiry:</strong> {result.date_of_expiry}
              </div>
              <div>
                <strong>Date of Issue:</strong> {result.date_of_issue}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No user found with the given search query.</p>
          </div>
        )}
     
      </div>



      <div>
        <h2>Previously Uploaded Data</h2>
        {userDataList.length > 0 && (
  <div className="uploaded-data">
        {userDataList.map((userData) => (
          <div key={userData.id} className="user-data">
            <div>
              <strong>ID:</strong> {userData.id}
            </div>
            <div>
              <strong>Name:</strong> {userData.first_name} {userData.last_name}
            </div>
            <div>
              <strong>Date of Birth:</strong> {userData.date_of_birth}
            </div>
            <div>
              <strong>Date of Expiry:</strong> {userData.date_of_expiry}
            </div>
            <div>
              <strong>Date of Issue:</strong> {userData.date_of_issue}
            </div>
          </div>
        ))}
      </div>
      )}

      
    </div>
          <div>Not for commercial use</div>
   
    </div>
  );
};

export default ImageUploader;

