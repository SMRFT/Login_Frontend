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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

// Layout
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(1100px 550px at 85% -10%, rgba(217, 83, 143, 0.1), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(30, 138, 125, 0.09), transparent 60%),
    linear-gradient(155deg, #FFF3F9 0%, #FDF6FA 50%, #EDF7F4 100%);
  padding: 36px 6vw 80px;
  box-sizing: border-box;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2B2230;
  animation: ${fadeIn} 0.6s ease both;

  @media (max-width: 768px) {
    padding: 24px 5vw 56px;
  }
`

const ContentWrapper = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`

const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const WelcomeTitle = styled.h1`
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
  color: #2B2230;
`

const UserNameHighlight = styled.span`
  background: linear-gradient(120deg, #D9538F 0%, #A83A6E 45%, #1E8A7D 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
`

const BrandSubtitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #9C8A97;
  letter-spacing: 0.06em;
  margin-top: -6px;
`

const BranchRow = styled.div`
  font-size: 13.5px;
  color: #8A7684;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  strong {
    color: #1E8A7D;
    letter-spacing: 0.04em;
  }
`

const ChangeBranchLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #C94F87;
  text-decoration: underline;
  font-weight: 600;
  font-size: 13.5px;
  font-family: inherit;

  &:hover {
    color: #A83A6E;
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid rgba(201, 79, 135, 0.4);
  color: #A83A6E;
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  background: #FFFFFF;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(217, 83, 143, 0.08);
  }
`

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, rgba(217, 83, 143, 0.3), rgba(43, 179, 163, 0.2), transparent);
`

const ErrorBanner = styled.div`
  color: #A83A6E;
  text-align: center;
  padding: 1rem;
  background: #FDF0F4;
  border: 1px solid #F3C9DA;
  border-radius: 12px;
`

// Branch selection
const BranchSelectionContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  padding: 3rem;
  background: #FFFFFF;
  border: 1px solid rgba(201, 79, 135, 0.14);
  border-radius: 28px;
  text-align: center;
  box-shadow: 0 20px 40px -20px rgba(90, 40, 70, 0.25);
  animation: ${fadeIn} 0.6s ease-out;

  h2 {
    color: #2B2230;
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 700;
  }

  p {
    color: #8A7684;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`

const BranchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const BranchButton = styled.button`
  padding: 1.5rem 1rem;
  background: #FFFDFE;
  border: 1.5px solid rgba(43, 179, 163, 0.25);
  border-radius: 16px;
  color: #2B2230;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(43, 179, 163, 0.08);
    border-color: #1E8A7D;
    transform: translateY(-4px);
  }

  span.icon {
    font-size: 1.2rem;
  }
`

// Logout confirmation
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(43, 34, 48, 0.55);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`

const ConfirmCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #EBDDE5;
  border-radius: 24px;
  padding: 2.25rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(90, 40, 70, 0.35);
  animation: ${fadeIn} 0.3s ease;
`

const ConfirmTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
  color: #2B2230;
`

const ConfirmText = styled.p`
  color: #8A7684;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.75rem;
`

const ConfirmButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`

const ConfirmCancelBtn = styled.button`
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #EBDDE5;
  background: #F6EFF3;
  color: #5C4B57;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #EEDFE7;
  }
`

const ConfirmLogoutBtn = styled.button`
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #D9538F, #A83A6E);
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.06);
  }
`

// Module grid
const ModulesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 24px;
`

const ModuleCard = styled.div`
  background: #FFFFFF;
  border: 1px solid rgba(201, 79, 135, 0.14);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  cursor: pointer;
  box-shadow: 0 14px 34px -20px rgba(90, 40, 70, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${({ $index }) => `${$index * 0.05}s`};
  opacity: 0;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 44px -20px rgba(90, 40, 70, 0.4);
  }
`

const ModuleIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$tint};
  border: 1px solid ${props => props.$edge};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$ink};
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.02em;
`

const ModuleTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ModuleName = styled.h3`
  font-weight: 700;
  font-size: 18px;
  color: #2B2230;
  margin: 0;
`

const ModuleDescription = styled.p`
  font-size: 13.5px;
  line-height: 1.65;
  color: #8A7684;
  margin: 0;
`

const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`

const LaunchButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #A83A6E;
  font-weight: 700;
  font-size: 14px;
  transition: color 0.2s ease;

  ${ModuleCard}:hover & {
    color: #D9538F;
  }
`

const Arrow = styled.span`
  display: inline-flex;
  transition: transform 0.2s ease;
  ${ModuleCard}:hover & {
    transform: translateX(4px);
  }
`

const Badge = styled.span`
  background: rgba(43, 179, 163, 0.1);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 11.5px;
  font-weight: 600;
  color: #1E8A7D;
`

// Loading
const LoadingAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`

const LoadingCircles = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const LoadingCircle = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${({ $index }) => {
    const colors = ["#D9538F", "#1E8A7D", "#A83A6E", "#2BB3A3"]
    return colors[$index % colors.length]
  }};
  border-radius: 50%;
  margin: 0 5px;
  animation: ${float} 1s ease-in-out infinite;
  animation-delay: ${({ $index }) => `${$index * 0.2}s`};
`

