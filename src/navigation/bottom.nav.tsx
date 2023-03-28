import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, RotateCw, Settings} from '@tamagui/lucide-icons';
import HomeScreen from '../screen/HomeScreen';
import SettingsScreen from '../screen/SettingsScreen';
import StepHistoryScreen from '../screen/StepHistoryScreen';

export type BottomTabParamList = {
  HomeScreen: undefined;
  StepHistoryScreen: undefined;
  SettingsScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNav = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => <Home color={color} />,
        }}
      />
      <Tab.Screen
        name="StepHistoryScreen"
        component={StepHistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({color, size}) => <RotateCw color={color} />,
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({color, size}) => <Settings color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
