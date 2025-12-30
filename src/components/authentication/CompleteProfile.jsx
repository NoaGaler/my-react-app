import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import logo from '../../attachments/logo.png';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const { currentUser, setCurrentUser, setIsNewUser } = useContext(UserContext);
  const navigate = useNavigate();

  // סטייט לניהול כל השדות לפי המבנה המלא של ה-Database
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    suite: '', // הוספת suite
    city: '',
    zipcode: '',
    lat: '', // הוספת lat
    lng: '', // הוספת lng
    companyName: '', // הוספת שם חברה
    catchPhrase: '', // הוספת catchPhrase
    bs: '' // הוספת bs
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בניית האובייקט המעודכן המלא בדיוק לפי הפורמט שביקשת
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        suite: formData.suite, // עדכון suite
        city: formData.city,
        zipcode: formData.zipcode,
        geo: {
          lat: formData.lat, // עדכון lat
          lng: formData.lng  // עדכון lng
        }
      },
      company: {
        name: formData.companyName, // עדכון שם חברה
        catchPhrase: formData.catchPhrase,
        bs: formData.bs
      }
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        
        // כאן מעדכנים שהוא כבר לא משתמש חדש כדי שה-App יאפשר כניסה ל-Home
        setIsNewUser(false); 
        
        alert("Profile updated successfully!");
        navigate('/home');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="authWrapper">
      <div className="topLogoContainer">
        <img src={logo} alt="TalkNet Logo" className="topLogo" />
      </div>

      <div className="authHeader">
        <h1>Final Steps, {currentUser?.username} :)</h1>
        <p>Please fill in your details to complete your registration.</p>
      </div>

      <div className="completeProfileCard">
        <form onSubmit={handleSubmit}>
          
          <section className="formSection">
            <h3>Personal Identity</h3>
            <label>Full Name:</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Leanne Graham" required />
            <label>Email:</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Sincere@april.biz" required />
            <label>Phone:</label>
            <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="1-770-736-8031" />
          </section>

          <section className="formSection">
            <h3>Address Details</h3>
            <div className="inputGroup">
              <div>
                <label>City:</label>
                <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="Gwenborough" />
              </div>
              <div>
                <label>Street:</label>
                <input name="street" type="text" value={formData.street} onChange={handleChange} placeholder="Kulas Light" />
              </div>
            </div>
            <div className="inputGroup">
              <div>
                <label>Suite:</label>
                <input name="suite" type="text" value={formData.suite} onChange={handleChange} placeholder="Apt. 556" />
              </div>
              <div>
                <label>Zipcode:</label>
                <input name="zipcode" type="text" value={formData.zipcode} onChange={handleChange} placeholder="92998-3874" />
              </div>
            </div>
            <div className="inputGroup">
              <div>
                <label>Latitude:</label>
                <input name="lat" type="text" value={formData.lat} onChange={handleChange} placeholder="-37.3159" />
              </div>
              <div>
                <label>Longitude:</label>
                <input name="lng" type="text" value={formData.lng} onChange={handleChange} placeholder="81.1496" />
              </div>
            </div>
          </section>

          <section className="formSection">
            <h3>Company Information</h3>
            <label>Company Name:</label>
            <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} placeholder="Romaguera-Crona" />
            <label>Catch Phrase:</label>
            <input name="catchPhrase" type="text" value={formData.catchPhrase} onChange={handleChange} placeholder="Multi-layered client-server" />
            <label>Business Strategy (BS):</label>
            <input name="bs" type="text" value={formData.bs} onChange={handleChange} placeholder="harness real-time e-markets" />
          </section>

          <button type="submit">Save & Finish</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;





// import React, { useState, useContext } from 'react';
// import { UserContext } from '../../context/UserContext';
// import { useNavigate } from 'react-router-dom';

// const CompleteProfile = () => {
//   const { currentUser, setCurrentUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   // State שמחזיק את כל השדות בצורה שטוחה כדי להקל על ה-Inputs
//   const [formData, setFormData] = useState({
//     name: '', 
//     email: '',
//     phone: '',
//     street: '',
//     suite: '',
//     city: '',
//     zipcode: '',
//     lat: '',
//     lng: '',
//     companyName: '',
//     catchPhrase: '',
//     bs: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // בניית האובייקט הסופי בדיוק לפי הפורמט של ה-Database שלך
//     const updatedFields = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       address: {
//         street: formData.street,
//         suite: formData.suite,
//         city: formData.city,
//         zipcode: formData.zipcode,
//         geo: {
//           lat: formData.lat,
//           lng: formData.lng
//         }
//       },
//       company: {
//         name: formData.companyName,
//         catchPhrase: formData.catchPhrase,
//         bs: formData.bs
//       }
//     };

//     try {
//       const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedFields)
//       });

//       if (response.ok) {
//         const fullUser = await response.json();
//         // מעדכנים את הקונטקסט במידע המלא שהתקבל מהשרת
//         setCurrentUser(fullUser); 
//         localStorage.setItem('currentUser', JSON.stringify(fullUser));
        
//         alert('Profile completed successfully!');
//         // עוברים לעמוד הבית של המשתמש
//         navigate(`/home`);
        
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);//+++++++++++++++++++++++++++++++++++++
//       alert('There was an error saving your details.');
//     }
//   };

//   return (
//     <div className="completeProfileContainer">
//       <h2>Final Steps, {currentUser?.username}</h2>
//       <p>Please fill in your details to complete your registration.</p>
      
//       <form onSubmit={handleSubmit}>
        
//         <section>
//           <h3>Personal Identity</h3>
//           <p>Nickname: {currentUser?.username}</p>
//           <label>Full Name:</label>
//           <input name="name" value={formData.name} onChange={handleChange} required />
          
//           <label>Email:</label>
//           <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          
//           <label>Phone:</label>
//           <input name="phone" value={formData.phone} onChange={handleChange} />
//         </section>

//         <section>
//           <h3>Address Details</h3>
//           <label>Street:</label>
//           <input name="street" placeholder="Kulas Light" value={formData.street} onChange={handleChange} />
          
//           <label>Suite:</label>
//           <input name="suite" placeholder="Apt. 556" value={formData.suite} onChange={handleChange} />
          
//           <label>City:</label>
//           <input name="city" placeholder="Gwenborough" value={formData.city} onChange={handleChange} />
          
//           <label>Zipcode:</label>
//           <input name="zipcode" placeholder="92998-3874" value={formData.zipcode} onChange={handleChange} />
          
//           <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//             <div>
//               <label>Lat:</label>
//               <input name="lat" placeholder="-37.3159" value={formData.lat} onChange={handleChange} />
//             </div>
//             <div>
//               <label>Lng:</label>
//               <input name="lng" placeholder="81.1496" value={formData.lng} onChange={handleChange} />
//             </div>
//           </div>
//         </section>

//         <section>
//           <h3>Company Information</h3>
//           <label>Company Name:</label>
//           <input name="companyName" placeholder="Romaguera-Crona" value={formData.companyName} onChange={handleChange} />
          
//           <label>Catch Phrase:</label>
//           <input name="catchPhrase" placeholder="Multi-layered client-server" value={formData.catchPhrase} onChange={handleChange} />
          
//           <label>Business Strategy (BS):</label>
//           <input name="bs" placeholder="harness real-time e-markets" value={formData.bs} onChange={handleChange} />
//         </section>

//         <button type="submit">
//           Save & Finish
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CompleteProfile;