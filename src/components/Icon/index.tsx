import React from 'react';
import { createIconSet } from 'react-native-vector-icons';

import { useTheme } from 'styled-components/native';

import awesomeicons from './assets/awesomeicons.json';

const RNIcon = createIconSet(awesomeicons, 'awesomeicons', 'awesomeicons.ttf');

export interface IIcon {
  name: string;
  size?: number;
  color?: string;
}

function Icon({ name, color, size }: IIcon): JSX.Element {
  const theme = useTheme();

  return (
    <RNIcon
      name={name}
      color={color || theme.colors.icon.primary}
      size={size || 30}
    />
  );
}

export default Icon;
