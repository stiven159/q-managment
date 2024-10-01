import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function OwnerArea() {
  const { ownerId } = useParams();
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/owners/${ownerId}`)
      .then(response => response.json())
      .then(data => setOwnerData(data))
      .catch(error => console.error('Error fetching owner data:', error));
  }, [ownerId]);

  if (!ownerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="owner-area">
      <h1>Welcome to your personal area, {ownerData.name}!</h1>
      
      <section className="profile-section">
        <h2>Profile Information</h2>
        <img src={ownerData.avatar} alt={`${ownerData.name}'s avatar`} />
        <p><strong>Name:</strong> {ownerData.name}</p>
        <p><strong>Description:</strong> {ownerData.description}</p>
      </section>

      <section className="business-management">
        <h2>Manage Your Businesses</h2>
        <ul>
          {ownerData.businesses.map(business => (
            <li key={business.id}>{business.name}</li>
          ))}
        </ul>
        <button>Add New Business</button>
      </section>

      <section className="settings">
        <h2>Account Settings</h2>
        <button>Edit Profile</button>
        <button>Change Password</button>
      </section>
    </div>
  );
}

export default OwnerArea;
