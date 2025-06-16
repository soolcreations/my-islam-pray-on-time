import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setActiveFilter } from '../store/slices/socialSlice';
import { Card, Avatar, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import components (to be created)
import StoryCircles from '../components/StoryCircles';
import PrayerCountdown from '../components/PrayerCountdown';
import PostCard from '../components/PostCard';
import CreatePostInput from '../components/CreatePostInput';

const CommunityFeedScreen = () => {
  const dispatch = useDispatch();
  const { feed, activeFilter } = useSelector((state: RootState) => state.social);
  const { currentPrayer } = useSelector((state: RootState) => state.prayer);
  
  // Filter posts based on active filter
  const filteredPosts = activeFilter === 'all' 
    ? feed 
    : feed.filter(post => post.type === activeFilter);

  return (
    <ScrollView style={styles.container}>
      {/* Prayer Countdown Timer */}
      {currentPrayer && (
        <PrayerCountdown 
          prayer={currentPrayer}
        />
      )}
      
      {/* Story Circles */}
      <StoryCircles />
      
      {/* Create Post Input */}
      <CreatePostInput />
      
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
          onPress={() => dispatch(setActiveFilter('all'))}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'prayers' && styles.activeFilterTab]}
          onPress={() => dispatch(setActiveFilter('prayers'))}
        >
          <Text style={[styles.filterText, activeFilter === 'prayers' && styles.activeFilterText]}>Prayers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'quran' && styles.activeFilterTab]}
          onPress={() => dispatch(setActiveFilter('quran'))}
        >
          <Text style={[styles.filterText, activeFilter === 'quran' && styles.activeFilterText]}>Quran</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'badges' && styles.activeFilterTab]}
          onPress={() => dispatch(setActiveFilter('badges'))}
        >
          <Text style={[styles.filterText, activeFilter === 'badges' && styles.activeFilterText]}>Badges</Text>
        </TouchableOpacity>
      </View>
      
      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="post-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No posts to show</Text>
        </View>
      ) : (
        filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  filterText: {
    color: '#757575',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    color: '#757575',
    fontSize: 16,
  },
});

export default CommunityFeedScreen;
