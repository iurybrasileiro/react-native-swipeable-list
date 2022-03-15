import { Dimensions, Platform } from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('window');

const metrics = {
  window: {
    width,
    height,
  },
  statusBarHeight: Platform.select({
    android: 0,
    ios: getStatusBarHeight(),
    default: 0,
  }),
  bottomSpace: Platform.select({
    android: 0,
    ios: getBottomSpace(),
    default: 0,
  }),
};

export default metrics;
