import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {validate} from "../jwt-check";

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL;

// Updated Container with a subtle gradient background
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

// Modern glass-effect form wrapper
const FormWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  width: 450px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

// More modern title with custom underline effect
const Title = styled.h2`
  margin-bottom: 2.5rem;
  color: #333;
  font-weight: 700;
  font-size: 2rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #6b5b95, #dd2476);
    border-radius: 4px;
  }
`;

// Enhanced input group with better spacing
const InputGroup = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

// Enhanced input label with better transition
const InputLabel = styled.label`
  position: absolute;
  left: 15px;
  top: ${props => props.filled ? '-10px' : '12px'};
  font-size: ${props => props.filled ? '12px' : '16px'};
  color: ${props => props.filled ? '#6b5b95' : '#aaa'};
  background: ${props => props.filled ? 'white' : 'transparent'};
  padding: 0 5px;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: 500;
  letter-spacing: 0.2px;
`;

// Modern input fields with subtle transitions
const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #eaeaea;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #f9f9f9;
  color: #333;
  
  &:focus {
    border-color: #6b5b95;
    box-shadow: 0 0 0 4px rgba(107, 91, 149, 0.1);
    outline: none;
    background-color: #ffffff;
  }
  
  &:focus + ${InputLabel} {
    top: -10px;
    font-size: 12px;
    color: #6b5b95;
    background: white;
    font-weight: 600;
  }
`;

// Enhanced button with hover and active states
const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 1.5rem;
  background: linear-gradient(90deg, #6b5b95, #a15ea3);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(107, 91, 149, 0.3);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(90deg, #6b5b95, #dd2476);
    box-shadow: 0 6px 22px rgba(221, 36, 118, 0.35);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(107, 91, 149, 0.2);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(30deg);
    transition: transform 0.6s;
    opacity: 0;
  }
  
  &:hover:after {
    opacity: 1;
    transform: rotate(30deg) translateY(-20%);
  }
`;

// Improved error message with icon
const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 1.5rem;
  background: rgba(231, 76, 60, 0.08);
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 4px solid #e74c3c;
  text-align: left;
  display: flex;
  align-items: center;
  animation: fadeInUp 0.4s;
  
  &:before {
    content: "⚠️";
    margin-right: 10px;
    font-size: 16px;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// The rest of your component remains the same
const Login = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.password) {
      setError("Please enter both Employee ID and Password.");
      return;
    }

    try {
      const res = await axios.post(securityBaseUrl + "login/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token } = res.data;

      localStorage.setItem("access_token", access_token);

      const user = validate(access_token);
      console.log("User id:", user.id());
      console.log("User name:", user.name());
      console.log("User email:", user.email());
      console.log("Allowed Actions:", user.allowedActions());
      console.log("Allowed Data:", user.allowedData());
      console.log("Allowed Pages:", user.allowedPages());
      
      console.log("Check if user has RW access to page SD-P-BG and branch SHB003:", user.checkAccess("SHB003", "SD-P-BG-RW"));
      console.log("Check if user has RW access to page SD-P-BG and branch SHB003:", user.checkAccess("SHB003", "SD-P-BG", "RW"));
      console.log("Check if user has RW access to page SD-P-BG:", user.checkRoleAccess("SD-P-BG-RW"));
      console.log("Check if user has RW access to page SD-P-BG:", user.checkRoleAccess("SD-P-BG", "RW"));
      console.log("Check if user has RW access to branch SHB003:", user.checkDataAccess("SHB003"));

      console.log("Check if user has RW access to page SD-P-XX and branch SHB003:", user.checkAccess("SHB003", "SD-P-XX-RW"));
      console.log("Check if user has RW access to page SD-P-XX and branch SHB003:", user.checkAccess("SHB003", "SD-P-XX", "RW"));
      console.log("Check if user has RW access to page SD-P-XX:", user.checkRoleAccess("SD-P-XX-RW"));
      console.log("Check if user has RW access to page SD-P-XX:", user.checkRoleAccess("SD-P-XX", "RW"));
      console.log("Check if user has RW access to branch SHB009:", user.checkDataAccess("SHB009"));

      navigate("/Profile");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Employee Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input 
              type="text" 
              name="employeeId" 
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange} 
              required 
            />
            <InputLabel 
              htmlFor="employeeId" 
              filled={formData.employeeId.length > 0}
            >
              Employee ID
            </InputLabel>
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputLabel 
              htmlFor="password"
              filled={formData.password.length > 0}
            >
              Password
            </InputLabel>
          </InputGroup>
          
          <Button type="submit">Sign In</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default Login;