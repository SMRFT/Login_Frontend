import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import { validate } from "jsauth"

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL

// Background Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
`

const heartbeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`

const slideLeft = keyframes`
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100px); }
`

const slideRight = keyframes`
  0% { transform: translateX(-100vw); }
  100% { transform: translateX(calc(100vw + 100px)); }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const wave = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

// Background Container
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(135deg, #f1faee 0%, #f1faee 50%, #f1faee 100%);
`

// Animated Medical Icons
const FloatingIcon = styled.div`
  position: absolute;
  font-size: ${props => props.size || '2rem'};
  color: rgba(255, 255, 255, 0.1);
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  z-index: 1;
`

// Heartbeat Line
const HeartbeatLine = styled.div`
  position: absolute;
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  top: ${props => props.top || '20%'};
  left: ${props => props.left || '10%'};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    animation: ${slideLeft} 3s linear infinite;
    animation-delay: ${props => props.delay || '0s'};
  }
`

// Medical Cross
const MedicalCross = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  top: ${props => props.top || '30%'};
  left: ${props => props.left || '20%'};
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  
  &::before {
    width: 8px;
    height: 40px;
    left: 16px;
    top: 0;
  }
  
  &::after {
    width: 40px;
    height: 8px;
    left: 0;
    top: 16px;
  }
`

// DNA Helix
const DNAHelix = styled.div`
  position: absolute;
  width: 4px;
  height: 200px;
  top: ${props => props.top || '10%'};
  right: ${props => props.right || '10%'};
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, 
      rgba(255, 255, 255, 0.3) 0%,
      transparent 25%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 75%,
      rgba(255, 255, 255, 0.3) 100%
    );
    animation: ${wave} 2s ease-in-out infinite;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
    animation-delay: 1s;
  }
`

// Particle System
const Particle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: ${float} ${props => props.duration || '8s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`

// Main Container
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
`

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 10;

  &:hover {
    transform: translateY(-5px);
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: ${heartbeat} 2s ease-in-out infinite;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const HospitalName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #a8dadc, #a8dadc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const InputGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease;

  &::before {
    content: '⚠️';
  }
`

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease;

  &::before {
    content: '✅';
  }
`

const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #5a67d8;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 1rem;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.3s ease-out;
`

const ModalHeader = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const ModalText = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
`

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`

const ModalButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #f1f5f9;
    color: #475569;
    
    &:hover:not(:disabled) {
      background: #e2e8f0;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
`

// Background Component
const AnimatedBackground = () => {
  return (
    <BackgroundContainer>
      {/* Medical Crosses */}
      <MedicalCross top="15%" left="10%" delay="0s" />
      <MedicalCross top="70%" left="85%" delay="2s" />
      <MedicalCross top="40%" left="5%" delay="4s" />
      <MedicalCross top="80%" right="15%" delay="1s" />

      {/* Floating Medical Icons */}
      <FloatingIcon top="20%" left="20%" size="3rem" duration="8s" delay="0s">🩺</FloatingIcon>
      <FloatingIcon top="60%" left="80%" size="2.5rem" duration="6s" delay="2s">💊</FloatingIcon>
      <FloatingIcon top="80%" left="15%" size="2rem" duration="10s" delay="4s">🏥</FloatingIcon>
      <FloatingIcon top="30%" right="10%" size="2.5rem" duration="7s" delay="1s">⚕️</FloatingIcon>
      <FloatingIcon top="50%" left="5%" size="2rem" duration="9s" delay="3s">🔬</FloatingIcon>
      <FloatingIcon top="10%" right="25%" size="2.5rem" duration="8s" delay="5s">💉</FloatingIcon>

      {/* Heartbeat Lines */}
      <HeartbeatLine top="25%" left="0%" delay="0s" />
      <HeartbeatLine top="45%" left="20%" delay="1s" />
      <HeartbeatLine top="65%" left="40%" delay="2s" />
      <HeartbeatLine top="85%" left="60%" delay="3s" />

      {/* DNA Helixes */}
      <DNAHelix top="10%" right="5%" />
      <DNAHelix top="40%" right="90%" />

      {/* Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Particle
          key={i}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          duration={`${6 + Math.random() * 4}s`}
          delay={`${Math.random() * 5}s`}
        />
      ))}
    </BackgroundContainer>
  )
}

const Login = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotPasswordEmployeeId, setForgotPasswordEmployeeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Clear any existing tokens on component mount
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_payload")
    localStorage.removeItem("selected_branch")
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.employeeId.trim() || !formData.password.trim()) {
      setError("Please enter both Employee ID and Password.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const res = await axios.post(securityBaseUrl + "login/", {
        employeeId: formData.employeeId.trim(),
        password: formData.password
      }, {
        headers: { "Content-Type": "application/json" },
      })

      const { access_token } = res.data
      localStorage.setItem("access_token", access_token)

      // Use jsauth validation
      const user = validate(access_token)
      const allowedData = user.allowedData()
      const allowedModules = user.allowedModules()

      // Save values in localStorage
      localStorage.setItem("user_name", user.name)
      localStorage.setItem("user_email", user.email)
      localStorage.setItem("allowed_data", JSON.stringify(allowedData))
      localStorage.setItem("allowed_modules", JSON.stringify(allowedModules))

      if (allowedData?.length === 1) {
        localStorage.setItem("selected_branch", allowedData[0])
      }

      setSuccess("Login successful! Redirecting...")
      
      setTimeout(() => {
        navigate(`${import.meta.env.BASE_URL}secure`)
      }, 1000)

    } catch (err) {
      console.error("Login error:", err.response?.data || err)
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    setShowForgotModal(true)
    setError("")
    setSuccess("")
  }

  const handleCloseForgotModal = () => {
    setShowForgotModal(false)
    setForgotPasswordEmployeeId("")
    setError("")
    setSuccess("")
    setIsLoading(false)
  }

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmployeeId.trim()) {
      setError("Please enter your Employee ID")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(securityBaseUrl + "forgot-password/", {
        employeeId: forgotPasswordEmployeeId.trim()
      }, {
        headers: { "Content-Type": "application/json" }
      })

      if (response.data.success) {
        setSuccess(response.data.message)
        setTimeout(() => {
          handleCloseForgotModal()
        }, 3000)
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatedBackground />
      <Container>
        <LoginCard>
          <Header>
            <Logo>🏥</Logo>
            <HospitalName>Shanmuga Hospital</HospitalName>
            <Subtitle>Employee Portal</Subtitle>
          </Header>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="username"
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </InputGroup>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner />}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>

          <ForgotPasswordLink onClick={handleForgotPassword}>
            Forgot Password?
          </ForgotPasswordLink>
        </LoginCard>
      </Container>

      {showForgotModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && handleCloseForgotModal()}>
          <ModalContent>
            <ModalHeader>Reset Password</ModalHeader>
            
            {success ? (
              <>
                <SuccessMessage>{success}</SuccessMessage>
                <ModalText>Please check your email for the password reset link.</ModalText>
              </>
            ) : (
              <>
                <ModalText>
                  Enter your Employee ID and we'll send you a link to reset your password.
                </ModalText>
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <InputGroup>
                  <Input
                    type="text"
                    value={forgotPasswordEmployeeId}
                    onChange={(e) => setForgotPasswordEmployeeId(e.target.value)}
                    placeholder="Employee ID"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </InputGroup>
              </>
            )}
            
            <ModalButtons>
              <ModalButton onClick={handleCloseForgotModal} disabled={isLoading}>
                Cancel
              </ModalButton>
              {!success && (
                <ModalButton 
                  primary 
                  onClick={handleForgotPasswordSubmit}
                  disabled={isLoading}
                >
                  {isLoading && <LoadingSpinner />}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </ModalButton>
              )}
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default Login
