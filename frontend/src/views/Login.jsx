import React, { useState } from "react";
import styled from "styled-components";
import { instance } from "../config/instance";
import { useNavigate } from "react-router-dom";
import AuthErrorMessage from "../components/AuthErrorMessage";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import AuthLink from "../components/AuthLink";

const Login = () => {
  const [datas, setDatas] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { usernameOrEmail, password } = datas;

    if (!usernameOrEmail || !password) {
      setError("All fields required");
      return;
    }

    try {
      const response = await instance.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      setDatas({
        usernameOrEmail: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }
  };
  return (
    <Container>
      <AuthErrorMessage error={error} />
      <div className="wrapper">
        <InputField
          label="Username or Email"
          value={datas.usernameOrEmail}
          event={handleChange}
          name="usernameOrEmail"
        />

        <InputField
          label="Password"
          value={datas.password}
          type="password"
          event={handleChange}
          name="password"
        />

        <FormButton text={"LOGIN"} event={handleSubmit} />
      </div>
      <AuthLink link={"/auth/register"} text={"Already have an account?"} />
    </Container>
  );
};

export default Login;
const Container = styled.form`
  display: flex;
  flex-direction: column;

  & .wrapper {
    width: 100%;
    padding: 0;
    padding-top: 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 1.5em;
  }
`;