const LoadingText = styled.p`
  color: #8A7684;
  font-size: 1rem;
  font-weight: 500;
`

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path d="M9 2 H3 V12 H9 M6 7 H13 M13 7 L10.5 4.5 M13 7 L10.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LaunchArrowIcon = () => (
  <svg width="15" height="12" viewBox="0 0 15 12"><path d="M1 6 H13 M13 6 L8.5 1.5 M13 6 L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

// Module glyph tint/edge/ink pairs, alternating pink/teal
const glyphStyles = [
  { tint: 'rgba(217,83,143,0.16)', edge: 'rgba(217,83,143,0.4)', ink: '#A83A6E' },
  { tint: 'rgba(43,179,163,0.14)', edge: 'rgba(43,179,163,0.4)', ink: '#1E8A7D' },
]

// Generate a short glyph from a module name
const glyphFor = (name) => {
  const words = (name || "").trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words.map(w => w[0]).join("").slice(0, 3).toUpperCase()
}

const Modules = () => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [branchCodes, setBranchCodes] = useState([])
  const [error, setError] = useState("")
  const [entitlements, setEntitlements] = useState([])

  const [showBirthdayModal, setShowBirthdayModal] = useState(false)
  const [birthdayData, setBirthdayData] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [userName, setUserName] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem("selected_branch"))
  const navigate = useNavigate()

  // Check authentication at component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        navigate(`${import.meta.env.BASE_URL}Login`)
        return
      }

      let user
      try {
        user = validate(token)
        console.log("User:", user)
        const allowedData = user.allowedData()
        setBranchCodes(allowedData)

        // Decode token to get user name
        const decodedPayload = jwtDecode(token)
        if (decodedPayload.name) {
          setUserName(decodedPayload.name)
        }

        // Automatically set branch in localStorage if only one branch
        if (allowedData && allowedData.length === 1) {
          localStorage.setItem("selected_branch", allowedData[0])
          setSelectedBranch(allowedData[0])
        }

        // Proceed with fetching modules
        const allowedModules = user.allowedModules()
        const allowedActions = user.allowedActions()
        console.log(allowedModules, "allowedModules")
        console.log(allowedActions, "allowedActions")
        setLoading(true)

        const res = await fetch(`${securityBaseUrl}get_modules/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()

        // Filter modules based on allowed module codes
        const filteredModules = (data.modules || []).filter((module) =>
          allowedModules.includes(module.module_code)
        )

        // Auto-detect role for dashboard access
        try {
          const primaryRoles = user.allowedActions()
          if (primaryRoles.includes("SD-R-CEO")) {
            filteredModules.push({
              module_code: "DASHBOARD",
              module_name: "Dashboard",
              module_link: `${import.meta.env.BASE_URL}dashboard`,
              description: "View key metrics and performance indicators",
            })
          }
        } catch (e) {
          console.error("Error checking roles for dashboard", e)
        }

        if (filteredModules.length === 1) {
          handleModuleRedirect(filteredModules[0].module_link)
          return
        }

        setModules(filteredModules)
        setLoading(false)
      } catch (err) {
        console.error("Auth/Fetch error:", err)
        localStorage.removeItem("access_token")
        navigate(`${import.meta.env.BASE_URL}Login`)
      }
    }

    checkAuth()
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

  useEffect(() => {
    const checkBirthday = async () => {
      if (!selectedBranch) return; // Only check after branch is selected
      if (sessionStorage.getItem("birthday_shown")) return; // Only show once per session

      try {
        const token = localStorage.getItem("access_token")
        const response = await fetch(`${securityBaseUrl}employees_birthdays_today/`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.count > 0 && data.birthdays?.length > 0) {
            const birthdays = data.birthdays

            const birthdaysWithImages = await Promise.all(birthdays.map(async (person) => {
              const fileId = person.profileImage;
              const imageUrl = await fetchProfileImage(fileId, token);
              return { ...person, imageUrl };
            }));

            setBirthdayData(birthdaysWithImages)
            setShowBirthdayModal(true)
            sessionStorage.setItem("birthday_shown", "true")
          }
        }
      } catch (err) {
        console.error("Error checking birthday:", err)
      }
    }

    checkBirthday()
  }, [selectedBranch])

  // Handle module click
  const handleModuleClick = (moduleLink) => {
    setError("");
    handleModuleRedirect(moduleLink);
  };


  useEffect(() => {
    if (branchCodes.length > 0) {
      const codesParam = branchCodes.join(",")
      const entitlementsToken = localStorage.getItem("access_token")
      fetch(`${securityBaseUrl}get_data_entitlements?branchCodes=${codesParam}`, {
        headers: { 'Authorization': `Bearer ${entitlementsToken}` }
      })
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
    sessionStorage.removeItem("birthday_shown");
    setSelectedBranch(null);
    navigate(`${import.meta.env.BASE_URL}login`);
  };

  const handleProfileClick = () => {
    navigate(`${import.meta.env.BASE_URL}profile`);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingAnimation>
          <LoadingCircles>
            {[0, 1, 2, 3].map((i) => (
              <LoadingCircle key={i} $index={i} />
            ))}
          </LoadingCircles>
          <LoadingText>Loading Shanmuga Diagnostics modules...</LoadingText>
        </LoadingAnimation>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <BrandColumn>
            <WelcomeTitle>
              Welcome{userName ? <>, <UserNameHighlight>{userName}</UserNameHighlight></> : " to Shanmuga Innovations"}
            </WelcomeTitle>
            <BrandSubtitle>SHANMUGA INNOVATIONS</BrandSubtitle>
            {selectedBranch && (
              <BranchRow>
                <span>Active Branch: <strong>{selectedBranch}</strong></span>
                <ChangeBranchLink
                  onClick={() => {
                    localStorage.removeItem("selected_branch");
                    setSelectedBranch(null);
                  }}
                >
                  Change Branch
                </ChangeBranchLink>
              </BranchRow>
            )}
          </BrandColumn>

          <HeaderActions>
            <LogoutBtn onClick={() => setShowLogoutConfirm(true)}>
              <LogoutIcon />
              Logout
            </LogoutBtn>
          </HeaderActions>
        </HeaderSection>

        <Divider />

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {/* Branch Selection View */}
        {!selectedBranch && branchCodes.length > 1 && (
          <BranchSelectionContainer>
            <h2>Select Your Branch</h2>
            <p>Please select a branch to view available modules.</p>

            <BranchGrid>
              {entitlements.map(({ DataEntitlementsCode, DataEntitlements }) => (
                <BranchButton
                  key={DataEntitlementsCode}
                  onClick={() => {
                    localStorage.setItem("selected_branch", DataEntitlementsCode);
                    setSelectedBranch(DataEntitlementsCode);
                  }}
                >
                  <span className="icon">🏥</span>
                  {DataEntitlements || DataEntitlementsCode}
                </BranchButton>
              ))}
            </BranchGrid>
          </BranchSelectionContainer>
        )}

        {/* Modules View */}
        {(selectedBranch || branchCodes.length === 1) && (
          <ModulesWrapper>
            <ModuleCard $index={0} onClick={handleProfileClick}>
              <ModuleIcon $tint="rgba(217,83,143,0.16)" $edge="rgba(217,83,143,0.4)" $ink="#A83A6E">
                {glyphFor("Profile")}
              </ModuleIcon>
              <ModuleTextGroup>
                <ModuleName>My Profile</ModuleName>
                <ModuleDescription>View and manage your personal profile details</ModuleDescription>
              </ModuleTextGroup>
              <ActionSection>
                <LaunchButton>
                  Launch <Arrow><LaunchArrowIcon /></Arrow>
                </LaunchButton>
                <Badge>Default</Badge>
              </ActionSection>
            </ModuleCard>

            {modules.map((module, index) => {
              const style = glyphStyles[index % glyphStyles.length]
              return (
                <ModuleCard
                  key={module.module_code}
                  $index={index + 1}
                  onClick={() => handleModuleClick(module.module_link)}
                >
                  <ModuleIcon $tint={style.tint} $edge={style.edge} $ink={style.ink}>
                    {glyphFor(module.module_name)}
                  </ModuleIcon>
                  <ModuleTextGroup>
                    <ModuleName>{module.module_name}</ModuleName>
                    <ModuleDescription>{module.description || getDescription(module.module_name)}</ModuleDescription>
                  </ModuleTextGroup>
                  <ActionSection>
                    <LaunchButton>
                      Launch <Arrow><LaunchArrowIcon /></Arrow>
                    </LaunchButton>
                    <Badge>v{module.version || "1.0"}</Badge>
                  </ActionSection>
                </ModuleCard>
              )
            })}
          </ModulesWrapper>
        )}

        {showBirthdayModal && (
          <BirthdayModal
            birthdayData={birthdayData}
            profileImageUrl={profileImageUrl}
            onClose={() => setShowBirthdayModal(false)}
          />
        )}

        {showLogoutConfirm && (
          <ConfirmOverlay onClick={(e) => e.target === e.currentTarget && setShowLogoutConfirm(false)}>
            <ConfirmCard>
              <ConfirmTitle>Log out?</ConfirmTitle>
              <ConfirmText>Are you sure you want to log out of your account?</ConfirmText>
              <ConfirmButtons>
                <ConfirmCancelBtn onClick={() => setShowLogoutConfirm(false)}>Cancel</ConfirmCancelBtn>
                <ConfirmLogoutBtn onClick={handleLogout}>Logout</ConfirmLogoutBtn>
              </ConfirmButtons>
            </ConfirmCard>
          </ConfirmOverlay>
        )}
      </ContentWrapper>
    </PageContainer>
  )
}

export default Modules
