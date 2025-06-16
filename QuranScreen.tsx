import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Card, Title, Paragraph, Button, Divider, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import components (to be created)
import SurahList from '../components/SurahList';
import ReadingGoals from '../components/ReadingGoals';
import BookmarksList from '../components/BookmarksList';

const QuranScreen = () => {
  const dispatch = useDispatch();
  const { currentPosition, readingGoals, bookmarks } = useSelector((state: RootState) => state.quran);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'read' | 'bookmarks' | 'goals'>('read');
  
  const onChangeSearch = (query: string) => setSearchQuery(query);
  
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'read' && styles.activeTab]}
          onPress={() => setActiveTab('read')}
        >
          <Text style={[styles.tabText, activeTab === 'read' && styles.activeTabText]}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
          onPress={() => setActiveTab('bookmarks')}
        >
          <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>Goals</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'read' && (
        <ScrollView style={styles.tabContent}>
          {/* Continue Reading Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Continue Reading</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.continueReadingContainer}>
                <View style={styles.positionInfo}>
                  <Text style={styles.surahName}>Surah Al-Baqarah</Text>
                  <Text style={styles.positionDetails}>Ayah {currentPosition.ayah}, Page {currentPosition.page}, Juz {currentPosition.juz}</Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.continueButton}
                  onPress={() => {
                    // Navigate to Quran reader
                  }}
                >
                  Continue
                </Button>
              </View>
            </Card.Content>
          </Card>
          
          {/* Search Bar */}
          <Searchbar
            placeholder="Search Surah or Ayah"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          {/* Surah List */}
          <SurahList searchQuery={searchQuery} />
        </ScrollView>
      )}
      
      {activeTab === 'bookmarks' && (
        <ScrollView style={styles.tabContent}>
          {/* Bookmarks List */}
          <BookmarksList bookmarks={bookmarks} />
        </ScrollView>
      )}
      
      {activeTab === 'goals' && (
        <ScrollView style={styles.tabContent}>
          {/* Reading Goals */}
          <ReadingGoals goals={readingGoals} />
        </ScrollView>
      )}
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
    borderBottomColor: '#673AB7', // Purple for Quran
  },
  tabText: {
    color: '#757575',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#673AB7',
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
  continueReadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  positionInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  positionDetails: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#673AB7',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
});

export default QuranScreen;
