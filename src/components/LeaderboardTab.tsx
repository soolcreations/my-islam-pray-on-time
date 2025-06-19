// src/components/LeaderboardTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const LeaderboardTab = () => {
  return (
    <View style={styles.container}>
      <Title>Leaderboard</Title>
      <Text>Leaderboard content (e.g., Friends, Global) will go here.</Text>
      {/* Placeholder for actual leaderboard list */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
});

export default LeaderboardTab;
