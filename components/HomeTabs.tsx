import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Week from './Week';
import Settings from './Settings';
import Home from './Home';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
            paddingTop: 5,
            height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Hafta') iconName = 'calendar';
          else if (route.name === 'Anasayfa') iconName = 'home';
          else if (route.name === 'Ayarlar') iconName = 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Anasayfa" component={Home} />
      <Tab.Screen name="Hafta" component={Week} />
      <Tab.Screen name="Ayarlar" component={Settings} />
    </Tab.Navigator>
  );
}
