import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Card, Title, Paragraph, Switch, Divider, List, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // State for settings
  const [darkMode, setDarkMode] = React.useState(false);
  const [prayerNotifications, setPrayerNotifications] = React.useState(true);
  const [socialNotifications, setSocialNotifications] = React.useState(true);
  const [quranNotifications, setQuranNotifications] = React.useState(true);
  const [shareActivity, setShareActivity] = React.useState('friends');
  
  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image 
              size={80} 
              source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name }} 
            />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{user?.name}</Title>
              <Paragraph style={styles.profileEmail}>{user?.email}</Paragraph>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color="#4CAF50"
            />
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>English</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Prayer Calculation Method</Text>
              <Text style={styles.settingDescription}>North America (ISNA)</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        </Card.Content>
      </Card>
      
      {/* Notification Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Notification Settings</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Prayer Times</Text>
              <Text style={styles.settingDescription}>Receive prayer time reminders</Text>
            </View>
            <Switch
              value={prayerNotifications}
              onValueChange={setPrayerNotifications}
              color="#4CAF50"
            />
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Social Activity</Text>
              <Text style={styles.settingDescription}>Friend reminders and activity</Text>
            </View>
            <Switch
              value={socialNotifications}
              onValueChange={setSocialNotifications}
              color="#4CAF50"
            />
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Quran Goals</Text>
              <Text style={styles.settingDescription}>Reading reminders and achievements</Text>
            </View>
            <Switch
              value={quranNotifications}
              onValueChange={setQuranNotifications}
              color="#4CAF50"
            />
          </View>
        </Card.Content>
      </Card>
      
      {/* Privacy Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Privacy Settings</Title>
          <Divider style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Who can see my activity</Text>
              <Text style={styles.settingDescription}>{shareActivity === 'everyone' ? 'Everyone' : shareActivity === 'friends' ? 'Friends Only' : 'No One'}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Who can send me reminders</Text>
              <Text style={styles.settingDescription}>Friends Only</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Blocked Users</Text>
              <Text style={styles.settingDescription}>Manage blocked users</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        </Card.Content>
      </Card>
      
      {/* About & Support */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About & Support</Title>
          <Divider style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help with the app</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
  profileEmail: {
    fontSize: 14,
    color: '#757575',
  },
  editProfileButton: {
    marginTop: 8,
  },
  editProfileText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  divider: {
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  itemDivider: {
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
