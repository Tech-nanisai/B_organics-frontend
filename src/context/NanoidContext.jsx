import React, { createContext, useContext, useState, useEffect } from "react";

const NanoidContext = createContext();

export const NanoidProvider = ({ children }) => {
  const [nanoid, setNanoid] = useState("");

useEffect(() => {
  const storedNanoid = localStorage.getItem("nanoid");
  if (storedNanoid) {
    setNanoid(storedNanoid);
  }
}, []);

  const saveNanoid = (newNanoid) => {
    localStorage.setItem("nanoid", newNanoid);
    setNanoid(newNanoid);
  };

  const clearNanoid = () => {
    localStorage.removeItem("nanoid");
    setNanoid("");
  };

  return (
    <NanoidContext.Provider value={{ nanoid, saveNanoid, clearNanoid }}>
      {children}
    </NanoidContext.Provider>
  );
};

export const useNanoid = () => useContext(NanoidContext);
