import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ShieldCheck, Activity, Database, Server, ChevronRight } from 'lucide-react';
import HospitalLogo from './Images/Shinova.png';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const floatDelayed = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// --- Styled Components ---
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #0f172a; /* Deep Slate Background */
  display: flex;
  font-family: 'Outfit', 'Inter', sans-serif;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  color: #fff;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const BackgroundGraphic = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 40%);
  z-index: 0;
  pointer-events: none;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  z-index: 10;
  animation: ${fadeIn} 1s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (max-width: 1200px) {
    padding: 2rem;
  }

  @media (max-width: 900px) {
    padding: 2rem;
    padding-bottom: 0;
    align-items: center;
    text-align: center;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  padding: 4rem;

  @media (max-width: 900px) {
    padding: 2rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
    min-height: auto;
  }
`;

const LogoContainer = styled.div`
  width: 180px;
  margin-bottom: 2rem;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(6, 182, 212, 0.3));
  }
`;

const BrandTitle = styled.h1`
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  span {
    background: linear-gradient(135deg, #06b6d4 0%, #ef4444 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 500px;
  @media (max-width: 1200px) {
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0284c7);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(6, 182, 212, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Glassmorphism Cards for Right Panel */
const GlassCard = styled.div`
  background: rgba(30, 41, 59, 0.4); /* Slate 800 with opacity */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainStatsCard = styled(GlassCard)`
  position: relative;
  width: 320px;
  height: 400px;
  z-index: 2;
  animation: ${float} 6s ease-in-out infinite;
  border-top: 1px solid rgba(6, 182, 212, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(239, 68, 68, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #06b6d4;
    margin-bottom: 1rem;
  }

  @media (max-width: 1200px) {
    width: 280px;
    height: 340px;
  }

  @media (max-width: 900px) {
    width: 280px;
    height: 350px;
  }
`;

const FloatingCard1 = styled(GlassCard)`
  position: absolute;
  width: 250px;
  top: 10%;
  right: 10%;
  z-index: 1;
  animation: ${floatDelayed} 8s ease-in-out infinite 1s;
  border-left: 1px solid rgba(239, 68, 68, 0.3);

  @media (max-width: 900px) {
    display: none;
  }
`;

const FloatingCard2 = styled(GlassCard)`
  position: absolute;
  width: 260px;
  bottom: 15%;
  left: 5%;
  z-index: 3;
  animation: ${floatDelayed} 7s ease-in-out infinite 2s;
  border-right: 1px solid rgba(6, 182, 212, 0.3);

  @media (max-width: 900px) {
    display: none;
  }
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(30, 41, 59, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 0.85rem;
      color: #94a3b8;
    }
    
    .value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #f8fafc;
    }
  }
`;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <BackgroundGraphic />

      <LeftPanel>
        <LogoContainer>
          <img src={HospitalLogo} alt="Shinova Logo" />
        </LogoContainer>

        <BrandTitle>
          Next Generation <br />
          <span>Healthcare Tech.</span>
        </BrandTitle>

        <Tagline>
          Secure, intelligent, and deeply integrated platforms powering the future of medical innovation and operational excellence.
        </Tagline>

        <LoginButton onClick={() => navigate(`${import.meta.env.BASE_URL}login`)}>
          Access Secure Portal
          <ChevronRight size={20} />
        </LoginButton>
      </LeftPanel>

      <RightPanel>
        <MainStatsCard>
          <div className="icon-wrapper">
            <ShieldCheck size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>End-to-End Security</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>Enterprise-grade encryption protecting sensitive analytical records.</p>
        </MainStatsCard>

        <FloatingCard1>
          <StatRow>
            <div className="stat-icon" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)' }}>
              <Activity size={20} />
            </div>
            <div className="stat-info">
              <span className="label">System Uptime</span>
              <span className="value">99.99%</span>
            </div>
          </StatRow>
        </FloatingCard1>

        <FloatingCard2>
          <StatRow>
            <div className="stat-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
              <Database size={20} />
            </div>
            <div className="stat-info">
              <span className="label">Live Data Streams</span>
              <span className="value">Active</span>
            </div>
          </StatRow>
        </FloatingCard2>
      </RightPanel>

    </PageContainer>
  );
};

export default Landing;