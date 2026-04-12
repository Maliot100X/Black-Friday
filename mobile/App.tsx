import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Search, MapPin, Store, User, Bell } from 'lucide-react-native';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@expo/react-native-async-storage';

// Screens
import HomeScreen from './screens/HomeScreen';
import DealsScreen from './screens/DealsScreen';
import MapScreen from './screens/MapScreen';
import StoresScreen from './screens/StoresScreen';
import SavedScreen from './screens/SavedScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import QRScreen from './screens/QRScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Auth Navigator (Login/Register)
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

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
function RootNavigator({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DC2626' }}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ marginTop: 16, color: '#fff', fontSize: 18 }}>MK Black Friday Radar</Text>
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}
