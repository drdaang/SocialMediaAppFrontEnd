import React, { createContext, useState } from 'react';

export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [mail, setMail] = useState("User");

  return (
    <DataContext.Provider value={{mail,setMail }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
