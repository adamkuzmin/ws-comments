import { useRouter } from "next/router";
import { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";

import { createClient } from "@/utils/supabase/component";
import { useAuth } from "@/components/services/app-services/auth/auth-provider";
import styled from "styled-components";

const LoginPage = () => {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup forms

  const { authService } = useAuth();

  const handleFormSubmit = () => {
    if (isLogin) {
      authService.logIn(email, password);
    } else {
      authService.signUp(email, password);
    }
  };

  return (
    <Wrapper>
      <AuthWrapper>
        <main>
          <form>
            <FormControl>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button variant="contained" onClick={handleFormSubmit}>
              {isLogin ? "Log in" : "Sign up"}
            </Button>
          </form>
        </main>

        <Button variant="text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Switch to Sign up" : "Switch to Log in"}
        </Button>
      </AuthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  row-gap: 36px;

  padding: 30px;
  border: 1px solid grey;
`;

export default LoginPage;
