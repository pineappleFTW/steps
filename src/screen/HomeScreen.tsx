import {
  Button,
  Card,
  H2,
  H3,
  H4,
  H6,
  Separator,
  SizableText,
  Stack,
  useTheme,
  XStack,
} from 'tamagui';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Cloudy,
  Map,
  Plus,
  Sun,
  X,
} from '@tamagui/lucide-icons';
import {format, isSameDay, parseISO} from 'date-fns';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useSelector} from 'react-redux';
import {LinearGradient} from 'tamagui/linear-gradient';
import {useGetSumHealthData} from '../hooks/useGetSumHealthData';
import {useGetWeather} from '../hooks/useGetWeather';
import {BottomTabParamList} from '../navigation/bottom.nav';
import {StackParamList} from '../navigation/root.nav';
import {RootState} from '../redux/store';
import {getSevenDayStepHistory} from '../utils/health.utils';
import {getLocation} from '../utils/location.utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'HomeScreen'>,
  NativeStackScreenProps<StackParamList>
>;

const HealthCard = ({
  title,
  value,
  unit,
  progress,
}: {
  title: string;
  value: string;
  unit: string;
  progress: number;
}) => {
  const theme = useTheme();

  return (
    <Card
      f={1}
      theme="dark"
      elevate
      bordered
      size="$4"
      my="$2"
      borderRadius="$5">
      <LinearGradient
        width="100%"
        height="100%"
        position="absolute"
        br="$4"
        colors={['$purple8', '$blue8']}
        start={[0, 1]}
        end={[0, 0]}
      />
      <Card.Header padded alignItems="center" f={1}>
        <H4 color={'white'}>{title}</H4>
        <Separator my="$2" />
        <AnimatedCircularProgress
          size={150}
          width={10}
          fill={progress}
          tintColor={theme.blue8.val}
          backgroundColor={theme.gray7.val}>
          {fill => (
            <>
              <Stack f={1} alignItems="center" justifyContent="center">
                <Map color="white" />
                <Separator my="$1.5" />
                <SizableText fontWeight="bold" fontSize="$8" color="white">
                  {value}
                </SizableText>
                <SizableText color="white">{unit}</SizableText>
              </Stack>
            </>
          )}
        </AnimatedCircularProgress>
      </Card.Header>
    </Card>
  );
};

const HomeScreen = (props: Props) => {
  const name = useSelector((state: RootState) => state.user.name);
  const sum = useGetSumHealthData();
  const goals = useSelector((state: RootState) => state.goal.goals);
  const isFocused = useIsFocused();

  const {data, error, refetch} = useGetWeather();

  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Stack mr="$3">
          <Plus
            onPress={() => props.navigation.navigate('NewStepGoalScreen')}
          />
        </Stack>
      ),
    });
  }, [props.navigation]);

  useEffect(() => {
    if (isFocused) {
      getSevenDayStepHistory();
      getLocation();
    }
  }, [isFocused]);

  const renderWeatherIcons = (weatherCondition: string) => {
    switch (weatherCondition) {
      case 'Thunderstorm':
        return <CloudRainWind size="$10" color="white" />;

      case 'Drizzle':
        return <CloudDrizzle size="$10" color="white" />;

      case 'Rain':
        return <CloudRain size="$10" color="white" />;

      case 'Snow':
        return <CloudSnow size="$10" color="white" />;

      case 'Atmosphere':
        return <CloudRain size="$10" color="white" />;
      case 'Clear':
        return <Sun size="$10" color="white" />;

      case 'Clouds':
        return <Cloudy size="$10" color="white" />;

      case 'Unknown':
        return <X size="$10" color="white" />;
    }
  };

  const renderWeather = () => {
    const temp = '\u2103';

    let Error = null;
    let Weather = null;

    if (error) {
      Error = (
        <Stack>
          <Card
            theme="dark"
            elevate
            bordered
            size="$4"
            {...props}
            my="$2"
            borderRadius="$5">
            <LinearGradient
              width="100%"
              height="100%"
              position="absolute"
              // padding="$6"
              br="$4"
              colors={['$red10', '$yellow10']}
              start={[0, 1]}
              end={[0, 0]}
            />
            <Card.Header padded alignItems="center">
              <H4 color={'white'}>Weather data not available</H4>
              <SizableText color={'white'}>
                Displaying cache data if available
              </SizableText>
              <Button onPress={refetch}>Retry</Button>
            </Card.Header>
          </Card>
        </Stack>
      );
    }

    if (data) {
      Weather = (
        <Stack>
          <Card
            theme="dark"
            elevate
            bordered
            size="$4"
            {...props}
            my="$2"
            borderRadius="$5">
            <LinearGradient
              width="100%"
              height="100%"
              position="absolute"
              br="$4"
              colors={['$red10', '$yellow10']}
              start={[0, 1]}
              end={[0, 0]}
            />
            <Card.Header padded alignItems="center">
              <H4 color={'white'}>{data.name}</H4>
              {renderWeatherIcons(
                data.weather.length > 0 ? data.weather[0].main : 'Unknown',
              )}
              <H6 color="white">
                {data.weather.length > 0 ? data.weather[0].main : 'Unknown'}
              </H6>
              <H2 color="white">
                {data.main.temp} {temp}
              </H2>
              <SizableText color="white">
                feels like {data.main.feels_like} {temp}
              </SizableText>
            </Card.Header>
          </Card>
        </Stack>
      );
    }

    return (
      <>
        {Error}
        {Weather}
      </>
    );
  };

  const renderTodaySteps = () => {
    const todayDate = new Date();
    const todayStat = sum.find(stat => {
      if (isSameDay(todayDate, parseISO(stat.date))) {
        return stat;
      }
    });

    let progress = 0;
    if (todayStat) {
      const goal = goals[format(todayDate, 'yyyy-MM-dd')];
      const stepGoal = goal ? goal.steps : undefined;
      progress = stepGoal ? (todayStat.totalSteps / stepGoal) * 100 : 0;
    }

    return (
      <XStack gap="$3">
        <HealthCard
          title="Walking"
          value={todayStat?.totalSteps.toString() ?? '0'}
          unit="steps"
          progress={progress}
        />
        <HealthCard
          title="Distance"
          value={
            todayStat?.totalDistances
              ? (todayStat.totalDistances / 1000).toFixed(2)
              : '0'
          }
          unit="km"
          progress={100}
        />
      </XStack>
    );
  };

  return (
    <ScrollView>
      <Stack mt="$3" mx="$3">
        <H2>Welcome, {name}</H2>
        <H3>How are you feeling today?</H3>
        {renderWeather()}
        {renderTodaySteps()}
      </Stack>
    </ScrollView>
  );
};

export default HomeScreen;
