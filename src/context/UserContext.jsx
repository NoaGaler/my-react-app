import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // שינוי: הוספת סטייט שבודק האם המשתמש חדש (נרשם הרגע)
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isNewUser, setIsNewUser }}>
      {children}
    </UserContext.Provider>
  );
};




// import React, { createContext, useState } from 'react';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   // ה-Context פשוט נותן גישה למשתמש ולדרך לעדכן אותו
//   return (
//     <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };