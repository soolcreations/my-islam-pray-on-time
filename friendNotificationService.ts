// Friend Notification Service Implementation
import { firestore, functions, messaging } from 'firebase/app';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  UserPrivacySettings, 
  FriendRelationship, 
  PrayerReminder, 
  PrayerStatus 
} from '../types';

/**
 * Service for managing friend notifications with privacy controls
 */
export class FriendNotificationService {
  private db = firestore();
  
  /**
   * Check if a user can send a reminder to another user
   * @param senderUserId The ID of the user sending the reminder
   * @param receiverUserId The ID of the user receiving the reminder
   * @returns Permission result with allowed status and reason if denied
   */
  async canSendReminderTo(senderUserId: string, receiverUserId: string): Promise<{
    allowed: boolean;
    reason?: 'SENDER_DISABLED' | 'EXPLICITLY_BLOCKED' | 'NOT_FRIENDS' | 'GLOBALLY_DISABLED';
  }> {
    // Check if sender has permission to send reminders
    const senderSettingsDoc = await getDoc(doc(this.db, 'userPrivacySettings', senderUserId));
    const senderSettings = senderSettingsDoc.data() as UserPrivacySettings;
    
    if (!senderSettings || !senderSettings.reminderSendingEnabled) {
      return { allowed: false, reason: 'SENDER_DISABLED' };
    }
    
    // Check if users are friends
    const friendshipQuery = query(
      collection(this.db, 'friendRelationships'),
      where('userId', '==', senderUserId),
      where('friendId', '==', receiverUserId),
      where('status', '==', 'accepted')
    );
    
    const friendshipDocs = await getDocs(friendshipQuery);
    const areFriends = !friendshipDocs.empty;
    
    // Check receiver's permission settings
    const receiverSettingsDoc = await getDoc(doc(this.db, 'userPrivacySettings', receiverUserId));
    const receiverSettings = receiverSettingsDoc.data() as UserPrivacySettings;
    
    if (!receiverSettings) {
      // If no settings found, use default (friends only)
      return { allowed: areFriends, reason: areFriends ? undefined : 'NOT_FRIENDS' };
    }
    
    // Check if receiver has explicitly blocked sender
    if (receiverSettings.reminderPermissions.exceptions.blocked.includes(senderUserId)) {
      return { allowed: false, reason: 'EXPLICITLY_BLOCKED' };
    }
    
    // Check if receiver has explicitly allowed sender
    if (receiverSettings.reminderPermissions.exceptions.allowed.includes(senderUserId)) {
      return { allowed: true };
    }
    
    // Check general permission level
    switch (receiverSettings.reminderPermissions.level) {
      case 'everyone':
        return { allowed: true };
      case 'friends':
        return { allowed: areFriends, reason: areFriends ? undefined : 'NOT_FRIENDS' };
      case 'none':
        return { allowed: false, reason: 'GLOBALLY_DISABLED' };
      default:
        return { allowed: areFriends, reason: areFriends ? undefined : 'NOT_FRIENDS' };
    }
  }
  
  /**
   * Check if a user can view another user's prayer status
   * @param viewerUserId The ID of the user viewing the status
   * @param targetUserId The ID of the user whose status is being viewed
   * @returns Whether the viewer can see the target's prayer status
   */
  async canViewPrayerStatus(viewerUserId: string, targetUserId: string): Promise<boolean> {
    // Self can always see own status
    if (viewerUserId === targetUserId) {
      return true;
    }
    
    // Check if users are friends
    const friendshipQuery = query(
      collection(this.db, 'friendRelationships'),
      where('userId', '==', viewerUserId),
      where('friendId', '==', targetUserId),
      where('status', '==', 'accepted')
    );
    
    const friendshipDocs = await getDocs(friendshipQuery);
    const areFriends = !friendshipDocs.empty;
    
    // Get target user's privacy settings
    const targetSettingsDoc = await getDoc(doc(this.db, 'userPrivacySettings', targetUserId));
    const targetSettings = targetSettingsDoc.data() as UserPrivacySettings;
    
    if (!targetSettings) {
      // If no settings found, use default (friends only)
      return areFriends;
    }
    
    // Check visibility level
    switch (targetSettings.prayerStatusVisibility.level) {
      case 'everyone':
        return true;
      case 'friends':
        return areFriends;
      case 'none':
        return false;
      default:
        return areFriends;
    }
  }
  
