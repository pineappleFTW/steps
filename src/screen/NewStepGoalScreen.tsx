import {Button, H2, H5, Input, Stack, useToast, YStack} from 'tamagui';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import {StackParamList} from '../navigation/root.nav';
import {addOrUpdateStepGoals} from '../redux/goal.slice';
import {RootState, useAppDispatch} from '../redux/store';

type Props = NativeStackScreenProps<StackParamList, 'NewStepGoalScreen'>;

const NewStepGoalScreen = (props: Props) => {
  const dispatch = useAppDispatch();
  const {show} = useToast();
  const [date, setDate] = useState(new Date());
  const goals = useSelector((state: RootState) => state.goal.goals);
  const [stepGoal, setStepGoal] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (goals[format(date, 'yyyy-MM-dd')]) {
      setStepGoal(goals[format(date, 'yyyy-MM-dd')].steps.toString());
    } else {
      setStepGoal('');
    }
  }, [date]);

  return (
    <Stack f={1}>
      <Stack mt="$3" mx="$3">
        <DatePicker
          modal
          open={open}
          date={date}
          onDateChange={setDate}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <H2 my="$4">Add New Goal</H2>
        <YStack gap="$5">
          <Stack>
            <H5>Date</H5>
            <Pressable onPress={() => setOpen(true)}>
              <Input
                editable={false}
                pointerEvents={'none'}
                value={format(date, 'yyyy-MM-dd')}
              />
            </Pressable>
          </Stack>
          <Stack m>
            <H5>Step Goal</H5>
            <Input
              onChangeText={e => setStepGoal(e)}
              value={stepGoal}
              keyboardType="numeric"
            />
          </Stack>
        </YStack>
        <Button
          mt="$5"
          theme={stepGoal === '' ? 'gray' : 'blue'}
          disabled={stepGoal === ''}
          onPress={() => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const goals = parseInt(stepGoal);
            dispatch(addOrUpdateStepGoals({date: dateStr, steps: goals}));
            show('Saved', {message: 'Goal successfully saved'});
            props.navigation.goBack();
          }}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default NewStepGoalScreen;
