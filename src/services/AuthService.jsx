// Example in your Login.jsx or AuthService.js
const handleLogin = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', credentials);
    if (response.data.jwt) {
      // Save the token and role
      localStorage.setItem('token', response.data.jwt);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};