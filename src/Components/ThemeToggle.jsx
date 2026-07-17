import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useThemeMode } from '../context/ThemeModeContext';

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.borderLight};
  background: ${({ theme }) => theme.bgCard};
  color: ${({ theme }) => theme.brandSecondary};
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.bgSubtle};
  }
`;

const ThemeToggle = ({ className }) => {
  const { themeMode, toggleTheme } = useThemeMode();
  const isDark = themeMode === 'dark';

  return (
    <ToggleButton
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ToggleButton>
  );
};

export default ThemeToggle;
