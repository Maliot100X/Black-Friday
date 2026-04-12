import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag, TrendingDown, Store, Trash2 } from 'lucide-react-native';

const savedDeals = [
  {
    id: 1,
    title: "50% Off Laptops",
    store: "Anhoch Skopje",
    price: 449.99,
    originalPrice: 899.99,
    discount: 50,
    savedAt: "2 days ago",
  },
  {
    id: 2,
    title: "40% Off TVs",
    store: "Neptun",
    price: 720.00,
    originalPrice: 1200.00,
    discount: 40,
    savedAt: "1 week ago",
  },
  {
    id: 3,
    title: "Budget Tablet Deals",
    store: "TechnoMarket",
    price: 249.99,
    originalPrice: 449.99,
    discount: 45,
    savedAt: "3 days ago",
  },
];

export default function SavedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Deals</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedDeals.length}</Text>
            <Text style={styles.statLabel}>Saved Deals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$420</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
        </View>

        {/* Saved Deals List */}
        <View style={styles.dealsContainer}>
          <Text style={styles.sectionTitle}>Your Saved Deals</Text>

          {savedDeals.map((deal) => (
            <View key={deal.id} style={styles.dealCard}>
              <View style={styles.dealImage}>
                <Tag color="#9CA3AF" size={30} />
              </View>

              <View style={styles.dealContent}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <View style={styles.storeRow}>
                  <Store size={14} color="#6B7280" />
                  <Text style={styles.storeText}>{deal.store}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.discountPrice}>${deal.price.toFixed(2)}</Text>
                  <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
                </View>

                <View style={styles.dealFooter}>
                  <View style={styles.discountBadge}>
                    <TrendingDown color="#fff" size={12} />
                    <Text style={styles.discountText}>{deal.discount}% OFF</Text>
                  </View>
                  <Text style={styles.savedAt}>Saved {deal.savedAt}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteButton}>
                <Trash2 color="#EF4444" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Empty State (if no deals) */}
        {savedDeals.length === 0 && (
          <View style={styles.emptyState}>
            <Tag color="#D1D5DB" size={48} />
            <Text style={styles.emptyTitle}>No saved deals</Text>
            <Text style={styles.emptyText}>Browse deals and save your favorites</Text>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  dealsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dealCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  dealImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealContent: {
    flex: 1,
    marginLeft: 12,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  storeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  savedAt: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
