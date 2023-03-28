import React, {useState} from 'react';
import {Animated, Dimensions} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Apple, MapPin} from '@tamagui/lucide-icons';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {Button, H2, H3, Input, SizableText, Stack, useTheme} from 'tamagui';
import RootNav from '../navigation/root.nav';
import {initiateAppleHealthKit} from '../utils/health.utils';

import * as Location from 'expo-location';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../redux/store';
import {setIsFirstLaunched, setName} from '../redux/user.slice';
import {getLocation} from '../utils/location.utils';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const OnBoardScreen = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const width = Dimensions.get('window').width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, 4];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, 4 * width],
  });

  const name = useSelector((state: RootState) => state.user.name);

  console.log('hi');

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const OnboardFirstPage = () => {
    return (
      <Stack key="1" f={1}>
        <Stack f={1} justifyContent="center" alignItems="center">
          <H2>Welcome to Steps</H2>
          <H3>Best step and distance tracker</H3>
        </Stack>
        <Button
          alignSelf="center"
          theme="blue"
          width="80%"
          onPress={() => ref.current?.setPage(1)}>
          Continue
        </Button>
      </Stack>
    );
  };

  const OnboardSecondPage = () => {
    // const [name, setName] = useState('')
    return (
      <Stack key="2" f={1}>
        <Stack f={1} justifyContent="center" alignItems="center">
          <H2>What is your name?</H2>
          <Input
            my="$5"
            width="80%"
            onChangeText={e => dispatch(setName(e))}
            value={name}
          />
        </Stack>
        <Button
          theme={name === '' ? 'gray' : 'blue'}
          disabled={name === ''}
          alignSelf="center"
          width="80%"
          onPress={() => ref.current?.setPage(2)}>
          Continue
        </Button>
      </Stack>
    );
  };

  const OnboardThirdPage = () => {
    return (
      <Stack key="3" f={1}>
        <Stack f={1} justifyContent="center" alignItems="center">
          <Stack mx="$8">
            <H2>Sync your Apple Health Data</H2>
            <SizableText fontSize={12}>
              Please allow us to make use of your health data
            </SizableText>
            <Button
              // als="flex-start"
              my="$3"
              theme="blue"
              icon={Apple}
              onPress={() => initiateAppleHealthKit()}>
              Connect
            </Button>
          </Stack>
        </Stack>
        <Button
          alignSelf="center"
          theme="blue"
          width="80%"
          onPress={() => ref.current?.setPage(3)}>
          Continue
        </Button>
      </Stack>
    );
  };

  const OnboardFourthPage = () => {
    const [locationPermission, setLocationPermission] =
      useState<Location.PermissionStatus>(
        Location.PermissionStatus.UNDETERMINED,
      );

    const showLocationPermissionAccess = () => {
      switch (locationPermission) {
        case Location.PermissionStatus.UNDETERMINED:
          return (
            <Button
              my="$3"
              theme="blue"
              icon={MapPin}
              onPress={() =>
                getLocation(status => setLocationPermission(status))
              }>
              Enable
            </Button>
          );

        case Location.PermissionStatus.GRANTED:
          return (
            <Button
              disabled={true}
              my="$3"
              theme="green"
              icon={MapPin}
              onPress={() =>
                getLocation(status => setLocationPermission(status))
              }>
              Granted
            </Button>
          );

        case Location.PermissionStatus.DENIED:
          return (
            <Button
              disabled={true}
              my="$3"
              theme="red"
              icon={MapPin}
              onPress={() =>
                getLocation(status => setLocationPermission(status))
              }>
              Denied
            </Button>
          );
      }
    };

    return (
      <Stack key="4" f={1}>
        <Stack f={1} justifyContent="center" alignItems="center">
          <Stack mx="$8">
            <H2>Access to Current Location</H2>
            <SizableText fontSize={12}>
              Current Location is used to get the current weather of the
              location
            </SizableText>
            {showLocationPermissionAccess()}
          </Stack>
        </Stack>
        <Button
          theme={name === '' ? 'gray' : 'blue'}
          disabled={name === ''}
          alignSelf="center"
          width="80%"
          onPress={() => {
            dispatch(setIsFirstLaunched(true));
          }}>
          Continue
        </Button>
      </Stack>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack f={1}>
        <AnimatedPagerView
          initialPage={0}
          ref={ref}
          style={{flex: 1}}
          onPageScroll={onPageScroll}>
          <OnboardFirstPage />
          {OnboardSecondPage()}
          <OnboardThirdPage />
          <OnboardFourthPage />
        </AnimatedPagerView>
      </Stack>
      <Stack mb="$10">
        <ExpandingDot
          data={[1, 2, 3, 4]}
          expandingDotWidth={30}
          //@ts-ignore
          scrollX={scrollX}
          inActiveDotOpacity={0.6}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          containerStyle={{
            top: 30,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  const hydrated = useSelector((state: RootState) => state.user.hydrated);

  const isFirstLaunched = useSelector(
    (state: RootState) => state.user.isFirstLaunched,
  );

  if (!hydrated) {
    return (
      <Stack f={1} justifyContent="center" alignItems="center">
        <H2>Steps</H2>
      </Stack>
    );
  }

  if (!isFirstLaunched) {
    return <OnBoardScreen />;
  }

  return <RootNav />;
};

export default AppNavigator;
