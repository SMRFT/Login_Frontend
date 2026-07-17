import React, { useEffect, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
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
  background: rgba(43, 34, 48, 0.55);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.bgCard};
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
  box-shadow: 0 25px 50px -12px rgba(90, 40, 70, 0.35);
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid ${({ theme }) => theme.borderActive};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(217, 83, 143, 0.14) 0%, transparent 70%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(43, 179, 163, 0.14) 0%, transparent 70%);
    z-index: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(217, 83, 143, 0.08);
  border: 1px solid ${({ theme }) => theme.borderActive};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  color: ${({ theme }) => theme.brandSecondary};

  &:hover {
    background: rgba(217, 83, 143, 0.16);
    color: ${({ theme }) => theme.brandSecondary};
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
  background: linear-gradient(135deg, ${({ theme }) => theme.brandMain}, ${({ theme }) => theme.brandTertiary});
  box-shadow: 0 10px 30px -10px rgba(90, 40, 70, 0.4);
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
  background: linear-gradient(135deg, ${({ theme }) => theme.brandMain}, ${({ theme }) => theme.brandSecondary});
  text-transform: uppercase;
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
  background: linear-gradient(120deg, ${({ theme }) => theme.brandMain} 0%, ${({ theme }) => theme.brandSecondary} 45%, ${({ theme }) => theme.brandTertiary} 100%);
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
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const EmployeeName = styled.h3`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.textPrimary};
  margin: 0.5rem 0 0.25rem;
  font-weight: 700;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const DepartmentText = styled.p`
  color: ${({ theme }) => theme.brandTertiary};
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(201, 79, 135, 0.3);
  background: rgba(217, 83, 143, 0.06);
  color: ${({ theme }) => theme.brandSecondary};
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(217, 83, 143, 0.14);
  }
`;

const PageCounter = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  font-weight: 600;
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
  const theme = useTheme();
  const [confetti, setConfetti] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uniqueSessionSeed] = useState(() => Math.random().toString(36).substring(7));

  // Normalize input to array
  const birthdays = Array.isArray(birthdayData) ? birthdayData : (birthdayData ? [birthdayData] : []);
  const currentPerson = birthdays[currentIndex];

  useEffect(() => {
    // Generate confetti
    const colors = [theme.brandMain, theme.brandSecondary, theme.brandTertiary, theme.brandTertiary, '#F2A9C8'];
    const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  }, [theme]);

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
          <X size={20} color={theme.brandSecondary} />
        </CloseButton>

        <ProfileImageContainer>
          {currentPerson.imageUrl ? (
            <ProfileImage src={currentPerson.imageUrl} alt="Profile" />
          ) : (
            <AvatarFallback>
              {currentPerson.employeeName ? currentPerson.employeeName.charAt(0) : 'U'}
            </AvatarFallback>
          )}
        </ProfileImageContainer>

        <Title>Happy Birthday!</Title>
        <EmployeeName>{currentPerson.employeeName || "Employee"}</EmployeeName>
        {currentPerson.department && <DepartmentText>{currentPerson.department}</DepartmentText>}
        <Subtitle>Wishing you a fantastic day filled with joy and success!</Subtitle>

        {birthdays.length > 1 && (
          <NavRow>
            <NavButton onClick={handlePrev}>&lt;</NavButton>
            <PageCounter>{currentIndex + 1} / {birthdays.length}</PageCounter>
            <NavButton onClick={handleNext}>&gt;</NavButton>
          </NavRow>
        )}

      </ModalCard>
    </Overlay>
  );
};

export default BirthdayModal;
