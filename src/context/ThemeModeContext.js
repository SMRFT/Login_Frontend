import { createContext, useContext } from 'react';

export const ThemeModeContext = createContext({
  themeMode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);
