import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ConversationListScreen} from './src/conversation/ConversationListScreen';
import {ConversationScreen} from './src/conversation/ConversationScreen';
import {RootStackParamList} from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ConversationList" screenOptions={{headerShown: false}}>
          <Stack.Screen name="ConversationList" component={ConversationListScreen} />
          <Stack.Screen name="Conversation" component={ConversationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
