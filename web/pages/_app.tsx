
import type { AppProps } from 'next/app'
import '../styles/globals.css'

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: AppProps) {



  return (<>

    <RecoilRoot>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >


        <Component {...pageProps} />

      </MantineProvider>

    </RecoilRoot>
  </>
  );
}

export default MyApp
