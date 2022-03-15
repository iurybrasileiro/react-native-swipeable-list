import { RectButton } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const Content = styled(Animated.View)`
  position: absolute;
  z-index: 9999;

  background: ${({ theme }) => theme.colors.base.white};

  width: ${({ theme }) => theme.metrics.window.width}px;
  flex-direction: row;
  align-items: center;
`;

interface IActionsContainer {
  customHeight: string;
}

export const ActionsContainer = styled.View<IActionsContainer>`
  width: 100%;
  height: ${({ customHeight }) => customHeight}px;

  flex-direction: row;
  justify-content: flex-end;
`;

export const Action = styled(RectButton)`
  width: 60px;
  height: 60px;

  margin-right: 8px;

  border-radius: 4px;

  background: ${({ theme }) => theme.colors.global.primary};

  align-self: center;
  justify-content: center;
  align-items: center;
`;
