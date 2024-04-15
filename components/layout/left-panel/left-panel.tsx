import { useAuth } from "@/components/services/app-services/auth/auth-provider";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface LeftPanelProps {
  children?: React.ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <Wrapper>
      <UserProfile />
    </Wrapper>
  );
};

const UserProfile = () => {
  const { authService } = useAuth();

  const [mail, setMail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const user = await authService.getUser();

      setMail(user!.email);
    };

    getUser();
  }, []);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    authService.logOut();

    handleCloseUserMenu();
  };

  return (
    <>
      <UserBlock onClick={handleOpenUserMenu}>
        <Photo />

        <div>{mail}</div>
      </UserBlock>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleLogout} style={{ minWidth: "300px" }}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const UserBlock = styled.div`
  width: 100%;
  display: flex;

  align-items: center;
  column-gap: 10px;

  padding-top: 10px;
  padding-bottom: 10px;

  &&:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

const Photo = styled.div`
  min-width: 32px;
  min-height: 32px;
  background-color: blue;

  border-radius: 50%;
`;

const Wrapper = styled.div`
  width: 250px;
  min-width: 250px;

  display: flex;
  flex-direction: column;

  background-color: lightgrey;

  padding: 10px;
  min-height: calc(100vh - 20px);
`;

export default LeftPanel;
