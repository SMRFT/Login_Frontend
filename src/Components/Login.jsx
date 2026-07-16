import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styled, { keyframes } from "styled-components"
import { validate } from "jsauth"
import Logo from "./Images/shanmuga-innovations-llp-pink.png"
import Logo1 from "./Images/logo1.png"

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

const floaty = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
`

// Layout
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2B2230;
  animation: ${fadeIn} 0.6s ease both;
`

const BrandPanel = styled.div`
  flex: 1 1 420px;
  min-height: 100vh;
  background: linear-gradient(155deg, #D9538F 0%, #A83A6E 55%, #1E8A7D 130%);
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 5vw;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    min-height: auto;
    padding: 40px 6vw 56px;
  }
`

const DecorCircleTop = styled.div`
  position: absolute;
  right: -60px;
  top: -60px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  pointer-events: none;
`

const DecorCircleBottom = styled.div`
  position: absolute;
  left: -80px;
  bottom: -80px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
`

const FloatIcon = styled.div`
  position: absolute;
  pointer-events: none;
  animation: ${floaty} ${props => props.duration || '8s'} ease-in-out infinite;
  opacity: ${props => props.opacity || 0.5};
  right: ${props => props.right};
  left: ${props => props.left};
  top: ${props => props.top};
`

const LogoBadge = styled.div`
  align-self: flex-start;
  position: relative;
  display: inline-block;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 10px 16px;

  img {
    height: 42px;
    width: auto;
    display: block;
  }
`

const BrandContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  max-width: 440px;
`

const BrandTitle = styled.h1`
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.01em;
`

const BrandSubtext = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  opacity: 0.92;
`

const PointsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
`

const PointRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const PointCheck = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
`

const PointText = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const BrandFooter = styled.div`
  position: relative;
  font-size: 12.5px;
  opacity: 0.75;
`

const FormPanel = styled.div`
  flex: 1 1 460px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 5vw;
  box-sizing: border-box;
  background: #FFFFFF;
`

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

const FormBrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;

  img {
    height: 72px;
    width: auto;
    display: block;
  }
`

const FormBrandName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2B2230;
  letter-spacing: 0.02em;
`

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`

const FormTitle = styled.div`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.01em;
`

const FormSubtitle = styled.div`
  font-size: 14px;
  color: #8A7684;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #5C4B57;
`

const InlineLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 12.5px;
  color: #C94F87;
  font-weight: 600;

  &:hover {
    color: #A83A6E;
  }
`

const Input = styled.input`
  border: 1.5px solid #EBDDE5;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  color: #2B2230;
  background: #FFFDFE;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #BFAFB9;
  }

  &:focus {
    outline: none;
    border-color: #D9538F;
    box-shadow: 0 0 0 3px rgba(217, 83, 143, 0.12);
  }

  &:disabled {
    background: #F6EFF3;
    cursor: not-allowed;
  }
`

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
`

const PasswordInput = styled(Input)`
  padding-right: 60px;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  color: #A83A6E;
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.05em;
`

const RememberLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #5C4B57;
  cursor: pointer;
  font-weight: 500;

  input {
    width: 16px;
    height: 16px;
    accent-color: #D9538F;
  }
`

const SubmitButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 15px;
  background: linear-gradient(135deg, #D9538F, #A83A6E);
  color: #FFFFFF;
  font-family: 'Poppins', sans-serif;
  font-size: 15.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 26px -10px rgba(201, 79, 135, 0.6);
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  color: #8A7684;
  font-size: 12.5px;
`

const HelperText = styled.div`
  text-align: center;
  font-size: 13.5px;
  color: #8A7684;

  a {
    color: #C94F87;
    font-weight: 600;
    text-decoration: none;
  }
  a:hover {
    color: #A83A6E;
  }
`

const BackHomeLink = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: center;
  background: rgba(217, 83, 143, 0.08);
  border: 1.5px solid rgba(201, 79, 135, 0.35);
  border-radius: 999px;
  cursor: pointer;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #A83A6E;
  padding: 10px 22px;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(217, 83, 143, 0.16);
    transform: translateY(-1px);
  }
`

const ErrorMessage = styled.div`
  background: #FDF0F4;
  border: 1px solid #F3C9DA;
  color: #A83A6E;
  padding: 0.75rem 1rem;
  border-radius: 10px;
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
  background: #EAF7F4;
  border: 1px solid #BEE6DB;
  color: #1E8A7D;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
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
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
`

// Modal
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(43, 34, 48, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 2rem 1rem;
  overflow-y: auto;
`

const ModalContent = styled.div`
  background: #FFFFFF;
  border: 1px solid #EBDDE5;
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(90, 40, 70, 0.35);
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`

const ModalHeader = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-align: center;
  color: #2B2230;
`

const ModalText = styled.p`
  color: #8A7684;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-align: center;
  font-size: 1rem;
`

const ModalInput = styled(Input)`
  margin-bottom: 2rem;
`

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`

const ModalButton = styled.button`
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #D9538F, #A83A6E);
    color: white;

    &:hover:not(:disabled) {
      filter: brightness(1.06);
    }
  ` : `
    background: #F6EFF3;
    color: #5C4B57;
    border: 1px solid #EBDDE5;

    &:hover:not(:disabled) {
      background: #EEDFE7;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <path d="M2 7 L5 10 L11 3" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="13" height="15" viewBox="0 0 13 15">
    <path d="M6.5 1 L12 3.2 V7.5 C12 11 9.8 13.2 6.5 14.2 C3.2 13.2 1 11 1 7.5 V3.2 Z" fill="none" stroke="#1E8A7D" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M4.2 7.6 L6 9.4 L9 5.8" fill="none" stroke="#1E8A7D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const points = [
  'HIPAA-grade secure architecture',
  'Role-based access for every team',
  'Multi-hospital, cloud-ready platform',
]

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
      const allowedData = user.allowedData()

      localStorage.setItem("user_name", user.name())
      localStorage.setItem("user_email", user.email())

      const outlets = user.allowedOutlets();
      localStorage.setItem("outlet_code", outlets ? outlets.join(',') : "");

      localStorage.setItem("hospital_code", res.data.user.hospitalCode)

      localStorage.setItem("allowed_data", JSON.stringify(allowedData))
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
      {/* Brand Panel */}
      <BrandPanel>
        <DecorCircleTop />
        <DecorCircleBottom />
        <FloatIcon right="8%" top="12%" duration="8s" opacity={0.5} aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 44 44">
            <rect x="17" y="6" width="10" height="32" rx="4" fill="#FFFFFF" />
            <rect x="6" y="17" width="32" height="10" rx="4" fill="#FFFFFF" />
          </svg>
        </FloatIcon>
        <FloatIcon left="12%" top="22%" duration="10s" opacity={0.45} aria-hidden="true">
          <svg width="52" height="30" viewBox="0 0 52 30">
            <path d="M2 15 h12 l4-9 6 18 5-12 3 3 h18" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </FloatIcon>

        <LogoBadge onClick={() => navigate(`${import.meta.env.BASE_URL}`)} style={{ cursor: 'pointer' }}>
          <img src={Logo} alt="Shanmuga Innovations LLP" />
        </LogoBadge>

        <BrandContent>
          <BrandTitle>Secure Healthcare Portal</BrandTitle>
          <BrandSubtext>One sign-in for hospitals, pharmacies, laboratories, ambulance services, and home care teams.</BrandSubtext>
          <PointsList>
            {points.map((p) => (
              <PointRow key={p}>
                <PointCheck><CheckIcon /></PointCheck>
                <PointText>{p}</PointText>
              </PointRow>
            ))}
          </PointsList>
        </BrandContent>

        <BrandFooter>&copy; 2025 SHANMUGA INNOVATIONS LLP. All Rights Reserved.</BrandFooter>
      </BrandPanel>

      {/* Form Panel */}
      <FormPanel>
        <FormWrapper>
          <FormBrandRow>
            <img src={Logo1} alt="Shanmuga Innovations LLP" />
            <FormBrandName>Shanmuga Innovations LLP</FormBrandName>
          </FormBrandRow>

          <FormHeader>
            <FormTitle>Login</FormTitle>
            <FormSubtitle>Access your healthcare workspace</FormSubtitle>
          </FormHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldLabel htmlFor="hc-user">Employee ID</FieldLabel>
              <Input
                id="hc-user"
                type="text"
                name="employeeId"
                placeholder="Enter your Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="username"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabelRow>
                <FieldLabel htmlFor="hc-pass">Password</FieldLabel>
                <InlineLink type="button" onClick={handleForgotPassword}>Forgot password?</InlineLink>
              </FieldLabelRow>
              <PasswordWrapper>
                <PasswordInput
                  id="hc-pass"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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
                  {showPassword ? "HIDE" : "SHOW"}
                </PasswordToggle>
              </PasswordWrapper>
            </FieldGroup>



            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner />}
              {isSubmitting ? 'Signing in...' : 'Login'}
            </SubmitButton>

            <SecurityNote>
              <ShieldIcon />
              Protected with 256-bit encryption &middot; Role-based access
            </SecurityNote>

            <HelperText>New to the platform? <a href="mailto:support@shinova.in">Contact us</a></HelperText>
            <BackHomeLink type="button" onClick={() => navigate(`${import.meta.env.BASE_URL}`)}>
              &larr; Back to home
            </BackHomeLink>
          </Form>
        </FormWrapper>
      </FormPanel>

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
                  $primary
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
    </PageContainer>
  )
}

export default Login
