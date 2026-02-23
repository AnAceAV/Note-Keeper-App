import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HighlightIcon from "@mui/icons-material/Highlight";
import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>
          <HighlightIcon />
          Keeper
        </h1>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              Welcome, {user.username}!
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "#fff" }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </header>
  );
}

export default Header;
