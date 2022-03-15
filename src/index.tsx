import React from 'react';
import { View } from 'react-native';

import { ThemeProvider } from 'styled-components/native';

import theme from './theme';

function Main() {
  return (
    <ThemeProvider theme={theme}>
      <View />
    </ThemeProvider>
  );
}

export default Main;
