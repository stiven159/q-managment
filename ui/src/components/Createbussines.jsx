import React, { useState } from 'react';
import "../Css.Style.css";

function CreateBusiness({ ownerId }) {
  const [business, setBusiness] = useState({
    name: '',
    avatar: '',
    objectType: 'owner',
    description: ''
  });
  const [isBusinessCreated, setIsBusinessCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusiness((prevBusiness) => ({
          ...prevBusiness,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setBusiness({ ...business, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...business, ownerId })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Business added:', data);
        setBusiness({ name: '', avatar: '', description: '', objectType: 'owner' });
        setIsBusinessCreated(true); // Set the flag to true after successful creation
      })
      .catch(error => console.error('Error adding business:', error));
  };

  return (
    <div className="signup-container">
      <h1>Business Sign-Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={business.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Avatar:
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={business.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {isBusinessCreated && (
        <button onClick={() => window.location.href = `/owner-area/${ownerId}`}>
          Go to Personal Area
        </button>
      )}
    </div>
  );
}

export default CreateBusiness;
