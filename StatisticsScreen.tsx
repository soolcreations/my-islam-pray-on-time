import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Card, Title, Paragraph, Divider, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import components (to be created)
import BadgesTab from '../components/BadgesTab';
import LeaderboardTab from '../components/LeaderboardTab';

const StatisticsScreen = () => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'badges' | 'leaderboard'>('overview');
  const { streaks } = useSelector((state: RootState) => state.prayer);
  const { readingGoals } = useSelector((state: RootState) => state.quran);
  
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <ScrollView style={styles.tabContent}>
          {/* Prayer Statistics */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Prayer Statistics</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon name="calendar-check" size={24} color="#4CAF50" />
                  <Paragraph style={styles.statLabel}>Current Streak</Paragraph>
                  <Text style={styles.statValue}>{streaks.current} days</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="trophy" size={24} color="#FFC107" />
                  <Paragraph style={styles.statLabel}>Longest Streak</Paragraph>
                  <Text style={styles.statValue}>{streaks.longest} days</Text>
                </View>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                  <Paragraph style={styles.statLabel}>On-time Rate</Paragraph>
                  <Text style={styles.statValue}>87%</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="mosque" size={24} color="#4CAF50" />
                  <Paragraph style={styles.statLabel}>Total Prayers</Paragraph>
                  <Text style={styles.statValue}>1,245</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          {/* Quran Statistics */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Quran Statistics</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Icon name="book-open-variant" size={24} color="#673AB7" />
                  <Paragraph style={styles.statLabel}>Pages Read</Paragraph>
                  <Text style={styles.statValue}>342</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="clock-outline" size={24} color="#673AB7" />
                  <Paragraph style={styles.statLabel}>Reading Time</Paragraph>
                  <Text style={styles.statValue}>48 hours</Text>
                </View>
              </View>
              
              {readingGoals.length > 0 && (
                <View style={styles.goalsContainer}>
                  <Paragraph style={styles.goalsTitle}>Reading Goals</Paragraph>
                  {readingGoals.map(goal => (
                    <View key={goal.id} style={styles.goalItem}>
                      <View style={styles.goalHeader}>
                        <Text style={styles.goalName}>{goal.type} goal</Text>
                        <Text style={styles.goalProgress}>
                          {goal.progress}/{goal.target} {goal.unit}
                        </Text>
                      </View>
                      <ProgressBar
                        progress={goal.progress / goal.target}
                        color={goal.completed ? '#4CAF50' : '#673AB7'}
                        style={styles.progressBar}
                      />
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
          
          {/* Combined Activity */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Activity Overview</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.activityContainer}>
                <Text style={styles.activityLabel}>This Week's Activity</Text>
                <View style={styles.activityChart}>
                  {/* Placeholder for activity chart */}
                  <Text style={styles.placeholderText}>Activity Chart</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
      
      {activeTab === 'badges' && <BadgesTab />}
      
      {activeTab === 'leaderboard' && <LeaderboardTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    color: '#757575',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  divider: {
    marginVertical: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  statLabel: {
    marginTop: 4,
    color: '#757575',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 4,
  },
  goalsContainer: {
    marginTop: 16,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalItem: {
    marginVertical: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalName: {
    color: '#424242',
    fontWeight: '500',
  },
  goalProgress: {
    color: '#757575',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  activityContainer: {
    marginVertical: 8,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  activityChart: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9e9e9e',
  },
});

export default StatisticsScreen;
