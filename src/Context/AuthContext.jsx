import React, { useState } from 'react';

const AdminContext = React.createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const adminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdminLoggedIn(true);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => React.useContext(AdminContext);