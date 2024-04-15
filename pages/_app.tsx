import AuthProvider from "@/components/services/app-services/auth/auth-provider";
import Wrapper from "@/components/layout/wrapper/wrapper";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GlobalStyle />

      <AuthProvider>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </AuthProvider>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    background-color: #F1F0EE;

    &, & * {
      color: #333333;
      font-size: 12px;
      box-sizing: border-box;
    }
  }

  ::-webkit-scrollbar {
    width: 3px; /* width of the entire scrollbar */
  }

  ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0);
  }

  ::-webkit-scrollbar-thumb {
    background: #8C8C8C; /* color of the scroll thumb /
    border-radius: 3px; / roundness of the scroll thumb */
    }
    
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* color when hovering over the scroll thumb */
  }


  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(.4) ;
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -50%) scale(.4);
      opacity: 1;
    }
  }

  & .MuiFormControl-root {
    & .MuiInputBase-root {
      padding: 8px;

      // small size
      &.MuiInputBase-sizeSmall {
        padding: 5px;
      }
    }
  }

  // Papers
  & .MuiPaper-root {
    & {
      & {
        border-radius: 8px !important;
        border: 1px solid #E0E0E0 !important;
        box-shadow: none !important;
        position: relative;
        display: flex;
        gap: 9px;

        padding: 9px;
        box-sizing: border-box;
      }
    }
  }

  & .MuiPopover-paper {
    &, & * {
      font-size: 12px !important;
      color: #333333;
    }

    & .MuiMenuItem-root {
      border-radius: 8px !important;
    }
  }

  // IconButtons
  & .MuiButtonBase-root.MuiIconButton-root {
    min-width: 27px;
    width: 27px;
    height: 27px;
    min-height: 27px;

    margin: 0;
    padding: 0;

    &:not([data-type='exception']) {
    border-radius: 9px !important;
    }

    &[data-active="true"] {
      background-color: #FEFAE5 !important;
    }

    & > svg {
      min-width: 18px;
      min-height: 18px;
    }

    &.Mui-disabled {
      opacity: 0.4;
    }
  }

  // MuiButton
  && .MuiButton-root {
    border-radius: 8px !important;
    min-width: max-content;
    height: 33px;

    &.MuiButton-sizeSmall {
      height: 27px;
    }

    &.MuiButton-contained {
      box-shadow: none !important;
    }

    &.MuiButton-containedPrimary {
      background-color: #f9e05e;
      
      &:hover {
        background-color: #f9e05e;
      }
    }

    &, & * {
      color: #333333 !important;
      text-transform: none !important;
    }
  }

  // Forge Viewer
  & .forge-spinner {
    display: none !important;
  }

  & .adsk-control.adsk-toolbar {
    display: none !important;
  }

  & .viewcubeWrapper {
    left: auto !important;
    top: auto !important;
    right: 10px !important;
    bottom: 10px !important;
    border: 1px solid grey;
  }
`;

export default App;
