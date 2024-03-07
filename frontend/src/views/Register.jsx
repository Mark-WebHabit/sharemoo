import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { instance } from "../config/instance.js";

import AuthErrorMessage from "../components/AuthErrorMessage";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import AuthLink from "../components/AuthLink";
import axios from "axios";

const Register = () => {
  const [datas, setDatas] = useState({
    username: "",
    email: "",
    password: "",
    cpass: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");

    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, cpass } = datas;

    if (!username || !email || !password || !cpass) {
      setError("All fields required");
      return;
    }

    if (username.length < 4) {
      setError("Username must be atleast 4 characters");
      return;
    }

    const validEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailFormat.test(email)) {
      setError("Invalid Email format");
      return;
    }

    if (password.length < 6) {
      setError("password must be atleast 6 characters");
      return;
    }

    if (password !== cpass) {
      setError("Passwords don't matched");
      return;
    }

    try {
      const response = await instance.post("/auth/register", {
        username,
        email,
        password,
      });

      setDatas({
        username: "",
        email: "",
        password: "",
        cpass: "",
      });
      navigate("/auth");
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
          label="Username"
          value={datas.username}
          event={handleChange}
          name="username"
        />
        <InputField
          label="Email"
          value={datas.email}
          event={handleChange}
          name="email"
        />
        <InputField
          label="Password"
          value={datas.password}
          type="password"
          event={handleChange}
          name="password"
        />
        <InputField
          label="Confirm Password"
          type="password"
          value={datas.cpass}
          event={handleChange}
          name="cpass"
        />
        <FormButton text={"REGISTER"} event={handleSubmit} />
      </div>
      <AuthLink link={"/auth"} text={"Already have an account?"} />
    </Container>
  );
};

export default Register;
const Container = styled.form`
  display: flex;
  flex-direction: column;

  & .wrapper {
    width: 100%;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 1.5em;
  }
`;
