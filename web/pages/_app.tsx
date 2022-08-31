
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { MantineProvider } from '@mantine/core';
import Head from 'next/head';
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {



  return (<>



    <Head>
      <title>Page title</title>
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
        /** Put your mantine theme override here */
        colorScheme: 'dark',


      }}
    >
      <RecoilRoot>

        <Component {...pageProps} />
      </RecoilRoot>
    </MantineProvider>


  </>
  );
}

export default MyApp
