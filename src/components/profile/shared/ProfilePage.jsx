import React from "react";
import { Container, Box } from "@mui/material";
import { useRole } from "../../../context/RoleContext";
import ProfileLayout from "./ProfileLayut";
import FreelancerProfile from "../freelancer/FreelancerProfile";
import EmployerProfile from "../employer/EmployerProfile";

export default function ProfilePage() {
  const { activeRole } = useRole(); // "freelancer" | "employer"

  return (
    <Box
      sx={(t) => ({
        py: { xs: 3, sm: 4 },
        bgcolor: t.palette.surface?.soft || t.palette.background.default,
        minHeight: "100vh",
      })}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <ProfileLayout>
          {activeRole === "freelancer" ? <FreelancerProfile /> : <EmployerProfile />}
        </ProfileLayout>
      </Container>
    </Box>
  );
}