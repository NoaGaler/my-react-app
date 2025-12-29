import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  // State שמחזיק את כל השדות בצורה שטוחה כדי להקל על ה-Inputs
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone: '',
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    lat: '',
    lng: '',
    companyName: '',
    catchPhrase: '',
    bs: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בניית האובייקט הסופי בדיוק לפי הפורמט של ה-Database שלך
    const updatedFields = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        suite: formData.suite,
        city: formData.city,
        zipcode: formData.zipcode,
        geo: {
          lat: formData.lat,
          lng: formData.lng
        }
      },
      company: {
        name: formData.companyName,
        catchPhrase: formData.catchPhrase,
        bs: formData.bs
      }
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });

      if (response.ok) {
        const fullUser = await response.json();
        // מעדכנים את הקונטקסט במידע המלא שהתקבל מהשרת
        setCurrentUser(fullUser); 
        localStorage.setItem('currentUser', JSON.stringify(fullUser));
        
        alert('Profile completed successfully!');
        // עוברים לעמוד הבית של המשתמש
        navigate(`/users/${fullUser.id}/home`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);//+++++++++++++++++++++++++++++++++++++
      alert('There was an error saving your details.');
    }
  };

  return (
    <div className="completeProfileContainer">
      <h2>Final Steps, {currentUser?.username}</h2>
      <p>Please fill in your details to complete your registration.</p>
      
      <form onSubmit={handleSubmit}>
        
        <section>
          <h3>Personal Identity</h3>
          <p>Nickname: {currentUser?.username}</p>
          <label>Full Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
          
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          
          <label>Phone:</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </section>

        <section>
          <h3>Address Details</h3>
          <label>Street:</label>
          <input name="street" placeholder="Kulas Light" value={formData.street} onChange={handleChange} />
          
          <label>Suite:</label>
          <input name="suite" placeholder="Apt. 556" value={formData.suite} onChange={handleChange} />
          
          <label>City:</label>
          <input name="city" placeholder="Gwenborough" value={formData.city} onChange={handleChange} />
          
          <label>Zipcode:</label>
          <input name="zipcode" placeholder="92998-3874" value={formData.zipcode} onChange={handleChange} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <div>
              <label>Lat:</label>
              <input name="lat" placeholder="-37.3159" value={formData.lat} onChange={handleChange} />
            </div>
            <div>
              <label>Lng:</label>
              <input name="lng" placeholder="81.1496" value={formData.lng} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section>
          <h3>Company Information</h3>
          <label>Company Name:</label>
          <input name="companyName" placeholder="Romaguera-Crona" value={formData.companyName} onChange={handleChange} />
          
          <label>Catch Phrase:</label>
          <input name="catchPhrase" placeholder="Multi-layered client-server" value={formData.catchPhrase} onChange={handleChange} />
          
          <label>Business Strategy (BS):</label>
          <input name="bs" placeholder="harness real-time e-markets" value={formData.bs} onChange={handleChange} />
        </section>

        <button type="submit">
          Save & Finish
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;