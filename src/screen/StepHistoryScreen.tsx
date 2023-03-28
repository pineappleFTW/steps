import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Check, ChevronRight} from '@tamagui/lucide-icons';
import {format, parseISO} from 'date-fns';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {Card, H4, Progress, SizableText, Stack, XStack} from 'tamagui';
import {LinearGradient} from 'tamagui/linear-gradient';
import {useGetSumHealthData} from '../hooks/useGetSumHealthData';
import {SumHealthData} from '../interface/sum-health-data';
import {BottomTabParamList} from '../navigation/bottom.nav';
import {StackParamList} from '../navigation/root.nav';
import {RootState} from '../redux/store';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'StepHistoryScreen'>,
  NativeStackScreenProps<StackParamList>
>;

const StepHistoryScreen = (props: Props) => {
  const sum = useGetSumHealthData(true);
  const goals = useSelector((state: RootState) => state.goal.goals);

  return (
    <Stack>
      <FlatList
        data={sum}
        renderItem={({item}: {item: SumHealthData}) => {
          const goal = goals[format(parseISO(item.date), 'yyyy-MM-dd')];
          const stepGoal = goal ? goal.steps : undefined;
          const progress = stepGoal
            ? (item.totalSteps / stepGoal) * 100
            : undefined;

          return (
            <Card
              theme="dark"
              elevate
              size="$4"
              {...props}
              mx="$4"
              my="$2"
              onPress={() =>
                props.navigation.navigate('StepHistoryDetailScreen', {
                  data: item,
                })
              }>
              <LinearGradient
                width="100%"
                height="100%"
                position="absolute"
                br="$4"
                colors={['$purple10', '$pink8']}
                start={[0, 1]}
                end={[0, 0]}
              />
              <Card.Header padded>
                <XStack alignItems="center">
                  <Stack f={1}>
                    <H4 color={'white'}>
                      {format(parseISO(item.date), 'cccc, MMM do')}
                    </H4>
                    <XStack>
                      <SizableText fontWeight="bold" color="white">
                        {item.totalSteps} Steps
                      </SizableText>
                      <SizableText ml="$2" color="white">
                        {(item.totalDistances / 1000).toFixed(2)} km
                      </SizableText>
                    </XStack>
                    <XStack alignItems="center">
                      <SizableText color="white" mr="$2">
                        Goal: {stepGoal ? stepGoal + ' steps' : 'Not Set'}
                      </SizableText>
                      {progress && progress >= 100 ? (
                        <Check color="white" size="$1" />
                      ) : null}
                    </XStack>
                    {progress ? (
                      <Progress
                        my="$2.5"
                        value={progress > 100 ? 100 : progress}
                        backgroundColor="$gray8Light">
                        <Progress.Indicator
                          animation="bouncy"
                          backgroundColor={'$pink8'}
                        />
                      </Progress>
                    ) : null}
                  </Stack>
                  <ChevronRight color="white" />
                </XStack>
              </Card.Header>
            </Card>
          );
        }}
      />
    </Stack>
  );
};

export default StepHistoryScreen;
