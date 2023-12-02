import '@/styles/globals.css';
import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactFlowProvider } from 'reactflow';
import createEmotionCache from '../theme/createEmotionCache';
import theme from '../theme/theme';

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReactFlowProvider>
          <Component {...pageProps} />
        </ReactFlowProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