  /**
   * Send a prayer reminder to a friend
   * @param senderUserId The ID of the user sending the reminder
   * @param receiverUserId The ID of the user receiving the reminder
   * @param prayerName The name of the prayer (e.g., 'fajr', 'dhuhr')
   * @param message Optional message to include with the reminder
   * @returns The created reminder or error information
   */
  async sendPrayerReminder(
    senderUserId: string, 
    receiverUserId: string, 
    prayerName: string, 
    message?: string
  ): Promise<{ success: boolean; reminderId?: string; error?: string }> {
    // Check permission first
    const permissionCheck = await this.canSendReminderTo(senderUserId, receiverUserId);
    
    if (!permissionCheck.allowed) {
      return { 
        success: false, 
        error: `Cannot send reminder: ${permissionCheck.reason}` 
      };
    }
    
    try {
      // Create the reminder document
      const reminderData: Omit<PrayerReminder, 'id'> = {
        senderId: senderUserId,
        receiverId: receiverUserId,
        prayerName,
        prayerTime: serverTimestamp(),
        sentAt: serverTimestamp(),
        status: 'sent',
        message: message || ''
      };
      
      const reminderRef = await addDoc(collection(this.db, 'prayerReminders'), reminderData);
      
      // Get receiver's notification preferences
      const receiverSettingsDoc = await getDoc(doc(this.db, 'userPrivacySettings', receiverUserId));
      const receiverSettings = receiverSettingsDoc.data() as UserPrivacySettings;
      
      // Send push notification if enabled
      if (receiverSettings?.notificationPreferences.friendReminders) {
        // Get receiver's FCM token
        const userDoc = await getDoc(doc(this.db, 'users', receiverUserId));
        const userData = userDoc.data();
        
        if (userData?.fcmToken) {
          // Get sender's name
          const senderDoc = await getDoc(doc(this.db, 'users', senderUserId));
          const senderData = senderDoc.data();
          const senderName = senderData?.displayName || 'A friend';
          
          // Send the notification
          await messaging().send({
            token: userData.fcmToken,
            notification: {
              title: `Prayer Reminder from ${senderName}`,
              body: message || `${senderName} is reminding you about ${prayerName} prayer.`
            },
            data: {
              type: 'prayer_reminder',
              reminderId: reminderRef.id,
              prayerName,
              senderId: senderUserId
            }
          });
          
          // Update reminder status to delivered
          await updateDoc(reminderRef, { status: 'delivered' });
        }
      }
      
      return { success: true, reminderId: reminderRef.id };
    } catch (error) {
      console.error('Error sending prayer reminder:', error);
      return { success: false, error: 'Failed to send reminder' };
    }
  }
  
