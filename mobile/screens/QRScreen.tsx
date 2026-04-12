import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Share2, Info } from 'lucide-react-native';

export default function QRScreen() {
  // Mock user QR code
  const userQRCode = 'MKBF-USER-12345-67890';
  const userName = 'John Doe';
  const memberSince = 'January 2024';
  const membershipLevel = 'Gold Member';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My MK Black Friday Radar Member QR Code: ${userQRCode}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Member Card */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.brandText}>MK BLACK FRIDAY</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>{membershipLevel}</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.memberSince}>Member since {memberSince}</Text>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBackground}>
              <QRCode
                value={userQRCode}
                size={200}
                backgroundColor="#fff"
                color="#111827"
              />
            </View>
            <Text style={styles.qrCodeText}>{userQRCode}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Info color="#6B7280" size={16} />
            <Text style={styles.instructionsText}>
              Show this QR code at partner stores to get exclusive member discounts
            </Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 color="#fff" size={20} />
          <Text style={styles.shareButtonText}>Share QR Code</Text>
        </TouchableOpacity>

        {/* Store Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Member Benefits</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎁</Text>
            <Text style={styles.benefitText}>Extra 5% off at partner stores</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <Text style={styles.benefitText}>Early access to flash deals</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📱</Text>
            <Text style={styles.benefitText}>Instant deal notifications</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  memberBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  memberSince: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrBackground: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  qrCodeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    fontFamily: 'monospace',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    lineHeight: 18,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  benefitsContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
  },
});
