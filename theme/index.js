import { extendTheme } from '@chakra-ui/react';

// Global style overrides
import styles from './styles';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import Button from './components/Button';

const breakpoints = createBreakpoints({
  sm: '640px',
  md: '1020px',
  lg: '1200px',
});

const overrides = {
  styles,
  components: {
    Button,
  },
};

export default extendTheme(overrides, breakpoints);
