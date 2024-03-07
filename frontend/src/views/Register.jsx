import React, { useState } from "react";
import styled from "styled-components";

import AuthErrorMessage from "../components/AuthErrorMessage";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import AuthLink from "../components/AuthLink";

const Register = () => {
  const [datas, setDatas] = useState({
    username: "",
    email: "",
    password: "",
    cpass: "",
  });

  const handleChange = (e) => {
    setDatas({ ...datas, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <AuthErrorMessage />
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
        <FormButton text={"REGISTER"} />
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
