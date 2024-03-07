import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

// outlets
import MainLayout from "./layout/MainLayout";

// views
import Home from "./views/Home";

function App() {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </Container>
  );
}

export default App;

const Container = styled.div`
  height: 100vh;
`;
