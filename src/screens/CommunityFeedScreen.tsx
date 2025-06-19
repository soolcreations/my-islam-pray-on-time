import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper'; // Optional, for styling

// Assume prayer times and current prayer data would come from Redux store or a service
// For now, using placeholder data
const mockPrayerData = {
  currentPrayerName: 'Fajr',
  prayerEndTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Example: 1 hour from now
  registeredScore: null, // or a number if registered
};

const CommunityFeedScreen = () => {
  const [countdown, setCountdown] = useState('');
  const [currentPrayerName, setCurrentPrayerName] = useState('Loading...');
  const [prayerScore, setPrayerScore] = useState('-');

  useEffect(() => {
    // Placeholder logic for countdown
    // In a real app, this would subscribe to prayer time updates and calculate countdown
    setCurrentPrayerName(mockPrayerData.currentPrayerName);
    if (mockPrayerData.registeredScore !== null) {
      setPrayerScore(mockPrayerData.registeredScore.toString());
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = mockPrayerData.prayerEndTime.getTime() - now;

      if (distance < 0) {
        setCountdown("Time's up!");
        // Logic for when prayer time ends (e.g., move to missed)
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRegisterPrayer = () => {
    // Placeholder for prayer registration logic
    // This would dispatch an action to Redux, calculate score, etc.
    console.log('Register Prayer button pressed');
    // Example: Update score locally for now
    const newScore = Math.floor(Math.random() * 5) + 5; // Random score for demo
    setPrayerScore(newScore.toString());
    // Disable button or change text after registration if needed
  };

  return (
    <View style={styles.container}>
      <Card style={styles.prayerCard}>
        <Card.Content>
          <Title>Next Prayer: {currentPrayerName}</Title>
          <Paragraph style={styles.countdownText}>Time Remaining: {countdown}</Paragraph>
          <View style={styles.countdownBarPlaceholder}>
            <Text>Visual Countdown Bar Placeholder</Text>
          </View>
          <Button title="Register Prayer" onPress={handleRegisterPrayer} />
          <Paragraph style={styles.scoreText}>Current Score: {prayerScore}/10</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.feedContainer}>
        <Text style={styles.feedTitle}>Community Feed</Text>
        {/* Placeholder for actual feed items */}
        <Text>Feed items will go here...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  prayerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  countdownBarPlaceholder: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  feedContainer: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CommunityFeedScreen;
