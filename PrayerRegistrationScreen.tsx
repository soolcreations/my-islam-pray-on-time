// Prayer Registration Screen for mobile app
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PrayerTime } from '@shared/types';
import { PrayerScoringService } from '@shared/services/prayerScoringService';
import { PrayerStorageService } from '@shared/services/prayerStorageService';

const PrayerRegistrationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { prayer } = route.params as { prayer: PrayerTime };
  
  const [atMosque, setAtMosque] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle prayer registration
  const handleRegisterPrayer = () => {
    setIsRegistering(true);
    
    // Get current time for registration
    const registrationTime = new Date();
    
    // Calculate score
    const scoringService = new PrayerScoringService();
    const score = scoringService.calculateScore(prayer, registrationTime, atMosque);
    
    // Store prayer record
    const storageService = new PrayerStorageService();
    const userId = 'user123'; // In a real app, this would be the authenticated user's ID
    const record = storageService.storePrayerRecord(userId, score);
    
    // Show result and navigate back
    Alert.alert(
      'Prayer Registered',
      `Your ${prayer.displayName} prayer has been registered with a score of ${score.score.toFixed(1)}/10.`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            setIsRegistering(false);
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register {prayer.displayName} Prayer</Text>
        
        <View style={styles.timeInfo}>
          <Text style={styles.label}>Scheduled Time:</Text>
          <Text style={styles.time}>{formatTime(prayer.time)}</Text>
        </View>
        
        <View style={styles.timeInfo}>
          <Text style={styles.label}>Current Time:</Text>
          <Text style={styles.time}>{formatTime(new Date())}</Text>
        </View>
        
        <View style={styles.mosqueOption}>
          <Text style={styles.mosqueText}>Prayer performed at mosque</Text>
          <Switch
            value={atMosque}
            onValueChange={setAtMosque}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={atMosque ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <Text style={styles.scoreInfo}>
          {atMosque 
            ? 'Prayers at mosque automatically receive a score of 10/10!'
            : 'Your score will be calculated based on how promptly you prayed.'}
        </Text>
        
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegisterPrayer}
          disabled={isRegistering}
        >
          <Text style={styles.registerButtonText}>
            {isRegistering ? 'Registering...' : 'Register Prayer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mosqueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  mosqueText: {
    fontSize: 16,
  },
  scoreInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrayerRegistrationScreen;
