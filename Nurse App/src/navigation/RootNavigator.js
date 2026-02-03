import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import NurseDashboardScreen from '../screens/NurseDashboardScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';

const Stack = createStackNavigator();

const LoginStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      headerTintColor: '#0080ff',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 16,
      },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={NurseDashboardScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="PatientDetail"
      component={PatientDetailScreen}
      options={({ route }) => ({
        title: route.params?.patientName || 'Patient Details',
      })}
    />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Splash screen - could show loading here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <DashboardStack /> : <LoginStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
