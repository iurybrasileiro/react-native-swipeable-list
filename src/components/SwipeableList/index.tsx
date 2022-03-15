import React, { createRef, useRef, useState } from 'react';
import { RefreshControlProps, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { IIcon } from '../Icon';
import { SwipeableItem } from './components';
import { ISwipeableItemRef } from './components/SwipeableItem';

interface IAction {
  icon: Omit<IIcon, 'size'>;
  action?: () => void;
  color: string;
}

interface IRenderItem<I> {
  item: I;
  index: number;
}

interface IActions<I> {
  item: I;
  index: number;
}

interface ISwipeableList<I> {
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  showsVerticalScrollIndicator?: boolean | undefined;
  listEmptyComponent?: () => React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
  data?: I[] | null;
  renderItem: (data: IRenderItem<I>) => React.ReactNode;
  actions: (data: IActions<I>) => IAction[];
}

function SwipeableList<I = any>({
  data,
  renderItem,
  actions,
  listEmptyComponent,
  ...rest
}: ISwipeableList<I>): JSX.Element {
  const listRef = useRef(null);

  const [opened, setOpened] = useState<string | null>(null);

  const refs = (data || []).map(() => createRef<ISwipeableItemRef>());

  function handleCloseLatestOpened(index: number) {
    if (opened) {
      refs.forEach((ref, refIndex) => {
        if (refIndex !== index) {
          ref.current?.close();
        }
      });
    }

    setOpened(String(index));
  }

  function handleCloseAll() {
    refs?.forEach(item => {
      item.current?.close();
    });
  }

  return (
    <ScrollView {...rest} ref={listRef}>
      {data?.map((item, index) => (
        <SwipeableItem
          ref={refs[index]}
          key={String(index)}
          index={index}
          simultaneousHandlers={listRef}
          actions={actions({ item, index })}
          closeAll={handleCloseAll}
          onOpen={handleCloseLatestOpened}>
          {renderItem({ item, index })}
        </SwipeableItem>
      ))}

      {(!data || data.length === 0) && listEmptyComponent
        ? listEmptyComponent()
        : null}
    </ScrollView>
  );
}

export default SwipeableList;
