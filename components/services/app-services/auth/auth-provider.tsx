import React, { Component } from "react";
import AuthService, { Message, UserMetadata } from "./auth-service";
import { createClient } from "@/utils/supabase/component";
import { Alert, Snackbar } from "@mui/material";
import { withRouter } from "next/router";

const AuthContext = React.createContext<AuthContentProps | undefined>(
  undefined
);

interface AuthContentProps {
  authService: AuthService;
  userMetadata: UserMetadata | null;
}

interface AuthProviderState {
  isAuthorized: boolean;
  userMetadata: UserMetadata | null;
  needsAuth: boolean;
  isAuthPage: boolean;
  message: Message | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
  router: any; // Use appropriate type for Next.js Router
}

class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {
  private authService: AuthService;
  private messageTimer?: NodeJS.Timeout;

  constructor(props: AuthProviderProps) {
    super(props);
    const supabase = createClient();

    this.state = {
      isAuthorized: false,
      userMetadata: null,
      needsAuth: false,
      isAuthPage: false,
      message: null,
    };

    this.authService = new AuthService(props.router, supabase);
  }

  componentDidMount() {
    this.authService.provideStates({
      setIsAuthorized: this.setIsAuthorized,
      setNeedsAuth: this.setNeedsAuth,
      setMessage: this.setMessage,
      setUserMetadata: this.setUserMetadata,
    });

    this.authService.init();

    this.checkAuthPage();
  }

  componentWillUnmount() {
    this.authService.dispose();
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }
  }

  componentDidUpdate(prevProps: AuthProviderProps) {
    if (prevProps.router.pathname !== this.props.router.pathname) {
      this.checkAuthPage();
    }
  }

  checkAuthPage = () => {
    const isLoginPage = this.props.router.pathname === "/login";
    this.setState({ isAuthPage: isLoginPage });
  };

  setIsAuthorized = (isAuthorized: boolean) => this.setState({ isAuthorized });
  setUserMetadata = (userMetadata: UserMetadata | null) =>
    this.setState({ userMetadata });
  setNeedsAuth = (needsAuth: boolean) => this.setState({ needsAuth });
  setMessage = (message: Message | null) => {
    this.setState({ message });
    if (message) {
      this.messageTimer = setTimeout(() => {
        this.setState({ message: null });
      }, 2000);
    }
  };

  render() {
    const { children } = this.props;
    const { isAuthorized, isAuthPage, message } = this.state;

    return (
      <AuthContext.Provider
        value={{
          authService: this.authService,
          userMetadata: this.state.userMetadata,
        }}
      >
        <Snackbar
          open={message !== null}
          autoHideDuration={1000}
          onClose={() => this.setMessage(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity={message?.type || "error"}>
            {message?.message || ""}
          </Alert>
        </Snackbar>

        {(isAuthorized || isAuthPage) && children}
      </AuthContext.Provider>
    );
  }
}

export default withRouter(AuthProvider);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
