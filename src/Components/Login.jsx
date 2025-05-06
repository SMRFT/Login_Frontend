import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {validate} from "jsauth";
// import {validate} from "../jwt-check";

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL;
console.log("hj", securityBaseUrl);

console.log("hj",securityBaseUrl)
// Updated Container with a subtle gradient background
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f2f5 0%, #d9e4f5 100%);
`;

const FormWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  width: 440px;
  max-width: 95%;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  margin-bottom: 2.2rem;
  color: #2e2e2e;
  font-weight: 700;
  font-size: 2.1rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 4px;
    background: linear-gradient(90deg, #845ec2, #d65db1);
    border-radius: 3px;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 2.1rem;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 18px;
  top: ${props => props.filled ? '-10px' : '13px'};
  font-size: ${props => props.filled ? '12px' : '16px'};
  color: ${props => props.filled ? '#845ec2' : '#aaa'};
  background: white;
  padding: 0 5px;
  transition: all 0.3s ease;
  pointer-events: none;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  font-size: 15px;
  background-color: #fdfdfd;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #845ec2;
    box-shadow: 0 0 0 4px rgba(132, 94, 194, 0.1);
    outline: none;
    background-color: #fff;
  }

  &:focus + ${InputLabel} {
    top: -10px;
    font-size: 12px;
    color: #845ec2;
    font-weight: 600;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 1.2rem;
  background: linear-gradient(90deg, #845ec2, #d65db1);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  box-shadow: 0 4px 16px rgba(132, 94, 194, 0.25);

  &:hover {
    background: linear-gradient(90deg, #845ec2, #ff6f91);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 111, 145, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  &:after {
    content: '';
    position: absolute;
    top: -40%;
    left: -40%;
    width: 180%;
    height: 180%;
    background: linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    transform: rotate(25deg);
    opacity: 0;
    transition: all 0.5s ease-in-out;
  }

  &:hover:after {
    opacity: 1;
    transform: rotate(25deg) translateY(-15%);
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 1.8rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 12px 18px;
  border-radius: 10px;
  border-left: 5px solid #e74c3c;
  text-align: left;
  display: flex;
  align-items: center;
  animation: fadeInUp 0.4s ease;

  &:before {
    content: "⚠️";
    margin-right: 10px;
    font-size: 16px;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
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

     

      
     
    
      navigate(`${import.meta.env.BASE_URL}`);
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