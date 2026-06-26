import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import { validate } from "jsauth"
import { User, Key, Eye, EyeOff } from "lucide-react"
import ShinovaLogo from "./Images/Shinova.png"
import bgImage from "./Images/cyber_bg.png"

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

// Main Layout Components
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 2rem;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const SplitContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  height: 85vh;
  min-height: 600px; 
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  @media (max-width: 1024px) {
    max-width: 95%;
    height: 90vh;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: auto;
    max-width: 100%;
    background: transparent;
    box-shadow: none;
    border: none;
    backdrop-filter: none;
    margin: 1rem 0;
  }
`

const LeftPanel = styled.div`
  flex: 1;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2rem;
  overflow: hidden;

  /* Add an overlay for technical aesthetic */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 17, 0.6) 100%);
    z-index: 1;
  }

  @media (max-width: 900px) {
    display: none; /* Hide left panel on mobile devices */
  }

  /* Additional decorative layers for tech pattern */
  .decorative-line {
    position: absolute;
background: rgba(255, 255, 255, 0.1);
z-index: 1;
  }
  
  .line-bottom {
  bottom: 20%;
  left: 0;
  width: 100%;
  height: 1px;
}
  
  .line-left {
  top: 0;
  left: 20%;
  width: 1px;
  height: 100%;
}
`

const LeftContent = styled.div`
position: relative;
z-index: 2;
text-align: center;
max-width: 500px;
`

const WelcomeText = styled.h1`
font-size: 2rem;
font-weight: 600;
margin-bottom: 0.5rem;
line-height: 1.3;
color: #ffcccc;
`

const WelcomeSubText = styled.p`
font-size: 1.25rem;
font-weight: 400;
color: rgba(255, 255, 255, 0.8);
margin-bottom: 3rem;
`

const HeroImagePlaceholder = styled.div`
width: 280px;
height: 280px;
background: rgba(0, 0, 0, 0.3);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin: 0 auto;
box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
position: relative;
  
  &::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}
`

const HeroImage = styled.img`
max-width: 70%;
height: auto;
filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
`

const RightPanel = styled.div`
flex: 1;
background: #0f172a;
background-image: radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.1) 0%, transparent 50%);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
position: relative;

@media (max-width: 600px) {
  padding: 1.5rem;
}
`

const RightHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;

  @media (max-width: 1024px) {
    margin-bottom: 1.5rem;
  }
`

const RightLogo = styled.img`
height: 100px;
margin-bottom: 1rem;
filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2));
`

const CompanyTitle = styled.h2`
font-size: 1.5rem;
font-weight: 800;
color: #f8fafc;
margin: 0;
letter-spacing: 1.5px;
text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`

const LoginCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  animation: ${fadeIn} 0.5s ease-out;
  border-radius: 16px;
  z-index: 2;
  
  /* Cyberpunk glows behind the card */
  &::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, transparent 40%, transparent 60%, rgba(6, 182, 212, 0.8) 100%);
    z-index: -1;
    border-radius: 18px;
    filter: blur(8px);
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    &::before {
      display: none; /* Remove glow on mobile */
    }
  }
`

const LoginCard = styled.div`
background: rgba(30, 41, 59, 0.5);
backdrop-filter: blur(10px);
border-radius: 24px;
padding: 3rem;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.05);

@media (max-width: 1024px) {
  padding: 2rem;
}

