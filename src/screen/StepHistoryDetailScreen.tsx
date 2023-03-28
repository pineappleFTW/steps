import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {FlatList} from 'react-native';
import {Card, Separator, SizableText, Stack, Tabs, XStack} from 'tamagui';
import {LinearGradient} from 'tamagui/linear-gradient';
import {HealthValue, SumHealthData} from '../interface/sum-health-data';
import {StackParamList} from '../navigation/root.nav';
import {displayTimeOnlyFromString} from '../utils/date.utils';

type Props = NativeStackScreenProps<StackParamList, 'StepHistoryDetailScreen'>;

const HealthCardItem = ({
  startDate,
  endDate,
  content,
}: {
  startDate: string;
  endDate: string;
  content: string;
}) => {
  return (
    <Card theme="dark" elevate size="$4" my="$2" bordered>
      <LinearGradient
        width="100%"
        height="100%"
        position="absolute"
        br="$4"
        colors={['$purple8', '$blue8']}
        start={[0, 1]}
        end={[0, 0]}
      />
      <Card.Header padded>
        <XStack gap="$2">
          <SizableText color="white">Start Time:</SizableText>
          <SizableText color="white">
            {displayTimeOnlyFromString(startDate)}
          </SizableText>
        </XStack>
        <XStack gap="$2">
          <SizableText color="white">End Time:</SizableText>
          <SizableText color="white">
            {displayTimeOnlyFromString(endDate)}
          </SizableText>
        </XStack>
        <SizableText color="white" fontWeight="bold">
          {content}
        </SizableText>
      </Card.Header>
    </Card>
  );
};

const HorizontalTabs = ({data}: {data: SumHealthData}) => {
  return (
    <Tabs
      f={1}
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      height={150}>
      <Tabs.List
        disablePassBorderRadius="bottom"
        aria-label="Manage your account">
        <Tabs.Trigger theme="Button" f={1} value="tab1">
          <SizableText fontFamily="$body" fontWeight="bold">
            Steps
          </SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" f={1} value="tab2">
          <SizableText fontFamily="$body" fontWeight="bold">
            Distances
          </SizableText>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" key="tab1" f={1}>
        <FlatList
          data={data.steps}
          contentContainerStyle={{flexGrow: 1}}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={
            <Stack justifyContent="center" alignItems="center" f={1}>
              <SizableText>No Steps</SizableText>
            </Stack>
          }
          renderItem={({item}: {item: HealthValue}) => {
            return (
              <HealthCardItem
                startDate={item.startDate}
                endDate={item.endDate}
                content={`${item.value} steps`}
              />
            );
          }}
        />
      </Tabs.Content>

      <Tabs.Content value="tab2" key="tab2" f={1}>
        <FlatList
          data={data.distances}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            <Stack justifyContent="center" alignItems="center" f={1}>
              <SizableText>No Distances</SizableText>
            </Stack>
          }
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({item}: {item: HealthValue}) => {
            return (
              <HealthCardItem
                startDate={item.startDate}
                endDate={item.endDate}
                content={`${(item.value / 1000).toFixed(2)} km`}
              />
            );
          }}
        />
      </Tabs.Content>
    </Tabs>
  );
};

const StepHistoryDetailScreen = (props: Props) => {
  const sumHealthData = props.route.params.data;

  return (
    <Stack f={1} mx="$3">
      <Separator my="$1" />
      <HorizontalTabs data={sumHealthData} />
    </Stack>
  );
};

export default StepHistoryDetailScreen;
