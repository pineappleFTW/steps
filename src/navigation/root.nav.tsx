import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SumHealthData} from '../interface/sum-health-data';
import NewStepGoalScreen from '../screen/NewStepGoalScreen';
import StepHistoryDetailScreen from '../screen/StepHistoryDetailScreen';
import BottomNav from './bottom.nav';
export type StackParamList = {
  BottomNav: undefined;
  NewStepGoalScreen: undefined;
  StepHistoryDetailScreen: {data: SumHealthData};
};

const Stack = createNativeStackNavigator<StackParamList>();

const RootNav = () => {
  return (
    <Stack.Navigator initialRouteName="BottomNav">
      <Stack.Screen
        name="BottomNav"
        component={BottomNav}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="NewStepGoalScreen"
        component={NewStepGoalScreen}
        options={{title: 'New Step Goal'}}
      />

      <Stack.Screen
        name="StepHistoryDetailScreen"
        component={StepHistoryDetailScreen}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};

export default RootNav;