  /**
   * Get all friends who haven't prayed a specific prayer yet
   * @param userId The ID of the user
   * @param prayerName The name of the prayer to check
   * @returns List of friends who haven't prayed yet and can receive reminders
   */
  async getFriendsWhoHaventPrayed(userId: string, prayerName: string): Promise<{
    id: string;
    displayName: string;
    canSendReminder: boolean;
    reasonIfBlocked?: string;
  }[]> {
    // Get all friends
    const friendshipsQuery = query(
      collection(this.db, 'friendRelationships'),
      where('userId', '==', userId),
      where('status', '==', 'accepted')
    );
    
    const friendshipDocs = await getDocs(friendshipsQuery);
    const friendIds = friendshipDocs.docs.map(doc => doc.data().friendId);
    
    if (friendIds.length === 0) {
      return [];
    }
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For each friend, check if they've prayed and if we can see their status
    const results = await Promise.all(
      friendIds.map(async (friendId) => {
        // Check if we can view their prayer status
        const canView = await this.canViewPrayerStatus(userId, friendId);
        
        if (!canView) {
          return null; // Skip friends whose status we can't see
        }
        
        // Check if they've prayed
        const prayerStatusQuery = query(
          collection(this.db, 'prayerStatus'),
          where('userId', '==', friendId),
          where('prayerName', '==', prayerName),
          where('date', '>=', today)
        );
        
        const prayerStatusDocs = await getDocs(prayerStatusQuery);
        const hasPrayed = !prayerStatusDocs.empty;
        
        if (hasPrayed) {
          return null; // Skip friends who have already prayed
        }
        
        // Check if we can send them a reminder
        const permissionCheck = await this.canSendReminderTo(userId, friendId);
        
        // Get friend's display name
        const friendDoc = await getDoc(doc(this.db, 'users', friendId));
        const friendData = friendDoc.data();
        
        return {
          id: friendId,
          displayName: friendData?.displayName || 'Unknown Friend',
          canSendReminder: permissionCheck.allowed,
          reasonIfBlocked: permissionCheck.allowed ? undefined : permissionCheck.reason
        };
      })
    );
    
    // Filter out null results and sort by name
    return results
      .filter(result => result !== null)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
  
  /**
   * Get all reminders sent to a user
   * @param userId The ID of the user
   * @param limit Maximum number of reminders to return
   * @returns List of reminders with sender information
   */
  async getRemindersForUser(userId: string, limit = 20): Promise<{
    id: string;
    senderId: string;
    senderName: string;
    prayerName: string;
    sentAt: Date;
    message: string;
    status: 'sent' | 'delivered' | 'read';
  }[]> {
    const remindersQuery = query(
      collection(this.db, 'prayerReminders'),
      where('receiverId', '==', userId),
      limit
    );
    
    const reminderDocs = await getDocs(remindersQuery);
    
    // Get sender information for each reminder
    const reminders = await Promise.all(
      reminderDocs.docs.map(async (reminderDoc) => {
        const reminderData = reminderDoc.data() as PrayerReminder;
        
        // Get sender's name
        const senderDoc = await getDoc(doc(this.db, 'users', reminderData.senderId));
        const senderData = senderDoc.data();
        
        return {
          id: reminderDoc.id,
          senderId: reminderData.senderId,
          senderName: senderData?.displayName || 'Unknown User',
          prayerName: reminderData.prayerName,
          sentAt: reminderData.sentAt.toDate(),
          message: reminderData.message || '',
          status: reminderData.status
        };
      })
    );
    
    // Sort by sent time, newest first
    return reminders.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }
  
  /**
   * Mark a reminder as read
   * @param reminderId The ID of the reminder
   * @returns Success status
   */
  async markReminderAsRead(reminderId: string): Promise<boolean> {
    try {
      await updateDoc(doc(this.db, 'prayerReminders', reminderId), {
        status: 'read'
      });
      return true;
    } catch (error) {
      console.error('Error marking reminder as read:', error);
      return false;
    }
  }
  
  /**
   * Update a user's privacy settings
   * @param userId The ID of the user
   * @param settings The new privacy settings
   * @returns Success status
   */
  async updatePrivacySettings(
    userId: string, 
    settings: Partial<UserPrivacySettings>
  ): Promise<boolean> {
    try {
      const settingsRef = doc(this.db, 'userPrivacySettings', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        // Update existing settings
        await updateDoc(settingsRef, {
          ...settings,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Create new settings with defaults for missing fields
        const defaultSettings: UserPrivacySettings = {
          userId,
          prayerStatusVisibility: {
            level: 'friends',
            lastUpdated: serverTimestamp()
          },
          reminderPermissions: {
            level: 'friends',
            lastUpdated: serverTimestamp(),
            exceptions: {
              allowed: [],
              blocked: []
            }
          },
          notificationPreferences: {
            missedPrayers: true,
            upcomingPrayers: true,
            friendReminders: true,
            dailySummary: false,
            lastUpdated: serverTimestamp()
          },
          reminderSendingEnabled: true,
          privacyVersion: 1
        };
        
        await setDoc(settingsRef, {
          ...defaultSettings,
          ...settings,
          lastUpdated: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const friendNotificationService = new FriendNotificationService();
