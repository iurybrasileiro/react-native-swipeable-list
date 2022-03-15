import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Icon, { IIcon } from '../../../Icon';

import { Action, ActionsContainer, Container, Content } from './styles';

interface IAction {
  icon: Omit<IIcon, 'size'>;
  action?: () => void;
  color: string;
}

interface ISwipeableItem
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  index: number;
  children: any;
  actions: IAction[];
  onOpen?: (index: number) => void;
  closeAll: () => void;
}

const BUTTON_OFFSET = 8;
const BUTTON_WIDTH = 68 + BUTTON_OFFSET;
const OFFSET = 40;

export interface ISwipeableItemRef {
  close: () => void;
}

function clamp(value: number, lowerBound: number, upperBound: number) {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
}

function SwipeableItem(
  {
    children,
    actions,
    simultaneousHandlers,
    onOpen,
    closeAll,
    index,
  }: ISwipeableItem,
  ref: React.ForwardedRef<ISwipeableItemRef>,
): JSX.Element {
  const translateX = useSharedValue(0);

  const [actionsContainerHeight, setActionsContainerHeight] = useState('0');

  const maxTranslate = useMemo(() => {
    return BUTTON_WIDTH * actions.length;
  }, [actions.length]);

  function handleOnOpen() {
    if (onOpen) {
      onOpen(index);
    }
  }

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const TRANSLATE_X = ctx.startX + event.translationX;

      translateX.value = clamp(TRANSLATE_X, -(maxTranslate + OFFSET), 0);
    },
    onEnd: () => {
      const TRANSLATE_X = translateX.value * -1;

      if (TRANSLATE_X >= maxTranslate + OFFSET) {
        translateX.value = withTiming(-maxTranslate);

        runOnJS(handleOnOpen)();
      } else if (TRANSLATE_X >= BUTTON_WIDTH / 2) {
        translateX.value = withTiming(-maxTranslate);

        runOnJS(handleOnOpen)();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  function handleReceiveLayout({ nativeEvent }: LayoutChangeEvent) {
    setActionsContainerHeight(String(nativeEvent.layout.height));
  }

  function close() {
    translateX.value = withSpring(0);
  }

  useImperativeHandle(ref, () => ({
    close,
  }));

  return (
    <Container>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={gestureHandler}>
        <Content onLayout={handleReceiveLayout} style={animatedStyle}>
          {children}
        </Content>
      </PanGestureHandler>

      <ActionsContainer customHeight={actionsContainerHeight}>
        {actions
          ?.map((item, action_index) => (
            <Action
              key={`ACTION-${String(action_index)}`}
              style={{ backgroundColor: item.color }}
              onPress={() => {
                if (item.action) {
                  item.action();
                }

                closeAll();
              }}>
              <Icon {...item.icon} />
            </Action>
          ))
          .reverse()}
      </ActionsContainer>
    </Container>
  );
}

export default forwardRef(SwipeableItem);
