// src/components/MissedPrayersCard.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Checkbox } from 'react-native-paper';

// Mock data for missed prayers
const mockMissedPrayers = [
  { id: '1', name: 'Fajr', date: 'Oct 23, 2023', done: false },
  { id: '2', name: 'Dhuhr', date: 'Oct 22, 2023', done: false },
  { id: '3', name: 'Asr', date: 'Oct 22, 2023', done: true },
];

const MissedPrayersCard = () => {
  const [missedPrayers, setMissedPrayers] = React.useState(mockMissedPrayers);

  const toggleDone = (id: string) => {
    setMissedPrayers(prev =>
      prev.map(p => p.id === id ? {...p, done: !p.done} : p)
    );
  };

  const renderItem = ({ item }: { item: typeof mockMissedPrayers[0] }) => (
    <View style={styles.itemContainer}>
      <Checkbox
        status={item.done ? 'checked' : 'unchecked'}
        onPress={() => toggleDone(item.id)}
      />
      <View style={styles.itemTextContainer}>
        <Text style={[styles.prayerName, item.done && styles.doneText]}>{item.name}</Text>
        <Text style={[styles.prayerDate, item.done && styles.doneText]}>{item.date}</Text>
      </View>
      <Button
        mode="text"
        onPress={() => toggleDone(item.id)}
        disabled={item.done} // Example: disable if already marked done
      >
        {item.done ? 'Done' : 'Mark Prayed'}
      </Button>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Missed Prayers</Title>
        {missedPrayers.filter(p => !p.done).length > 0 ? (
          <Paragraph>You have {missedPrayers.filter(p => !p.done).length} pending prayers to make up.</Paragraph>
        ) : (
          <Paragraph>No pending missed prayers. Alhamdulillah!</Paragraph>
        )}
        <FlatList
          data={missedPrayers}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 2,
  },
  list: {
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  prayerDate: {
    fontSize: 12,
    color: 'gray',
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  }
});

export default MissedPrayersCard;
