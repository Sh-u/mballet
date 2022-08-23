
import type { AppProps } from 'next/app'
import '../styles/globals.css'

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {



  return (<>

    <RecoilRoot>

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


        <Component {...pageProps} />

      </MantineProvider>

    </RecoilRoot>
  </>
  );
}

export default MyApp
