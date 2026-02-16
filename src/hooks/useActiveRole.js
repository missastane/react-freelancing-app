import { useEffect, useState } from "react";

const KEY = "active_role"; // localStorage key

export default function useActiveRole(defaultRole = "freelancer") {
  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved || defaultRole;
  });

  useEffect(() => {
    localStorage.setItem(KEY, activeRole);
  }, [activeRole]);

  return { activeRole, setActiveRole };
}
