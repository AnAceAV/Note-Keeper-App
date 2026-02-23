import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (isMountedRef.current) setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      if (isMountedRef.current) setError(err.response?.data?.message || "Login failed");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleOAuthLogin = (type) => {
    const url =
      type === "google"
        ? authService.getGoogleAuthUrl()
        : authService.getGitHubAuthUrl();
    window.location.href = url;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login to Keeper
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            OR
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleOAuthLogin("google")}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => handleOAuthLogin("github")}
          >
            GitHub
          </Button>
        </Box>

        <Typography variant="body2" align="center">
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#f5ba13", textDecoration: "none" }}>
            Register here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
