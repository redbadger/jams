import { Heading, Img } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const LOGO_ENABLED_ORIGINS = ['runtime.is', 'localhost:3000'];

const Logo = () => {
  const [origin, setOrigin] = useState();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (
    origin &&
    LOGO_ENABLED_ORIGINS.some((o) => origin.includes(o))
  ) {
    return <Img src="/runtime-logo.png" alt="Runtime" h="24px" />;
  } else if (origin) {
    return (
      <Heading
        as="h1"
        size="lg"
        letterSpacing={'tighter'}
        fontWeight={600}
      >
        Jam
      </Heading>
    );
  } else {
    return '';
  }
};

export default Logo;
