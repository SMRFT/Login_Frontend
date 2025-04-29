import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { validate } from "jsauth";
import { useNavigate } from 'react-router-dom'; // Import for navigation
const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bgAnimation = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(10px, -10px); }
  50% { transform: translate(0, 0); }
  75% { transform: translate(-10px, 10px); }
  100% { transform: translate(0, 0); }
`;

const orb1Move = keyframes`
  0% { transform: translate(0, 0); opacity: 0.5; }
  50% { transform: translate(-30px, 30px); opacity: 0.7; }
  100% { transform: translate(0, 0); opacity: 0.5; }
`;

const orb2Move = keyframes`
  0% { transform: translate(0, 0); opacity: 0.4; }
  50% { transform: translate(40px, -40px); opacity: 0.6; }
  100% { transform: translate(0, 0); opacity: 0.4; }
`;

const orb3Move = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
  50% { transform: translate(-50px, -20px) rotate(180deg); opacity: 0.5; }
  100% { transform: translate(0, 0) rotate(360deg); opacity: 0.3; }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a103c, #2d1f5b, #222b4a);
  background-size: 400% 400%;
  animation: ${gradientMove} 15s ease infinite;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
`;

const BackgroundOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
`;

const Orb1 = styled(BackgroundOrb)`
  width: 300px;
  height: 300px;
  background: rgba(255, 107, 107, 0.3);
  top: -50px;
  right: -50px;
  animation: ${orb1Move} 10s ease-in-out infinite;
`;

const Orb2 = styled(BackgroundOrb)`
  width: 400px;
  height: 400px;
  background: rgba(78, 205, 196, 0.2);
  bottom: -100px;
  left: -100px;
  animation: ${orb2Move} 15s ease-in-out infinite;
`;

const Orb3 = styled(BackgroundOrb)`
  width: 250px;
  height: 250px;
  background: rgba(106, 103, 206, 0.25);
  top: 40%;
  right: 10%;
  animation: ${orb3Move} 12s ease-in-out infinite;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: ${props => props.opacity};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${pulse} ${props => props.duration}s ease-in-out infinite;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  animation: ${fadeIn} 1s ease-out;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(to right, #ff6b6b, #ffce5c, #4ecdc4, #6a67ce);
  background-size: 300% 300%;
  animation: ${gradientMove} 6s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1px;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
`;

const ModulesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
`;

const glassMorphism = `
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
`;

// Changed from 'a' tag to 'div'
const ModuleCard = styled.div`
  position: relative;
  ${glassMorphism}
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  height: 180px;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: ${({ index }) => `${index * 0.1}s`};
  opacity: 0;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ gradient }) => gradient};
    background-size: 200% 200%;
    animation: ${gradientMove} 3s ease infinite;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ModuleIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${({ gradient }) => gradient};
  background-size: 200% 200%;
  animation: ${gradientMove} 3s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ModuleName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const ModuleDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  flex-grow: 1;
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const LaunchButton = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ gradient }) => {
    // Extract main color from gradient
    const matches = gradient.match(/#[a-f0-9]{6}|#[a-f0-9]{3}/gi);
    return matches ? matches[0] : '#4ecdc4';
  }};
`;

const Arrow = styled.span`
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  
  ${ModuleCard}:hover & {
    transform: translateX(5px);
  }
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
`;

const LoadingAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4rem 0;
  position: relative;
  z-index: 2;
`;

const LoadingCircle = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${({ index }) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6a67ce'];
    return colors[index % colors.length];
  }};
  border-radius: 50%;
  margin: 0 5px;
  animation: ${float} 1s ease-in-out infinite;
  animation-delay: ${({ index }) => `${index * 0.2}s`};
  box-shadow: 0 0 10px ${({ index }) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6a67ce'];
    return colors[index % colors.length];
  }};
`;

const LoadingCircles = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

// Module gradients
const gradients = [
  'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
  'linear-gradient(135deg, #4ecdc4, #2cbfc7)',
  'linear-gradient(135deg, #45b7d1, #2a93bc)',
  'linear-gradient(135deg, #6a67ce, #9183ff)',
  'linear-gradient(135deg, #ffad5b, #ffcf5c)',
  'linear-gradient(135deg, #cb68ff, #c47aff)',
  'linear-gradient(135deg, #ff9a8b, #ff6a88)',
  'linear-gradient(135deg, #6bd273, #8dde6b)',
];

// Module icons (you can replace these with actual icons)
const moduleIcons = ['◎', '◉', '◈', '⬗', '⬘', '⬙', '⬟', '◉'];

// Generate random stars
const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2
    });
  }
  return stars;
};

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stars] = useState(() => generateStars(50));
  const navigate = useNavigate(); // Hook for navigation

  const token = localStorage.getItem("access_token");

  const user = validate(token);
  console.log("Allowed Modules:", user.allowedModules());
  const allowedModules = user.allowedModules();

  useEffect(() => {
    setLoading(true);
    fetch(`${securityBaseUrl}get_modules/`)
      .then((res) => res.json())
      .then((data) => {
        // Filter modules based on allowed module codes
        const filteredModules = (data.modules || []).filter(module => 
          allowedModules.includes(module.module_code)
        );
        setModules(filteredModules);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);
  
  // Handle module click
  const handleModuleClick = (moduleLink) => {
    // If link is internal (starts with /)
    if (moduleLink.startsWith('/')) {
      navigate(moduleLink);
    } else {
      // For external links that need to be in the same tab
      window.location.href = moduleLink;
    }
  };
  
  // Generate mock descriptions if they're not provided
  const getDescription = (name) => {
    const descriptions = {
      'Security': 'Access security settings and permissions for your organization',
      'Users': 'Manage user accounts and role assignments',
      'Reports': 'Generate and view analytics reports and insights',
      'Dashboard': 'View key metrics and performance indicators',
      'Settings': 'Configure system-wide preferences and options',
      'Shanmuga Diagnostics': 'Access and manage all diagnostic services and reports',
      'SD Lab': 'Manage laboratory tests and results',
      'SD Imaging': 'View and analyze diagnostic imaging studies',
      'SD Reports': 'Generate comprehensive diagnostic reports',
    };
    
    return descriptions[name] || `Access and manage ${name} diagnostic services`;
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
    );
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
          <Title>Welcome To Shanmuga Hospital</Title>
        </HeaderSection>
        
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
                <ModuleDescription>
                  {module.description || getDescription(module.module_name)}
                </ModuleDescription>
                <ActionSection>
                  <LaunchButton gradient={gradients[index % gradients.length]}>
                    Launch <Arrow>→</Arrow>
                  </LaunchButton>
                  <Badge>v{module.version || '1.0'}</Badge>
                </ActionSection>
              </ModuleCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                No Shanmuga Diagnostics modules available for your account.
              </p>
            </div>
          )}
        </ModulesWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default Modules;