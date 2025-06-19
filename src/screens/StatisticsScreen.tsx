import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Subheading, Divider } from 'react-native-paper';
import LeaderboardTab from '../components/LeaderboardTab'; // Assuming path

// Mock data for demonstration
const mockStats = {
  prayer: {
    averageDailyScore: 7.8,
    trendsData: 'Upward trend for the last 7 days', // Could be more complex data for a chart
  },
  quran: {
    pagesRead: 150,
    timeSpent: '10h 30m',
  },
};

const StatisticsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Your Statistics</Title>

      {/* Prayer Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subHeader}>Prayer Performance</Subheading>
          <Divider style={styles.divider} />
          <Paragraph>Average Daily Score: {mockStats.prayer.averageDailyScore}/10</Paragraph>
          <Paragraph>Prayer Trends: {mockStats.prayer.trendsData}</Paragraph>
          {/* Placeholder for more detailed charts or graphs */}
          <View style={styles.chartPlaceholder}>
            <Text>Prayer Trends Chart Area</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quran Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.subHeader}>Quran Reading</Subheading>
          <Divider style={styles.divider} />
          <Paragraph>Pages Read: {mockStats.quran.pagesRead}</Paragraph>
          <Paragraph>Time Spent Reading: {mockStats.quran.timeSpent}</Paragraph>
          {/* Placeholder for reading history or goals */}
          <View style={styles.chartPlaceholder}>
            <Text>Quran Reading Progress Chart Area</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Leaderboard Section */}
      <View style={styles.leaderboardSection}>
        {/* This component will be fleshed out later */}
        <LeaderboardTab />
      </View>
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
    color: '#333', // Darker color for subheadings
  },
  divider: {
    marginVertical: 8,
  },
  chartPlaceholder: {
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  leaderboardSection: {
    marginTop: 16,
  }
});

export default StatisticsScreen;
