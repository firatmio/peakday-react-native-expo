import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setSession } from '../context/session';

export default function Welcome() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleStart = () => {
    setSession(true);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/welcome.png')}
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome!</Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={handleStart}>
        <Text style={styles.getStartedText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'column',
  },

  image: {
    width: 250,
    height: 250,
    marginTop: 20,
  },

  welcomeText: {
    fontSize: 48,
    fontWeight: '600',
    marginTop: 20,
  },

  getStartedButton: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: 30,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    width: Dimensions.get('window').width - 80,
  },

  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  }
});
