// Dashboard Screen for mobile app
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PrayerTimeCalculator } from '@shared/services/prayerTimeCalculator';
import { PrayerTime, PrayerDay, Coordinates } from '@shared/types';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const [prayerDay, setPrayerDay] = useState<PrayerDay | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigation = useNavigation();

  // Initialize with default location (will be replaced with geolocation in real app)
  const defaultCoordinates: Coordinates = {
    latitude: 37.7749,
    longitude: -122.4194
  };

  useEffect(() => {
    // Calculate prayer times
    const calculator = new PrayerTimeCalculator(defaultCoordinates);
    const prayers = calculator.calculatePrayerTimes(new Date());
    setPrayerDay(prayers);

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine prayer status
  const getPrayerStatus = (prayer: PrayerTime) => {
    if (!prayer.endTime) return 'upcoming';
    
    if (currentTime < prayer.time) {
      return 'upcoming';
    } else if (currentTime >= prayer.time && currentTime <= prayer.endTime) {
      return 'active';
    } else {
      return 'missed';
    }
  };

  // Navigate to prayer registration screen
  const handleRegisterPrayer = (prayer: PrayerTime) => {
    navigation.navigate('PrayerRegistration', { prayer });
  };

  if (!prayerDay) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading prayer times...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {currentTime.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <Text style={styles.currentTime}>
          {formatTime(currentTime)}
        </Text>
      </View>

      <View style={styles.prayersContainer}>
        {prayerDay.prayers.map((prayer, index) => {
          const status = getPrayerStatus(prayer);
          
          return (
            <View key={index} style={[
              styles.prayerCard,
              status === 'active' && styles.activePrayer,
              status === 'missed' && styles.missedPrayer
            ]}>
              <View style={styles.prayerInfo}>
                <Text style={styles.prayerName}>{prayer.displayName}</Text>
                <Text style={styles.prayerTime}>{formatTime(prayer.time)}</Text>
                {prayer.endTime && (
                  <Text style={styles.prayerEndTime}>
                    Until {formatTime(prayer.endTime)}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.registerButton,
                  status === 'upcoming' && styles.disabledButton,
                  status === 'missed' && styles.missedButton
                ]}
                onPress={() => handleRegisterPrayer(prayer)}
                disabled={status === 'upcoming'}
              >
                <Text style={styles.registerButtonText}>
                  {status === 'active' ? 'Register' : 
                   status === 'missed' ? 'Missed' : 'Upcoming'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Today's Statistics</Text>
        <Text style={styles.statsText}>Prayers completed: 0/5</Text>
        <Text style={styles.statsText}>Average score: 0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  currentTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  prayersContainer: {
    padding: 15,
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  activePrayer: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  missedPrayer: {
    borderLeftWidth: 5,
    borderLeftColor: '#F44336',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  prayerTime: {
    fontSize: 16,
    color: '#555',
  },
  prayerEndTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  missedButton: {
    backgroundColor: '#F44336',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DashboardScreen;
