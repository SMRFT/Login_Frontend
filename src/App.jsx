import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Login from "./Components/Login";
import Modules from "./Components/Modules";
import Homescreen from "./Components/Homescreen";
import PrivateRoute from './Components/PrivateRoute';
import Mdashboard from './Components/Mdashboard';

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
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
