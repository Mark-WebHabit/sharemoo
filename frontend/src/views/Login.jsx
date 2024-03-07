import React, { useState } from "react";
import styled from "styled-components";

import AuthErrorMessage from "../components/AuthErrorMessage";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import AuthLink from "../components/AuthLink";

const Login = () => {
  const [datas, setDatas] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <AuthErrorMessage />
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

        <FormButton text={"LOGIN"} />
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
