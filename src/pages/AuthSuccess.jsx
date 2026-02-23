import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Box, CircularProgress, Typography } from "@mui/material";

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");
    const email = searchParams.get("email") || "oauth-user";

    if (token && userId) {
      const user = {
        id: parseInt(userId),
        username: username || "User",
        email: email,
      };
      login(user, token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Authenticating...
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default AuthSuccess;
