import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
  }

  body {
    overflow-x: hidden;
    background: #000;
  }
`;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

// Project Data
const projects = [
  { name: "Diagnostics", url: "/Diagnostics", note: "Complete diagnostic solution..." },
  // { name: "Cosmetology", url: "https://salemcosmeticclinic.netlify.app/", note: "Advanced cosmetology platform..." },
  { name: "Indicator", url: "/indicators", note: "Quality indicator reporting system..." },
  { name: "Tracker", url: "/tracker", note: "System to track performance..." },
  { name: "Insurance", url: "/insurance", note: "Insurance management solution..." },
  { name: "Milestone", url: "/milestone", note: "Childhood disorder tracking tool..." },
  { name: "Login", url: "/login", note: "Login management system..." },
  { name: "Global", url: "/global", note: "Global management system..." },
];

const glowColors = ["#06b6d4", "#ef4444", "#06b6d4", "#ef4444", "#06b6d4", "#ef4444", "#06b6d4", "#ef4444"];

// Container and orbs
const OuterContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  background-size: 400% 400%;
  animation: ${gradientMove} 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
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
  background: rgba(239, 68, 68, 0.2); /* Red glow */
  top: -50px;
  right: -50px;
  animation: ${orb1Move} 10s ease-in-out infinite;
`;

const Orb2 = styled(BackgroundOrb)`
  width: 400px;
  height: 400px;
  background: rgba(6, 182, 212, 0.15); /* Cyan glow */
  bottom: -100px;
  left: -100px;
  animation: ${orb2Move} 15s ease-in-out infinite;
`;

const Orb3 = styled(BackgroundOrb)`
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.05);
  top: 30%;
  left: 40%;
  animation: ${orb3Move} 20s linear infinite;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 1200px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: transparent;
  background: linear-gradient(to right, #06b6d4, #ef4444, #06b6d4, #ef4444);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ${gradientMove} 8s ease infinite;
  text-shadow: 0 2px 10px rgba(6, 182, 212, 0.4);
  letter-spacing: 1px;
  transform: translateY(20px);
  opacity: 0;
  transition: all 1s ease;
  
  .loaded & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  perspective: 1000px;
`;

const FloatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(1deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const CardWrapper = styled.div`
  animation: ${FloatingAnimation} ${props => 5 + props.index % 3}s ease-in-out infinite;
  animation-delay: ${props => props.index * 0.2}s;
`;

// Unique hexagonal card design
const HexagonCard = styled.div`
  position: relative;
  width: 180px;
  height: 200px;
  margin: 15px;
  perspective: 1000px;
  cursor: pointer;
`;

const HexagonInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  
  ${HexagonCard}:hover & {
    transform: rotateY(180deg);
  }
`;

const HexagonFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1); /* Glassmorphism base */
    backdrop-filter: blur(10px);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    z-index: -1;
  }
`;

const HexagonFront = styled(HexagonFace)`
  &:before {
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 20px ${props => props.glow}, 0 0 15px ${props => props.glow};
  }
`;

const HexagonBack = styled(HexagonFace)`
  transform: rotateY(180deg);
  
  &:before {
    background: rgba(255, 255, 255, 0.15); /* Slightly darker glass for back */
    border: 1px solid ${props => props.glow};
    box-shadow: inset 0 0 30px ${props => props.glow}, 0 0 20px ${props => props.glow};
  }
`;

const CardGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: ${props => props.glow};
  opacity: 0.1;
  filter: blur(20px);
  transition: opacity 0.3s ease;
  z-index: -1;
  
  ${HexagonCard}:hover & {
    opacity: 0.2;
  }
`;

const CardName = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 10px ${props => props.glow};
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: 1px;
`;

const CardNote = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 90%;
  padding: 0 5px;
`;

const ArrowIcon = styled.span`
  position: absolute;
  bottom: 20px;
  width: 20px;
  height: 20px;
  background: white;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' /%3E%3C/svg%3E") center/contain no-repeat;
  mask-size: cover;
  transition: transform 0.3s ease;
  
  ${HexagonCard}:hover & {
    transform: translateX(5px);
  }
`;

// Additional Stars Component
const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
`;

function Landing() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Create an array of 50 random stars
  const starElements = Array.from({ length: 50 }, (_, i) => {
    const size = Math.random() * 2 + 1;
    const opacity = Math.random() * 0.5 + 0.1;
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    return (
      <Star
        key={i}
        size={size}
        opacity={opacity}
        top={top}
        left={left}
      />
    );
  });

  return (
    <>
      <GlobalStyle />
      <OuterContainer>
        <Orb1 />
        <Orb2 />
        <Orb3 />
        <Stars>{starElements}</Stars>
        <ContentWrapper>
          <HeaderSection className={isLoaded ? 'loaded' : ''}>
            <Title>Shanmuga Innovations</Title>
          </HeaderSection>
          <CardGrid>
            {projects.map((project, index) => (
              <CardWrapper key={index} index={index}>
                <HexagonCard
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => window.open(project.url, "_blank")}
                >
                  <HexagonInner>
                    <HexagonFront glow={glowColors[index % glowColors.length]}>
                      <CardGlow glow={glowColors[index % glowColors.length]} />
                      <CardName glow={glowColors[index % glowColors.length]}>{project.name}</CardName>
                      <ArrowIcon />
                    </HexagonFront>
                    <HexagonBack glow={glowColors[index % glowColors.length]}>
                      <CardNote>{project.note}</CardNote>
                    </HexagonBack>
                  </HexagonInner>
                </HexagonCard>
              </CardWrapper>
            ))}
          </CardGrid>
        </ContentWrapper>
      </OuterContainer>
    </>
  );
}

export default Landing;