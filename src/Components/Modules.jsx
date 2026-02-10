"use client"

import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { validate } from "jsauth"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import BirthdayModal from "./BirthdayModal"

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const orb1Move = keyframes`
  0% { transform: translate(0, 0); opacity: 0.5; }
  50% { transform: translate(-30px, 30px); opacity: 0.7; }
  100% { transform: translate(0, 0); opacity: 0.5; }
`

const orb2Move = keyframes`
  0% { transform: translate(0, 0); opacity: 0.4; }
  50% { transform: translate(40px, -40px); opacity: 0.6; }
  100% { transform: translate(0, 0); opacity: 0.4; }
`

const orb3Move = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
  50% { transform: translate(-50px, -20px) rotate(180deg); opacity: 0.5; }
  100% { transform: translate(0, 0) rotate(360deg); opacity: 0.3; }
`

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top center, #230406 0%, #0a0101 100%);
  background-size: cover;
  animation: none;
  color: #894444ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 2rem;
  font-family: 'Outfit', 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
`

const BackgroundOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
`

const Orb1 = styled(BackgroundOrb)`
  width: 300px;
  height: 300px;
  background: rgba(235, 51, 73, 0.08);
  top: -50px;
  right: -50px;
  animation: ${orb1Move} 10s ease-in-out infinite;
`

const Orb2 = styled(BackgroundOrb)`
  width: 400px;
  height: 400px;
  background: rgba(244, 92, 67, 0.05);
  bottom: -100px;
  left: -100px;
  animation: ${orb2Move} 15s ease-in-out infinite;
