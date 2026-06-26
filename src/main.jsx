import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Global Axios Interceptor for Single Device Login (Auto Logout)
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if the error is specifically due to another device login
      if (error.response.data && error.response.data.error === 'Session invalidated: Logged in from another device') {
        alert('Your session has been invalidated because your account was logged in from another device.');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = `${import.meta.env.BASE_URL}login`;
      }
    }
    return Promise.reject(error);
  }
);

// Global Fetch Interceptor for Single Device Login (Auto Logout)
const originalFetch = window.fetch;
window.fetch = async function () {
  const response = await originalFetch.apply(this, arguments);
  if (response.status === 401) {
    const clonedResponse = response.clone();
    try {
      const data = await clonedResponse.json();
      if (data && data.error === 'Session invalidated: Logged in from another device') {
        alert('Your session has been invalidated because your account was logged in from another device.');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = `${import.meta.env.BASE_URL}login`;
      }
    } catch (e) {
      // Error parsing JSON, ignore
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
