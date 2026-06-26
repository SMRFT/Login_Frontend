"use client"

import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { validate } from "jsauth"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import BirthdayModal from "./BirthdayModal"
// import bgImage from "./Images/cyber_bg.png"

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
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%);
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  animation: none;
  color: #06b6d4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  font-family: 'Outfit', 'Inter', sans-serif;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0;
    overflow: hidden;
  }
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
  background: rgba(239, 68, 68, 0.15); /* Red glow */
  top: -50px;
  right: -50px;
  animation: ${orb1Move} 10s ease-in-out infinite;
`

const Orb2 = styled(BackgroundOrb)`
  width: 400px;
  height: 400px;
  background: rgba(6, 182, 212, 0.1); /* Cyan glow */
  bottom: -100px;
  left: -100px;
  animation: ${orb2Move} 15s ease-in-out infinite;
`

const Orb3 = styled(BackgroundOrb)`
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.05);
  top: 40%;
  right: 10%;
  animation: ${orb3Move} 12s ease-in-out infinite;
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 4rem 2rem;
  scroll-behavior: smooth;

  /* Custom Premium Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.3), rgba(239, 68, 68, 0.3), transparent);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.6), rgba(239, 68, 68, 0.6), transparent);
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
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
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 2;
  padding-left: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: left;
  @media (max-width: 1024px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.25rem; /* Smaller to fit same row */
  }
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  
  span.brand {
    color: transparent;
    background: linear-gradient(135deg, #06b6d4, #ef4444);
    -webkit-background-clip: text;
    background-clip: text;
  }
`

const UserNameHighlight = styled.span`
  color: transparent;
  background: linear-gradient(135deg, #22d3ee, #38bdf8); /* bright cyan/blue */
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 800;
`

const ModulesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    gap: 1.2rem;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
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
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.3);
    
    &::after {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.5), rgba(239, 68, 68, 0.5));
    }
  }

  @media (max-width: 480px) {
    padding: 1.2rem;
    min-height: auto;
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



// Module gradients mapped to the new Red/Cyan Theme
const gradients = [
  "linear-gradient(135deg, #06b6d4, #0ea5e9)", // Cyan to light blue
  "linear-gradient(135deg, #ef4444, #f43f5e)", // Red to rose
  "linear-gradient(135deg, #06b6d4, #14b8a6)", // Cyan to teal
  "linear-gradient(135deg, #ef4444, #f97316)", // Red to orange
  "linear-gradient(135deg, #0891b2, #0d9488)", // Dark cyan to dark teal
  "linear-gradient(135deg, #dc2626, #e11d48)", // Dark red to dark rose
  "linear-gradient(135deg, #22d3ee, #38bdf8)", // Light cyan to light blue
  "linear-gradient(135deg, #f87171, #fb7185)", // Light red to light rose
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

// Profile Dropdown Styles
const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  flex-wrap: nowrap;

  @media (max-width: 640px) {
    align-self: flex-start; /* Align with title on mobile stack */
    gap: 0.6rem;
  }
  
  @media (max-width: 480px) {
    width: auto;
    gap: 0.4rem;
  }
`

const ProfileMenuContainer = styled.div`
  position: relative;
`

const LogoutBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  height: 45px; /* Match ProfileIconBtn height */
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    height: 40px;
  }
`

const ProfileIconBtn = styled.button`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(6, 182, 212, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(6, 182, 212, 0.2);
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 150px;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

const DropdownItem = styled.button`
  background: transparent;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
    color: #06b6d4;
  }

  &.logout {
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }
`

const BranchSelectionContainer = styled.div`
  width: 95%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 3rem;
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 1rem auto;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    width: 100%;
    border-radius: 20px;
    margin: 0;
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
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.5);
    transform: translateY(-4px);
  }

  span.icon {
    font-size: 1.2rem;
  }
`
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
  const [userName, setUserName] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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

        const res = await fetch(`${securityBaseUrl}get_modules/`)
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
    sessionStorage.removeItem("birthday_shown");
    setSelectedBranch(null);
    navigate(`${import.meta.env.BASE_URL}login`);
  };

  const handleProfileClick = () => {
    navigate(`${import.meta.env.BASE_URL}profile`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('#profile-menu-container')) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

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
        <HeaderSection>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Title>
              Welcome {userName ? <UserNameHighlight>{userName}</UserNameHighlight> : "to"}{" "}
              <span className="brand">Shanmuga Innovations</span>
            </Title>
            {selectedBranch && (
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Active Branch: <span style={{ color: "#06b6d4", fontWeight: "600" }}>{selectedBranch}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("selected_branch");
                    setSelectedBranch(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    marginLeft: "1rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    textDecoration: "underline"
                  }}
                >
                  Change Branch
                </button>
              </p>
            )}
          </div>

          <HeaderActions>
            <ProfileMenuContainer id="profile-menu-container">
              <ProfileIconBtn onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </ProfileIconBtn>
              <DropdownMenu isOpen={isProfileOpen}>
                <DropdownItem onClick={handleProfileClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Profile
                </DropdownItem>
              </DropdownMenu>
            </ProfileMenuContainer>

            <LogoutBtn onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </LogoutBtn>
          </HeaderActions>
        </HeaderSection>

        {error && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>{error}</div>}

        {/* Branch Selection View */}
        {!selectedBranch && branchCodes.length > 1 && (
          <BranchSelectionContainer>
            <h2 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1.8rem" }}>Select Your Branch</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginBottom: "2rem" }}>Please select a branch to view available modules.</p>

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
