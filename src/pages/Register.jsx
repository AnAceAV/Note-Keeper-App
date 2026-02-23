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

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isMountedRef.current) setLoading(true);

    try {
      const response = await authService.register(email, username, password);
      const { user, token } = response.data;
      if (isMountedRef.current) {
        login(user, token);
        navigate("/");
      }
    } catch (err) {
      if (isMountedRef.current) setError(err.response?.data?.message || "Registration failed");
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
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
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
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Register"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#f5ba13", textDecoration: "none" }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
