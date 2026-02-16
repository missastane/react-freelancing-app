// src/context/RoleContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "active_role";
const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "freelancer";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeRole);
  }, [activeRole]);

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
