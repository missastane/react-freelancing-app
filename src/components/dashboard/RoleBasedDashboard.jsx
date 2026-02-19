import React from "react";
import FreelancerDashboard from "./FreelancerDashboard";
import EmployerDashboard from "./EmployerDashboard";
import { useRole } from "../../context/RoleContext"; 
// مسیر رو مطابق پروژه‌ت تنظیم کن

export default function RoleBasedDashboard() {
  const { activeRole } = useRole();

  if (activeRole === "employer") return <EmployerDashboard />;
  return <FreelancerDashboard />;
}
