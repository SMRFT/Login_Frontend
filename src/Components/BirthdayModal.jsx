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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease;
`;

const ModalCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%);
    z-index: 0;
    border-radius: 24px 24px 50% 50%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 120px;
  height: 120px;
  margin: 1rem auto;
  border-radius: 50%;
  padding: 4px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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

const Title = styled.h2`
  font-size: 2rem;
  margin: 1rem 0 0.5rem;
  background: linear-gradient(to right, #f83600 0%, #f9d423 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const EmployeeName = styled.h3`
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0.5rem 0 0.25rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
`;

const DepartmentText = styled.p`
  color: #64748b;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
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

  // Normalize input to array
  const birthdays = Array.isArray(birthdayData) ? birthdayData : (birthdayData ? [birthdayData] : []);
  const currentPerson = birthdays[currentIndex];

  useEffect(() => {
    // Generate confetti
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
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
            src={currentPerson.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPerson.employeeName || "User"}&backgroundColor=c0aede`}
            alt="Profile"
          />
        </ProfileImageContainer>

        <Title>Happy Birthday!</Title>
        <EmployeeName>{currentPerson.employeeName || "Employee"}</EmployeeName>
        {currentPerson.department && <DepartmentText>{currentPerson.department}</DepartmentText>}
        <Subtitle>Wishing you a fantastic day filled with joy and success!</Subtitle>

        {birthdays.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &lt;
            </button>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
              {currentIndex + 1} / {birthdays.length}
            </span>
            <button
              onClick={handleNext}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 'bold' }}
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
