import '../styles/globals.css';
import theme from 'theme';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';
import { useSession, signIn } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CookiesProvider>
        <Provider session={pageProps.session}>
          {/* {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )} */}
          <Component {...pageProps} />
        </Provider>
      </CookiesProvider>
    </ChakraProvider>
  );
}

function Auth({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (loading) return;
    if (!isUser) signIn();
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  return <div>Loading...</div>;
}

export default MyApp;
