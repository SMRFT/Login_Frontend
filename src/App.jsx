import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import PrivateRoute from './Components/PrivateRoute';
import { GlobalStyle } from './GlobalStyle';
import { useTheme } from './hooks/useTheme';
import { ThemeModeContext } from './context/ThemeModeContext';

// Lazy load route components for code splitting
const Login = lazy(() => import("./Components/Login"));
const Modules = lazy(() => import("./Components/Modules"));
const Homescreen = lazy(() => import("./Components/Homescreen"));
const Mdashboard = lazy(() => import("./Components/Mdashboard"));

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-family: sans-serif;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const LoadingFallback = () => (
  <LoadingContainer>
    <div>Loading application...</div>
  </LoadingContainer>
);

const ContentWrapper = styled.div`
  margin-top: 15px;
  padding: 20px;

  @media (max-width: 1024px) {
    margin-left: 200px;
  }

  @media (max-width: 768px) {
    margin-left: 100px;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

function App() {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleTheme }}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Route */}
          <Route path={`${import.meta.env.BASE_URL}login`} element={<Login />} />

          {/* Protected Routes */}
          <Route >
            <Route path={`${import.meta.env.BASE_URL}`} element={<Homescreen />} />
            {/* Add more protected routes here */}
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path={`${import.meta.env.BASE_URL}secure`} element={<Modules />} />
            {/* Add more protected routes here */}
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path={`${import.meta.env.BASE_URL}dashboard`} element={<Mdashboard />} />
            {/* Add more protected routes here */}
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
    </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default App;
