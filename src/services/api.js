import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, username, password) =>
    apiClient.post("/auth/register", { email, username, password }),

  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),

  getCurrentUser: () =>
    apiClient.get("/auth/me"),

  getGoogleAuthUrl: () =>
    `${API_URL.replace("/api", "")}/api/oauth/google`,

  getGitHubAuthUrl: () =>
    `${API_URL.replace("/api", "")}/api/oauth/github`,
};

export const notesService = {
  getNotes: () =>
    apiClient.get("/notes"),

  createNote: (title, content) =>
    apiClient.post("/notes", { title, content }),

  updateNote: (id, title, content) =>
    apiClient.put(`/notes/${id}`, { title, content }),

  deleteNote: (id) =>
    apiClient.delete(`/notes/${id}`),
};

export default apiClient;
