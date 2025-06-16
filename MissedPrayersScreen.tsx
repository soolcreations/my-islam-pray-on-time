// Missed Prayers Screen for mobile app
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { PrayerStorageService, PrayerRecord } from '@shared/services/prayerStorageService';

const MissedPrayersScreen = () => {
  const [missedPrayers, setMissedPrayers] = useState<PrayerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock user ID (would come from authentication in a real app)
  const userId = 'user123';
  
  useEffect(() => {
    // Load missed prayers
    const storageService = new PrayerStorageService();
    const prayers = storageService.getMissedPrayers(userId);
    setMissedPrayers(prayers);
    setLoading(false);
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle marking a prayer as made up
  const handleMarkAsMadeUp = (prayerId: string) => {
    Alert.alert(
      'Mark as Made Up',
      'Are you sure you want to mark this prayer as made up?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            const storageService = new PrayerStorageService();
            const success = storageService.markPrayerAsMadeUp(userId, prayerId);
            
            if (success) {
              // Update the list
              setMissedPrayers(missedPrayers.filter(prayer => prayer.id !== prayerId));
              Alert.alert('Success', 'Prayer marked as made up successfully.');
            } else {
              Alert.alert('Error', 'Failed to mark prayer as made up.');
            }
          }
        }
      ]
    );
  };
  
  // Render each missed prayer item
  const renderPrayerItem = ({ item }: { item: PrayerRecord }) => (
    <View style={styles.prayerItem}>
      <View style={styles.prayerInfo}>
        <Text style={styles.prayerName}>
          {item.prayerName.charAt(0).toUpperCase() + item.prayerName.slice(1)}
        </Text>
        <Text style={styles.prayerDate}>{formatDate(item.date)}</Text>
        <Text style={styles.prayerTime}>
          Scheduled: {formatTime(item.scheduledTime)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.makeUpButton}
        onPress={() => handleMarkAsMadeUp(item.id)}
      >
        <Text style={styles.makeUpButtonText}>Mark as Made Up</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading missed prayers...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missed Prayers</Text>
      
      {missedPrayers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No missed prayers! Keep up the good work.
          </Text>
        </View>
      ) : (
        <FlatList
          data={missedPrayers}
          renderItem={renderPrayerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  prayerItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  prayerDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
  prayerTime: {
    fontSize: 14,
    color: '#777',
  },
  makeUpButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  makeUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MissedPrayersScreen;
