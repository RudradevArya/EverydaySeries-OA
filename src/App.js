
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import LaunchList from './components/LaunchList';
import LaunchDetail from './components/LaunchDetail';

const AppWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppWrapper>
        <Title>Rudradev's Space Launch Calendar</Title>
        <Routes>
          <Route path="/" element={<LaunchList />} />
          <Route path="/launch/:id" element={<LaunchDetail />} />
        </Routes>
      </AppWrapper>
    </Router>
  );
}

export default App;