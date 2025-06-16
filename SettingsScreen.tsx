// Settings Screen for mobile app
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CalculationMethod, PrayerSettings, DEFAULT_PRAYER_SETTINGS } from '@shared/types';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<PrayerSettings>({...DEFAULT_PRAYER_SETTINGS});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // Handle calculation method change
  const handleMethodChange = (method: CalculationMethod) => {
    setSettings({
      ...settings,
      calculationMethod: method
    });
  };
  
  // Handle Asr method change
  const handleAsrMethodChange = (method: 'Standard' | 'Hanafi') => {
    setSettings({
      ...settings,
      asrMethod: method
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prayer Calculation</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Calculation Method</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={settings.calculationMethod}
              style={styles.picker}
              onValueChange={(itemValue) => handleMethodChange(itemValue as CalculationMethod)}
            >
              {Object.values(CalculationMethod).map((method) => (
                <Picker.Item key={method} label={method} value={method} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Asr Calculation</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={settings.asrMethod}
              style={styles.picker}
              onValueChange={(itemValue) => handleAsrMethodChange(itemValue as 'Standard' | 'Hanafi')}
            >
              <Picker.Item label="Standard (Shafi, Maliki, Hanbali)" value="Standard" />
              <Picker.Item label="Hanafi" value="Hanafi" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Prayer Time Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.settingItem, !notificationsEnabled && styles.disabledSetting]}>
          <Text style={[styles.settingLabel, !notificationsEnabled && styles.disabledText]}>
            Reminder Time
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              enabled={notificationsEnabled}
              selectedValue="10"
              style={styles.picker}
              onValueChange={() => {}}
            >
              <Picker.Item label="5 minutes before" value="5" />
              <Picker.Item label="10 minutes before" value="10" />
              <Picker.Item label="15 minutes before" value="15" />
              <Picker.Item label="30 minutes before" value="30" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkModeEnabled ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutText}>Version: 1.0.0</Text>
          <Text style={styles.aboutText}>Prayer Times App Prototype</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  disabledSetting: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  aboutItem: {
    paddingVertical: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
