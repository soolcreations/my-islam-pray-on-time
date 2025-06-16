import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Subheading } from 'react-native-paper';
import MissedPrayersCard from '../components/MissedPrayersCard'; // Assuming path

// Mock data for demonstration
const mockPrayerTimes = {
  current: { name: 'Asr', time: '4:30 PM', endsIn: '1h 15m' },
  next: { name: 'Maghrib', time: '6:45 PM', startsIn: '1h 15m' },
  upcoming: [
    { name: 'Isha', time: '8:00 PM' },
  ]
};

const PrayerScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Prayer Details</Title>

      {/* Current & Upcoming Prayer Times Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subHeader}>Current Prayer</Subheading>
          <Paragraph>{mockPrayerTimes.current.name} at {mockPrayerTimes.current.time}</Paragraph>
          <Paragraph>Time remaining: {mockPrayerTimes.current.endsIn}</Paragraph>
          <Divider style={styles.divider} />
          <Subheading style={styles.subHeader}>Next Prayer</Subheading>
          <Paragraph>{mockPrayerTimes.next.name} at {mockPrayerTimes.next.time}</Paragraph>
          <Paragraph>Starts in: {mockPrayerTimes.next.startsIn}</Paragraph>
          {/* Can list more upcoming prayers if needed */}
        </Card.Content>
      </Card>

      {/* Missed Prayers Section */}
      <MissedPrayersCard />

      {/* Nearest Mosques Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subHeader}>Nearest Mosques</Subheading>
          <Paragraph>Find mosques in your vicinity.</Paragraph>
          {/* Placeholder for map or list */}
          <View style={styles.mapPlaceholder}>
            <Text>Mosque Locator / Map Area</Text>
          </View>
          <Button mode="contained" style={styles.findButton} onPress={() => console.log('Find Mosques pressed')}>
            Find Nearby Mosques
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  findButton: {
    marginTop: 10,
  }
});

export default PrayerScreen;
