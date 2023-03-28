import {Apple, MapPin, RotateCw} from '@tamagui/lucide-icons';
import {Button, H2, SizableText, Stack, useToast, YStack} from 'tamagui';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {format, parseISO} from 'date-fns';
import * as Location from 'expo-location';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {BottomTabParamList} from '../navigation/bottom.nav';
import {StackParamList} from '../navigation/root.nav';
import {RootState} from '../redux/store';
import {
  getSevenDayStepHistory,
  initiateAppleHealthKit,
} from '../utils/health.utils';
import {getLocation, getPermission} from '../utils/location.utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'SettingsScreen'>,
  NativeStackScreenProps<StackParamList>
>;

const SettingsScreen = (props: Props) => {
  const {show} = useToast();
  const lastSync = useSelector((state: RootState) => state.sync.lastSync);
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus>(Location.PermissionStatus.UNDETERMINED);

  useFocusEffect(() => {
    getPermission(status => setLocationPermission(status));
  });

  const showLocationPermissionAccess = () => {
    switch (locationPermission) {
      case Location.PermissionStatus.UNDETERMINED:
        return (
          <Button
            // als="flex-start"
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
          <SizableText mt="$1" mb="$2">
            Granted
          </SizableText>
        );

      case Location.PermissionStatus.DENIED:
        return (
          <SizableText mt="$1" mb="$2">
            Denied
          </SizableText>
        );
    }
  };

  return (
    <Stack>
      <YStack mx="$3" my="$2">
        <H2>Last Synced</H2>

        <SizableText fontSize={'$4'} mt="$1" mb="$2">
          {lastSync
            ? format(parseISO(lastSync), 'cccc, MMM do, hh:mm aaa')
            : 'Never'}
        </SizableText>

        <H2>Apple Health</H2>
        <Button
          // als="flex-start"
          my="$3"
          theme="blue"
          icon={Apple}
          onPress={() => initiateAppleHealthKit()}>
          Connect
        </Button>

        <H2>Location Permission</H2>
        {showLocationPermissionAccess()}

        <H2>Sync Data</H2>
        <Button
          // als="flex-start"
          my="$3"
          theme="blue"
          onPress={() => {
            getSevenDayStepHistory();
            show('Synced', {message: 'Data Synced'});
          }}
          icon={RotateCw}>
          Sync
        </Button>
      </YStack>
    </Stack>
  );
};

export default SettingsScreen;