`

const Orb3 = styled(BackgroundOrb)`
  width: 250px;
  height: 250px;
  background: rgba(235, 51, 73, 0.08);
  top: 40%;
  right: 10%;
  animation: ${orb3Move} 12s ease-in-out infinite;
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`

const Star = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: #333;
  border-radius: 50%;
  opacity: ${(props) => props.opacity * 0.3};
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  animation: ${pulse} ${(props) => props.duration}s ease-in-out infinite;
`

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 2;
  padding-left: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: left;
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  
  span {
    color: #eb3349;
    background: linear-gradient(135deg, #eb3349, #F45C43);
    -webkit-background-clip: text;
    background-clip: text;
  }
`

const ModulesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
`

const glassMorphism = `
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`

const ModuleCard = styled.div`
  position: relative;
  ${glassMorphism}
  border-radius: 20px;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  cursor: pointer;
  min-height: 200px;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${({ index }) => `${index * 0.05}s`};
  opacity: 0;
  
  /* Gradient Border Effect */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    -webkit-mask: 
       linear-gradient(#fff 0 0) content-box, 
       linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(235, 51, 73, 0.3);
    
    &::after {
      background: linear-gradient(135deg, rgba(235,51,73,0.5), rgba(244,92,67,0.5));
    }
  }
`

const ModuleIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;

  ${ModuleCard}:hover & {
    background: ${({ gradient }) => gradient};
    border-color: transparent;
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
`

const ModuleName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f0f0f0;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
`

const ModuleDescription = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  flex-grow: 1;
  line-height: 1.5;
`

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`

const LaunchButton = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.3s ease;
  
  ${ModuleCard}:hover & {
    color: #fff;
  }
`

const Arrow = styled.span`
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  ${ModuleCard}:hover & {
    transform: translateX(5px);
  }
`

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.05);
`

const LoadingAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4rem 0;
  position: relative;
  z-index: 2;
`

const LoadingCircle = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${({ index }) => {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#6a67ce"]
    return colors[index % colors.length]
  }};
  border-radius: 50%;
  margin: 0 5px;
  animation: ${float} 1s ease-in-out infinite;
  animation-delay: ${({ index }) => `${index * 0.2}s`};
  box-shadow: 0 0 10px ${({ index }) => {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#6a67ce"]
    return colors[index % colors.length]
  }};
`

const LoadingCircles = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`

const LogoutBtn = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 50, 50, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.3);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

  &:hover {
    background: rgba(255, 50, 50, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Module gradients
const gradients = [
  "linear-gradient(135deg, #eb3349, #f45c43)", // Red
  "linear-gradient(135deg, #FF512F, #DD2476)", // Pink/Red
  "linear-gradient(135deg, #e65c00, #F9D423)", // Orange/Gold
  "linear-gradient(135deg, #da22ff, #9733ee)", // Purple (Accent)
  "linear-gradient(135deg, #FF416C, #FF4B2B)", // Bright Red
  "linear-gradient(135deg, #f857a6, #ff5858)", // Pink/Orange
  "linear-gradient(135deg, #4776E6, #8E54E9)", // Blue/Purple (Accent)
  "linear-gradient(135deg, #00b09b, #96c93d)", // Green (Accent)
]

// Module icons
const moduleIcons = ["◎", "◉", "◈", "⬗", "⬘", "⬙", "⬟", "◉"]

// Generate random stars
const generateStars = (count) => {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
    })
  }
  return stars
}

const Modules = () => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [stars] = useState(() => generateStars(50))
  const [branchCodes, setBranchCodes] = useState([])
  const [selectedModuleLink, setSelectedModuleLink] = useState(null)
  const [error, setError] = useState("")
  const [entitlements, setEntitlements] = useState([])

  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [birthdayData, setBirthdayData] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const navigate = useNavigate()

  // Check authentication at component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    var user

    try {
      user = validate(token)
      const allowedData = user.allowedData()
      console.log(allowedData, "allowedData")
      setBranchCodes(allowedData)

      // **KEY CHANGE: Automatically set branch in localStorage if only one branch**
      if (allowedData && allowedData.length === 1) {
        localStorage.setItem("selected_branch", allowedData[0])
        console.log("Auto-selected single branch:", allowedData[0])
      }
    } catch (err) {
      localStorage.removeItem("access_token")
      navigate(`${import.meta.env.BASE_URL}Login`)
      return
    }

    // Token is valid, proceed with fetching modules
    const allowedModules = user.allowedModules()
    const allowedActions = user.allowedActions()
    console.log(allowedModules, "allowedModules")
    console.log(allowedActions, "allowedActions")
    setLoading(true)

    fetch(`${securityBaseUrl}get_modules/`)
      .then((res) => res.json())
      .then((data) => {
        // Filter modules based on allowed module codes
        const filteredModules = (data.modules || []).filter((module) => allowedModules.includes(module.module_code))

        // Auto-detect role for dashboard access
        try {
          const decoded = jwtDecode(token);
          const primaryRole = user.allowedActions()
          const additionalRoles = user.allowedActions() || [];

          if (primaryRole === "SD-R-CEO" || additionalRoles.includes("SD-R-CEO")) {
            filteredModules.push({
              module_code: "DASHBOARD",
              module_name: "Dashboard",
              module_link: `${import.meta.env.BASE_URL}dashboard`,
              description: "View key metrics and performance indicators",
              // Use a custom icon or let it pick from defaults
            });
          }
        } catch (e) {
          console.error("Error decoding token for role check", e);
        }

        console.log(filteredModules, "filteredModules")

        // Check if user has access to only one module
        if (filteredModules.length === 1) {
          const singleModule = filteredModules[0]
          // Redirect to that module
          handleModuleRedirect(singleModule.module_link)
          return
        }

        setModules(filteredModules)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setLoading(false)
      })
  }, [navigate])

  // Fetch Profile Image Function
  const fetchProfileImage = async (fileId, token) => {
    if (!fileId) return null;
    try {
      const imageResponse = await fetch(`${securityBaseUrl}get_file/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (imageResponse.ok) {
        const blob = await imageResponse.blob()
        return URL.createObjectURL(blob)
      }
    } catch (imgErr) {
      console.error("Failed to load profile image", imgErr)
    }
    return null;
  };

  // Check for birthdays
  useEffect(() => {
    const checkBirthday = async () => {
      try {
        const token = localStorage.getItem("access_token")
        // Using a hypothetical endpoint based on requirements. 
        // User should verify the actual endpoint path.
        const response = await fetch(`${securityBaseUrl}employees_birthdays_today/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.count > 0 && data.birthdays?.length > 0) {
            const birthdays = data.birthdays

            // Fetch images for all birthdays in parallel using the new function
            const birthdaysWithImages = await Promise.all(birthdays.map(async (person) => {
              const fileId = person.profileImage;
              const imageUrl = await fetchProfileImage(fileId, token);
              return { ...person, imageUrl };
            }));

            setBirthdayData(birthdaysWithImages)
            setShowBirthdayModal(true)
          }
        }
      } catch (err) {
        console.error("Error checking birthday:", err)
      }
    }

    checkBirthday()
  }, [])

  // Handle module click
  const handleModuleClick = (moduleLink) => {
    setError("");

    if (!branchCodes || branchCodes.length === 0) {
      setError("No branch codes found. Please contact admin.");
      return;
    }

    if (branchCodes.length === 1) {
      // Set only if branch exists
      const branch = branchCodes[0];
      if (branch) {
        localStorage.setItem("selected_branch", branch);
      }
      handleModuleRedirect(moduleLink);
    } else {
      // Multiple branches → wait for dropdown selection
      setSelectedModuleLink(moduleLink);
    }
  };


  useEffect(() => {
    if (branchCodes.length > 0) {
      const codesParam = branchCodes.join(",")
      fetch(`${securityBaseUrl}get_data_entitlements?branchCodes=${codesParam}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Branch Names:", data.dataEntitlements)
          setEntitlements(data.dataEntitlements || [])
        })
        .catch((err) => console.error("Entitlements fetch error:", err))
    }
  }, [branchCodes])

  // Handle module redirection
  const handleModuleRedirect = (moduleLink) => {
    // If link is internal (starts with /)
    if (moduleLink.startsWith("/")) {
      navigate(moduleLink)
    } else {
      // For external links that need to be in the same tab
      window.location.href = moduleLink
    }
  }

  // Generate mock descriptions if they're not provided
  const getDescription = (name) => {
    const descriptions = {
      Security: "Access security settings and permissions for your organization",
      Users: "Manage user accounts and role assignments",
      Reports: "Generate and view analytics reports and insights",
      Dashboard: "View key metrics and performance indicators",
      Settings: "Configure system-wide preferences and options",
      "Shanmuga Diagnostics": "Access and manage all diagnostic services and reports",
      "SD Lab": "Manage laboratory tests and results",
      "SD Imaging": "View and analyze diagnostic imaging studies",
      "SD Reports": "Generate comprehensive diagnostic reports",
    }
    return descriptions[name] || `Access and manage ${name} diagnostic services`
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_payload");
    localStorage.removeItem("selected_branch");
    navigate(`${import.meta.env.BASE_URL}login`);
  };

  if (loading) {
    return (
      <Container>
        <Orb1 />
        <Orb2 />
        <Orb3 />
        <Stars>
          {stars.map((star) => (
            <Star
              key={star.id}
              size={star.size}
              opacity={star.opacity}
              top={star.top}
              left={star.left}
              duration={star.duration}
            />
          ))}
        </Stars>
        <LoadingAnimation>
          <LoadingCircles>
            {[0, 1, 2, 3].map((i) => (
              <LoadingCircle key={i} index={i} />
            ))}
          </LoadingCircles>
          <LoadingText>Loading Shanmuga Diagnostics modules...</LoadingText>
        </LoadingAnimation>
      </Container>
    )
  }

  return (
    <Container>
      <Orb1 />
      <Orb2 />
      <Orb3 />
      <Stars>
        {stars.map((star) => (
          <Star
            key={star.id}
            size={star.size}
            opacity={star.opacity}
            top={star.top}
            left={star.left}
            duration={star.duration}
          />
        ))}
      </Stars>
      <ContentWrapper>
        <LogoutBtn onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </LogoutBtn>
        <HeaderSection>
          <Title>Welcome to <span>Shanmuga Innovations</span></Title>
        </HeaderSection>

        {error && <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}

        {!selectedModuleLink && (
          <ModulesWrapper>
            {modules.length > 0 ? (
              modules.map((module, index) => (
                <ModuleCard
                  key={module.module_code}
                  gradient={gradients[index % gradients.length]}
                  index={index}
                  onClick={() => handleModuleClick(module.module_link)}
                >
                  <ModuleIcon gradient={gradients[index % gradients.length]}>
                    {moduleIcons[index % moduleIcons.length]}
                  </ModuleIcon>
                  <ModuleName>{module.module_name}</ModuleName>
                  <ModuleDescription>{module.description || getDescription(module.module_name)}</ModuleDescription>
                  <ActionSection>
                    <LaunchButton gradient={gradients[index % gradients.length]}>
                      Launch <Arrow>→</Arrow>
                    </LaunchButton>
                    <Badge>v{module.version || "1.0"}</Badge>
                  </ActionSection>
                </ModuleCard>
              ))
            ) : (
              <div style={{ textAlign: "center", width: "100%", padding: "2rem" }}>
                <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "1.1rem" }}>
                  No Shanmuga Diagnostics modules available for your account.
                </p>
              </div>
            )}
          </ModulesWrapper>
        )}

        {selectedModuleLink && branchCodes.length > 1 && (
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ color: "#fff", marginBottom: "0.5rem", fontWeight: "500" }}>Select a branch to proceed:</p>
            <select
              onChange={(e) => {
                const selected = e.target.value
                if (selected) {
                  localStorage.setItem("selected_branch", selected)
                  handleModuleRedirect(selectedModuleLink)
                }
              }}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                background: "#333",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
              }}
            >
              <option value="">-- Select Branch --</option>
              {entitlements.map(({ DataEntitlementsCode, DataEntitlements }) => (
                <option key={DataEntitlementsCode} value={DataEntitlementsCode}>
                  {DataEntitlements || DataEntitlementsCode}
                </option>
              ))}
            </select>
          </div>
        )}

        {showBirthdayModal && (
          <BirthdayModal
            birthdayData={birthdayData}
            profileImageUrl={profileImageUrl}
            onClose={() => setShowBirthdayModal(false)}
          />
        )}
      </ContentWrapper>
    </Container>
  )
}

export default Modules
