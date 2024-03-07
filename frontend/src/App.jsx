import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

// outlets
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";

// views
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";

function App() {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
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
