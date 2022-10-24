import type { AppProps } from "next/app";
import "../styles/globals.css";

import "@fontsource/bebas-neue";
import "@fontsource/roboto";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id":
    "Aew2k09_9YjZoPH_ZYzm44x9WhORwaXQi-cgHZUtOkyJiHXGBX9U3xCB1iFDqu_gtuOZNVwzIN2BFd6N",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mballet</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Roboto, sans-serif",

          headings: {
            fontFamily: "Bebas Neue, sans-serif",
          },
          colors: {
            main: ["#b35642", "#9a3e2a", "#8f4535", "#72372a", "#b14a30"],
          },
          components: {
            Text: {
              defaultProps: {
                color: "gray.7",
              },
            },
            Title: {
              defaultProps: {
                color: "dark.4",
              },
            },
            Button: {
              defaultProps: {
                color: "dark.6",
                radius: "xs",
              },
              styles: (theme) => ({
                root: {
                  fontWeight: "normal",
                  border: `2px solid ${theme.colors.dark[6]} !important`,
                  height: "50px",
                  color: theme.colors.dark[6],
                  backgroundColor: "unset",
                  transition: "0.2s ease-in-out",

                  "&:hover": {
                    color: "white",
                    backgroundColor: theme.colors.dark[6],
                  },
                },
              }),
            },
            Menu: {
              defaultProps: {
                radius: "xs",
              },
              styles: (theme) => ({
                dropdown: {
                  padding: "0px !important",
                  backgroundColor: theme.colors.dark[6],
                },
                item: {
                  borderRadius: 0,
                  color: "white",
                  "&:hover": {
                    color: theme.colors.dark[6],
                  },
                },
              }),
            },
            NavLink: {
              styles: (theme) => ({
                root: {
                  fontSize: "16px",
                  color: "white",
                  fontWeight: "normal",
                  "&:hover": {
                    backgroundColor: theme.colors.gray[4],

                    color: theme.colors.dark[6],
                  },
                },
                label: {
                  fontSize: "inherit",
                  color: "inherit",
                },
                children: {
                  padding: 0,
                },
              }),
            },
          },

          colorScheme: "light",
          breakpoints: {
            xs: 500,
            sm: 800,
            md: 1000,
            lg: 1200,
            xl: 1400,
          },
        }}
      >
        <RecoilRoot>
          <style global jsx>{`
            html,
            body,
            body > div:first-child,
            div#__next {
              height: 100%;
            }
          `}</style>
          <Component {...pageProps} />
        </RecoilRoot>
      </MantineProvider>
    </>
  );
}

export default MyApp;
