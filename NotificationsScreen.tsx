import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Card, Title, Paragraph, Button, Divider, Avatar, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../store/slices/notificationsSlice';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };
  
  const handleNotificationPress = (id: string) => {
    dispatch(markNotificationAsRead(id));
    // Handle navigation or action based on notification type
  };
  
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'prayer':
        return <Icon name="mosque" size={24} color="#4CAF50" />;
      case 'quran':
        return <Icon name="book-open-variant" size={24} color="#673AB7" />;
      case 'badge':
        return <Icon name="trophy" size={24} color="#FFC107" />;
      case 'friend':
        return <Icon name="account" size={24} color="#2196F3" />;
      default:
        return <Icon name="bell" size={24} color="#757575" />;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header with mark all as read button */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Notifications</Title>
        {unreadCount > 0 && (
          <Button
            mode="text"
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            Mark All as Read
          </Button>
        )}
      </View>
      
      {/* Notifications list */}
      <ScrollView style={styles.notificationsList}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => handleNotificationPress(notification.id)}
            >
              <View style={styles.notificationIcon}>
                {renderNotificationIcon(notification.type)}
                {!notification.read && (
                  <Badge size={8} style={styles.unreadBadge} />
                )}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {' · '}
                  {new Date(notification.timestamp).toLocaleDateString()}
                </Text>
              </View>
              {notification.actionable && (
                <Icon name="chevron-right" size={24} color="#757575" style={styles.actionIcon} />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  markAllButton: {
    marginLeft: 8,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
  },
  notificationIcon: {
    marginRight: 16,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#2196F3',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  actionIcon: {
    alignSelf: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
  },
  emptyText: {
    marginTop: 16,
    color: '#757575',
    fontSize: 16,
  },
});

export default NotificationsScreen;
