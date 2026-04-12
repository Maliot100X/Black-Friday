import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Search, MapPin, Store, User, Bell } from 'lucide-react-native';
import { View, Text } from 'react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import DealsScreen from './screens/DealsScreen';
import MapScreen from './screens/MapScreen';
import StoresScreen from './screens/StoresScreen';
import SavedScreen from './screens/SavedScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import QRScreen from './screens/QRScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: { [key: string]: React.ReactNode } = {
            Home: <Home size={size} color={color} />,
            Deals: <Search size={size} color={color} />,
            MapRadar: <MapPin size={size} color={color} />,
            Stores: <Store size={size} color={color} />,
            Saved: <View style={{ position: 'relative' }}><Bell size={size} color={color} /></View>,
            Profile: <User size={size} color={color} />,
          };
          return icons[route.name] || null;
        },
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Deals" component={DealsScreen} />
      <Tab.Screen name="MapRadar" component={MapScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="QRCode"
        component={QRScreen}
        options={{
          headerShown: true,
          title: 'My QR Code',
          headerStyle: { backgroundColor: '#DC2626' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: true,
          title: 'Notifications',
          headerStyle: { backgroundColor: '#DC2626' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}
