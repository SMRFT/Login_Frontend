import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Login from "./Components/Login";



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
    <>
   
      <ContentWrapper>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
      </ContentWrapper>

  </>
  );
}

export default App;