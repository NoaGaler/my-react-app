import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import './UserInfo.css';

const UserInfo = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // פונקציה לבדיקת קיום המשתמש וטעינתו במידת הצורך
    const loadUserData = () => {
      // אם אין משתמש ב-Context (קורה אחרי רענון דף), ננסה לשלוף מה-LocalStorage
      if (!currentUser) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setCurrentUser(parsedUser);
          } catch (error) {
            console.error("Error parsing user from localStorage:", error);
          }
        }
      }
      
      // יצירת השהייה קלה למראה מקצועי של טעינה
      const timer = setTimeout(() => {
        setLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    };

    loadUserData();
  }, [currentUser, setCurrentUser]);

  // הצגת מסך טעינה עם הספינר שעיצבנו ב-CSS
  if (loading) {
    return (
      <div className="infoWrapper">
        <div className="loadingSpinner">
          <div className="spinner"></div>
          <p>Retrieving your profile...</p>
        </div>
      </div>
    );
  }

  // במקרה שאין משתמש מחובר בכלל
  if (!currentUser) {
    return (
      <div className="infoWrapper">
        <div className="infoCard">
          <h2>Access Denied</h2>
          <p>Please log in to view your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="infoWrapper">
      <div className="infoCard">
        {/* כותרת הפרופיל עם האייקון */}
        <div className="infoHeader">
          <div className="userAvatar">👤</div>
          <h2>User Profile</h2>
          <p>Full account details for <strong>{currentUser.username}</strong></p>
        </div>

        {/* חלק 1: פרטים אישיים */}
        <section className="infoSection">
          <h3>Personal Identity</h3>
          <div className="infoGrid">
            <div className="infoItem">
              <label>Full Name</label>
              <span>{currentUser.name || 'Not provided'}</span>
            </div>
            <div className="infoItem">
              <label>Email Address</label>
              <span>{currentUser.email}</span>
            </div>
            <div className="infoItem">
              <label>Phone Number</label>
              <span>{currentUser.phone || 'Not provided'}</span>
            </div>
          </div>
        </section>

        {/* חלק 2: כתובת ומיקום */}
        <section className="infoSection">
          <h3>Address & Location</h3>
          <div className="infoGrid">
            <div className="infoItem">
              <label>City</label>
              <span>{currentUser.address?.city || 'Not provided'}</span>
            </div>
            <div className="infoItem">
              <label>Street & Suite</label>
              <span>
                {currentUser.address?.street}
                {currentUser.address?.suite ? `, ${currentUser.address.suite}` : ''}
              </span>
            </div>
            <div className="infoItem">
              <label>Zipcode</label>
              <span>{currentUser.address?.zipcode || 'Not provided'}</span>
            </div>
            <div className="infoItem">
              <label>Geo Location</label>
              <span>
                {currentUser.address?.geo?.lat && currentUser.address?.geo?.lng 
                  ? `Lat: ${currentUser.address.geo.lat} | Lng: ${currentUser.address.geo.lng}`
                  : 'Not provided'}
              </span>
            </div>
          </div>
        </section>

        {/* חלק 3: מידע עסקי */}
        <section className="infoSection">
          <h3>Company Information</h3>
          <div className="infoGrid">
            <div className="infoItem">
              <label>Company Name</label>
              <span>{currentUser.company?.name || 'Not provided'}</span>
            </div>
            <div className="infoItem">
              <label>Catch Phrase</label>
              <span>{currentUser.company?.catchPhrase || 'Not provided'}</span>
            </div>
            <div className="infoItem">
              <label>Business Strategy (BS)</label>
              <span>{currentUser.company?.bs || 'Not provided'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserInfo;






// import React, { useContext } from 'react';
// import { UserContext } from '../../context/UserContext';
// import './UserInfo.css';

// const UserInfo = () => {
//   const { currentUser } = useContext(UserContext);

//   if (!currentUser) return <div className="loading">Loading user data...</div>;

//   return (
//     <div className="infoWrapper">
//       <div className="infoCard">
//         <div className="infoHeader">
//           <div className="userAvatar">👤</div>
//           <h2>User Profile</h2>
//           <p>Full account details for <strong>{currentUser.username}</strong></p>
//         </div>

//         {/* פרטים אישיים */}
//         <section className="infoSection">
//           <h3>Personal Identity</h3>
//           <div className="infoGrid">
//             <div className="infoItem">
//               <label>Full Name</label>
//               <span>{currentUser.name || 'Not provided'}</span>
//             </div>
//             <div className="infoItem">
//               <label>Email Address</label>
//               <span>{currentUser.email}</span>
//             </div>
//             <div className="infoItem">
//               <label>Phone Number</label>
//               <span>{currentUser.phone || 'Not provided'}</span>
//             </div>
//           </div>
//         </section>

//         {/* כתובת */}
//         <section className="infoSection">
//           <h3>Address & Location</h3>
//           <div className="infoGrid">
//             <div className="infoItem">
//               <label>City</label>
//               <span>{currentUser.address?.city}</span>
//             </div>
//             <div className="infoItem">
//               <label>Street</label>
//               <span>{currentUser.address?.street}, {currentUser.address?.suite}</span>
//             </div>
//             <div className="infoItem">
//               <label>Zipcode</label>
//               <span>{currentUser.address?.zipcode}</span>
//             </div>
//             <div className="infoItem">
//               <label>Geo Location</label>
//               <span>Lat: {currentUser.address?.geo?.lat} | Lng: {currentUser.address?.geo?.lng}</span>
//             </div>
//           </div>
//         </section>

//         {/* מידע על חברה */}
//         <section className="infoSection">
//           <h3>Company Information</h3>
//           <div className="infoGrid">
//             <div className="infoItem">
//               <label>Company Name</label>
//               <span>{currentUser.company?.name}</span>
//             </div>
//             <div className="infoItem">
//               <label>Catch Phrase</label>
//               <span>{currentUser.company?.catchPhrase}</span>
//             </div>
//             <div className="infoItem">
//               <label>Business Strategy</label>
//               <span>{currentUser.company?.bs}</span>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default UserInfo;