import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 17, 0.85);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease;
`;

const ModalCard = styled.div`
  background: rgba(15, 23, 42, 0.9);
  width: 90%;
  max-width: 500px;
  border-radius: 28px;
  padding: 3rem 2rem 2rem;
  
  @media (max-width: 480px) {
    padding: 2.5rem 1.25rem 1.5rem;
    width: 95%;
  }
  text-align: center;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
              0 0 40px rgba(6, 182, 212, 0.15);
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);
    z-index: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  color: #94a3b8;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: rotate(90deg);
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 130px;
  height: 130px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #06b6d4, #ef4444);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: ${popIn} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  background: #0f172a;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const getInitials = (name) => {
  if (!name || name === "Employee") return "🎉";
  const names = name.split(' ').filter(n => n.length > 0);
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
};

const Title = styled.h2`
  font-size: 2.5rem;
  margin: 1rem 0 0.5rem;
  background: linear-gradient(to right, #06b6d4 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const EmployeeName = styled.h3`
  font-size: 1.75rem;
  color: #f8fafc;
  margin: 0.5rem 0 0.25rem;
  font-weight: 700;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const DepartmentText = styled.p`
  color: #06b6d4;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
`;

const ConfettiPiece = styled.div`
  position: absolute;
  width: 8px;
  height: 16px;
  background-color: ${props => props.color};
  left: ${props => props.left}%;
  top: -20px;
  animation: ${confettiFall} ${props => props.duration}s linear infinite;
  z-index: 2001; /* Above modal */
  opacity: 0.8;
  pointer-events: none;
`;

const BirthdayModal = ({ onClose, birthdayData }) => {
  const [confetti, setConfetti] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uniqueSessionSeed] = useState(() => Math.random().toString(36).substring(7));

  // Normalize input to array
  const birthdays = Array.isArray(birthdayData) ? birthdayData : (birthdayData ? [birthdayData] : []);
  const currentPerson = birthdays[currentIndex];

  useEffect(() => {
    // Generate confetti
    const colors = ['#06b6d4', '#ef4444', '#14b8a6', '#f43f5e', '#0ea5e9'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % birthdays.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + birthdays.length) % birthdays.length);
  };

  if (!currentPerson) return null;

  return (
    <Overlay>
      {confetti.map(c => (
        <ConfettiPiece key={c.id} left={c.left} duration={c.duration} color={c.color} />
      ))}
      <ModalCard>
        <CloseButton onClick={onClose}>
          <X size={20} color="#64748b" />
        </CloseButton>

        <ProfileImageContainer>
          <ProfileImage
            src={currentPerson.imageUrl || `https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=300&q=80`}
            alt="Profile"
          />
        </ProfileImageContainer>

        <Title>Happy Birthday!</Title>
        <EmployeeName>{currentPerson.employeeName || "Employee"}</EmployeeName>
        {currentPerson.department && <DepartmentText>{currentPerson.department}</DepartmentText>}
        <Subtitle>Wishing you a fantastic day filled with joy and success!</Subtitle>

        {birthdays.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <button
              onClick={handlePrev}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              &lt;
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 600 }}>
              {currentIndex + 1} / {birthdays.length}
            </span>
            <button
              onClick={handleNext}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              &gt;
            </button>
          </div>
        )}

      </ModalCard>
    </Overlay>
  );
};

export default BirthdayModal;
