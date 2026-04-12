import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Tag, MapPin, TrendingDown, Check } from 'lucide-react-native';

const notifications = [
  {
    id: 1,
    type: 'deal',
    title: "New Deal Alert!",
    message: "Anhoch just added 50% off gaming laptops - limited time!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: 'location',
    title: "Deal Near You",
    message: "TechnoMarket is 500m away with 30% off smartphones",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: 'price_drop',
    title: "Price Drop!",
    message: "TV you saved dropped from $800 to $720 - extra $80 off!",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: 'deal',
    title: "Flash Sale Started",
    message: "Neptun's 24-hour flash sale is live! Up to 60% off",
    time: "2 days ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'deal':
      return <Tag color="#DC2626" size={20} />;
    case 'location':
      return <MapPin color="#3B82F6" size={20} />;
    case 'price_drop':
      return <TrendingDown color="#10B981" size={20} />;
    default:
      return <Bell color="#6B7280" size={20} />;
  }
};

const getIconBackground = (type: string) => {
  switch (type) {
    case 'deal':
      return '#FEF2F2';
    case 'location':
      return '#EFF6FF';
    case 'price_drop':
      return '#ECFDF5';
    default:
      return '#F3F4F6';
  }
};

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationCard, !notification.read && styles.unreadCard]}
          >
            <View style={[styles.iconContainer, { backgroundColor: getIconBackground(notification.type) }]}>
              {getIcon(notification.type)}
            </View>

            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell color="#D1D5DB" size={48} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>We'll notify you about deals and price drops</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  markAllText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadCard: {
    backgroundColor: '#FEF2F2',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});
