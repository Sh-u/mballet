
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { MantineProvider, Title } from '@mantine/core';
import Head from 'next/head';
import { RecoilRoot } from "recoil";
import "@fontsource/bebas-neue";
import "@fontsource/roboto";
function MyApp({ Component, pageProps }: AppProps) {



  return (<>



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

        fontFamily: 'Roboto, sans-serif',

        headings: {
          fontFamily: 'Bebas Neue, sans-serif',


        },
        colors: {
          'main': ['#b35642', '#9a3e2a', '#8f4535', '#72372a', '#b14a30']
        },
        components: {
          Text: {
            defaultProps: {
              color: 'gray.7',

            }
          },
          Title: {
            defaultProps: {
              color: 'dark.4'
            }
          },
          Button: {
            defaultProps: {
              color: 'dark.6'
            }
          }
        },

        colorScheme: 'light',
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

export default MyApp