@media (max-width: 600px) {
  padding: 2rem 1.5rem;
}
`

const FormTitle = styled.h3`
font-size: 1.25rem;
font-weight: 700;
color: #f1f5f9;
margin: 0 0 1.5rem 0;
text-align: center;
letter-spacing: 0.5px;
@media (max-width: 1024px) {
  margin-bottom: 1rem;
}
`

const Form = styled.form`
display: flex;
flex-direction: column;
gap: 1.25rem;
`

const InputGroupWrapper = styled.div`
position: relative;
display: flex;
align-items: center;
`

const IconWrapper = styled.div`
position: absolute;
left: 1.25rem;
color: #06b6d4;
display: flex;
align-items: center;
justify-content: center;
z-index: 10;
`

const Input = styled.input`
width: 100%;
padding: 0.875rem 1rem 0.875rem 3.5rem;
border: 1px solid rgba(255, 255, 255, 0.1); 
border-radius: 12px; 
font-size: 1rem;
color: #f8fafc;
background: rgba(15, 23, 42, 0.6); 
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
box-sizing: border-box;

  &:focus {
  outline: none;
  border-color: #06b6d4;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}

  &::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

  &:disabled {
  background: rgba(248, 250, 252, 0.5);
  cursor: not-allowed;
}
`

const PasswordToggle = styled.button`
position: absolute;
right: 1rem;
background: none;
border: none;
color: #0f766e;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
padding: 0;
transition: color 0.2s;

  &:hover {
  color: #115e59;
}
`

const ForgotPasswordContainer = styled.div`
display: flex;
justify-content: flex-end;
margin-top: -0.25rem;
margin-bottom: 0.5rem;
`

const ForgotPasswordLink = styled.button`
background: none;
border: none;
color: #06b6d4;
font-size: 0.875rem;
font-weight: 500;
cursor: pointer;
padding: 0;
transition: all 0.2s;

  &:hover {
  color: #22d3ee;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
}
`

const SubmitButton = styled.button`
width: 100%;
padding: 1.125rem;
background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
color: white;
border: none;
border-radius: 12px;
font-size: 1rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 1px;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.2);

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.9rem;
  }

  &:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

  &:active:not(:disabled) {
  transform: translateY(0);
}

  &:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`

const ErrorMessage = styled.div`
background: #fef2f2;
border: 1px solid #fecaca;
color: #dc2626;
padding: 0.75rem 1rem;
border-radius: 6px;
font-size: 0.875rem;
margin-bottom: 1.5rem;
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
border-radius: 6px;
font-size: 0.875rem;
margin-bottom: 1.5rem;
display: flex;
align-items: center;
gap: 0.5rem;
animation: ${fadeIn} 0.3s ease;

  &::before {
  content: '✅';
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
vertical-align: middle;
`

// Modal Components
const Modal = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(2, 6, 17, 0.9);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
backdrop-filter: blur(12px);
padding: 2rem 1rem;
overflow-y: auto;
`

const ModalContent = styled.div`
background: rgba(15, 23, 42, 0.95);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
padding: 2.5rem;
width: 100%;
max-width: 440px;
max-height: 90vh;
overflow-y: auto;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
position: relative;

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }

/* Custom Scrollbar */
&::-webkit-scrollbar {
  width: 6px;
}
&::-webkit-scrollbar-track {
  background: transparent;
}
&::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.2);
  border-radius: 10px;
}
`

const ModalHeader = styled.h3`
font-size: 1.5rem;
font-weight: 800;
margin: 0 0 1rem 0;
text-align: center;
color: #f8fafc;
`

const ModalText = styled.p`
color: #94a3b8;
margin-bottom: 2rem;
line-height: 1.6;
text-align: center;
font-size: 1rem;
`

const ModalInput = styled.input`
width: 100%;
padding: 1rem;
background: rgba(15, 23, 42, 0.5);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
font-size: 1rem;
color: #f8fafc;
margin-bottom: 2rem;
box-sizing: border-box;
transition: all 0.3s;

  &:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}
`

const ModalButtons = styled.div`
display: flex;
gap: 0.75rem;
`

const ModalButton = styled.button`
flex: 1;
padding: 0.875rem 1rem;
border: none;
border-radius: 6px;
font-weight: 600;
font-size: 0.95rem;
cursor: pointer;
transition: all 0.2s ease;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  `}

  &:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`

const Login = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
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
      setError("Please enter both Username/Email and Password.")
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

      // Use direct jsauth validation
      const user = validate(access_token)
      // Call allowedActions once to ensure it's logged or processed if needed
      // (jsauth.validate already calls .process() which decrypts actions)

      const allowedData = user.allowedData()
      console.log(allowedData, "allowedData")
      // user.process()
      console.log("user", user)
      const allowedModules = user.allowedModules()
      console.log(allowedModules, "allowedModules")


      localStorage.setItem("user_name", user.name())
      localStorage.setItem("user_email", user.email())

      const outlets = user.allowedOutlets();
      localStorage.setItem("outlet_code", outlets ? outlets.join(',') : "");

      localStorage.setItem("hospital_code", res.data.user.hospitalCode)


      localStorage.setItem("allowed_data", JSON.stringify(allowedData))
      // localStorage.setItem("allowed_modules", JSON.stringify(allowedModules))
      localStorage.setItem("user_payload", JSON.stringify(res.data.user))

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
    <PageContainer>
      <SplitContainer>
        {/* Left Panel */}
        <LeftPanel>
          <div className="decorative-line line-bottom"></div>
          <div className="decorative-line line-left"></div>

          <LeftContent>
            <WelcomeText>Innovating for a Smarter Future.</WelcomeText>
            <WelcomeSubText>Welcome to Shanmuga Innovations.</WelcomeSubText>

            <HeroImagePlaceholder>
              <HeroImage src={ShinovaLogo} alt="Shanmuga Innovations Target" />
            </HeroImagePlaceholder>
          </LeftContent>
        </LeftPanel>

        {/* Right Panel */}
        <RightPanel>
          <RightHeader>
            <RightLogo src={ShinovaLogo} alt="Logo" />
            <CompanyTitle>SHANMUGA INNOVATIONS</CompanyTitle>
          </RightHeader>

          <LoginCardWrapper>
            <LoginCard>
              <FormTitle>Employee Secure Login</FormTitle>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <Form onSubmit={handleSubmit}>
                <InputGroupWrapper>
                  <IconWrapper><User size={20} /></IconWrapper>
                  <Input
                    type="text"
                    name="employeeId"
                    placeholder="Employee ID"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </InputGroupWrapper>

                <InputGroupWrapper>
                  <IconWrapper><Key size={20} /></IconWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </PasswordToggle>
                </InputGroupWrapper>

                <ForgotPasswordContainer>
                  <ForgotPasswordLink type="button" onClick={handleForgotPassword}>
                    Forgot password?
                  </ForgotPasswordLink>
                </ForgotPasswordContainer>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoadingSpinner />}
                  {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
                </SubmitButton>
              </Form>
            </LoginCard>
          </LoginCardWrapper>
        </RightPanel>

        {/* Forgot Password Modal */}
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

                  <ModalInput
                    type="text"
                    value={forgotPasswordEmployeeId}
                    onChange={(e) => setForgotPasswordEmployeeId(e.target.value)}
                    placeholder="Employee ID"
                    disabled={isLoading}
                    autoComplete="username"
                  />
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
      </SplitContainer>
    </PageContainer>
  )
}

export default Login
