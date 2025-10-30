import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  }
})