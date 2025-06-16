import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Card, Title, Paragraph, Button, Divider, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import components (to be created)
import PrayerTimesCard from '../components/PrayerTimesCard';
import MissedPrayersCard from '../components/MissedPrayersCard';

const PrayerScreen = () => {
  const dispatch = useDispatch();
  const { times, currentPrayer, missedPrayers } = useSelector((state: RootState) => state.prayer);
  
  return (
    <ScrollView style={styles.container}>
      {/* Current Prayer Card */}
      <Card style={styles.currentPrayerCard}>
        <Card.Content>
          <View style={styles.currentPrayerHeader}>
            <View>
              <Title style={styles.currentPrayerTitle}>
                {currentPrayer?.name.charAt(0).toUpperCase() + currentPrayer?.name.slice(1)}
              </Title>
              <Paragraph style={styles.currentPrayerTime}>{currentPrayer?.time}</Paragraph>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{currentPrayer?.score.toFixed(1)}</Text>
              <Text style={styles.scoreLabel}>/10</Text>
            </View>
          </View>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerValue}>29:59</Text>
            </View>
            <ProgressBar
              progress={0.8}
              color={currentPrayer?.score > 7 ? '#4CAF50' : currentPrayer?.score > 4 ? '#FFC107' : '#F44336'}
              style={styles.timerProgress}
            />
          </View>
          
          <Button
            mode="contained"
            style={styles.registerButton}
            labelStyle={styles.registerButtonLabel}
            onPress={() => {
              // Handle prayer registration
            }}
            disabled={currentPrayer?.registered}
          >
            {currentPrayer?.registered ? 'Prayer Registered' : 'Register Prayer'}
          </Button>
          
          {currentPrayer?.registered && (
            <Button
              mode="outlined"
              style={styles.notifyButton}
              labelStyle={styles.notifyButtonLabel}
              onPress={() => {
                // Handle notify friends
              }}
            >
              Notify Friends
            </Button>
          )}
        </Card.Content>
      </Card>
      
      {/* Prayer Times Card */}
      <PrayerTimesCard times={times} currentPrayer={currentPrayer?.name} />
      
      {/* Missed Prayers Card */}
      {missedPrayers.length > 0 && (
        <MissedPrayersCard missedPrayers={missedPrayers} />
      )}
      
      {/* Nearest Mosques Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Nearest Mosques</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.mosqueContainer}>
            <Icon name="map-marker" size={24} color="#4CAF50" style={styles.mosqueIcon} />
            <View style={styles.mosqueInfo}>
              <Text style={styles.mosqueName}>Al-Noor Mosque</Text>
              <Text style={styles.mosqueDistance}>1.2 km away</Text>
            </View>
            <Button
              mode="text"
              onPress={() => {
                // Open directions
              }}
            >
              Directions
            </Button>
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.mosqueContainer}>
            <Icon name="map-marker" size={24} color="#4CAF50" style={styles.mosqueIcon} />
            <View style={styles.mosqueInfo}>
              <Text style={styles.mosqueName}>Islamic Center</Text>
              <Text style={styles.mosqueDistance}>2.5 km away</Text>
            </View>
            <Button
              mode="text"
              onPress={() => {
                // Open directions
              }}
            >
              Directions
            </Button>
          </View>
          
          <Button
            mode="text"
            style={styles.viewAllButton}
            onPress={() => {
              // View all mosques
            }}
          >
            View All Nearby Mosques
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  currentPrayerCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  currentPrayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPrayerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
  },
  currentPrayerTime: {
    fontSize: 16,
    color: '#757575',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 2,
  },
  timerContainer: {
    marginVertical: 16,
  },
  timerLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#424242',
  },
  timerProgress: {
    height: 8,
    borderRadius: 4,
  },
  registerButton: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notifyButton: {
    marginTop: 8,
    borderColor: '#4CAF50',
  },
  notifyButtonLabel: {
    color: '#4CAF50',
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
  mosqueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  mosqueIcon: {
    marginRight: 12,
  },
  mosqueInfo: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
  },
  mosqueDistance: {
    fontSize: 14,
    color: '#757575',
  },
  itemDivider: {
    marginVertical: 8,
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});

export default PrayerScreen;
