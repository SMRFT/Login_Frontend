import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import HospitalLogo from './Images/Shinova.png';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 50px rgba(235, 51, 73, 0.2); }
  50% { box-shadow: 0 0 80px rgba(235, 51, 73, 0.4); }
`;

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at center, #1a0505 0%, #000000 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', 'Inter', sans-serif;
  overflow: hidden;
  position: relative;
  color: #fff;
`;

const BackgroundGraphic = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120vw;
  height: 120vw;
  background: radial-gradient(circle, rgba(235, 51, 73, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
  pointer-events: none;
`;

const CircleDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(235, 51, 73, 0.05);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;

  &:nth-child(1) { width: 400px; height: 400px; }
  &:nth-child(2) { width: 600px; height: 600px; border-color: rgba(235, 51, 73, 0.03); }
  &:nth-child(3) { width: 900px; height: 900px; border-color: rgba(235, 51, 73, 0.02); }
`;

const ContentWrapper = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  animation: ${fadeIn} 1s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const LogoContainer = styled.div`
  width: 300px; // Very large logo container
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
  animation: ${float} 6s ease-in-out infinite;

  /* Central Glow behind logo - mimics a spotlight */
  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(235, 51, 73, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: ${pulseGlow} 4s ease-in-out infinite;
  }

  /* No heavy borders, just the logo floating */
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 15px 30px rgba(235, 51, 73, 0.15));
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const BrandTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(135deg, #eb3349 0%, #F45C43 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  max-width: 600px;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const LoginButton = styled.button`
  background: linear-gradient(to right, #eb3349, #F45C43);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 3rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(235, 51, 73, 0.3);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 4rem;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 40px rgba(235, 51, 73, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const FeaturesRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 150px;
  padding: 1rem;
  border-radius: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(235, 51, 73, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #eb3349;
  border: 1px solid rgba(235, 51, 73, 0.3);
  
  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }
`;

const FeatureText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <BackgroundGraphic />
      {/* Decorative concentric circles to frame the logo */}
      <CircleDecoration />
      <CircleDecoration />
      <CircleDecoration />

      <ContentWrapper>
        <LogoContainer>
          <img src={HospitalLogo} alt="Shinova Logo" />
        </LogoContainer>

        <BrandTitle>Shanmuga Innovations</BrandTitle>
        <Tagline>
          Pioneering the future of healthcare technology with secure, intelligent, and compassionate solutions.
        </Tagline>

        <LoginButton onClick={() => navigate(`${import.meta.env.BASE_URL}login`)}>
          <span>Secure Portal Login</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </LoginButton>

        <FeaturesRow>
          <FeatureItem>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            </FeatureIcon>
            <FeatureText>Emergency</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </FeatureIcon>
            <FeatureText>Diagnostics</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </FeatureIcon>
            <FeatureText>Reports</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </FeatureIcon>
            <FeatureText>Secure</FeatureText>
          </FeatureItem>
        </FeaturesRow>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Landing;