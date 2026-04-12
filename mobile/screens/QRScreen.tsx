import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Share2, Info, ScanLine, QrCode, X, Flashlight, FlashlightOff } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface QRScreenProps {
  route?: {
    params?: {
      mode?: 'show' | 'scan';
    };
  };
}

export default function QRScreen({ route }: QRScreenProps) {
  const [activeTab, setActiveTab] = useState<'show' | 'scan'>(route?.params?.mode || 'show');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Mock user QR code - in real app, get from API
  const userQRCode = 'MKBF-USER-12345-67890';
  const userName = 'John Doe';
  const memberSince = 'January 2024';
  const membershipLevel = 'Gold Member';

  useEffect(() => {
    if (activeTab === 'scan' && !permission?.granted) {
      requestPermission();
    }
  }, [activeTab, permission]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My MK Black Friday Radar Member QR Code: ${userQRCode}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    const scannedData = result.data;
    setScanResult(scannedData);

    // Send to backend for verification
    try {
      // In real app, call the API
      // const response = await fetch('/api/qr/scan', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify({ code: scannedData })
      // });
      // const data = await response.json();

      // Mock response
      Alert.alert(
        'QR Code Scanned!',
        `Code: ${scannedData}\n\nIn production, this would verify the code with the backend.`,
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'OK',
            onPress: () => setScanned(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to verify QR code');
      setScanned(false);
    }
  };

  const renderShowTab = () => (
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
            Покажете го овој QR код во продавниците за попуст / Tregoni këtë kod QR në dyqane për zbritje
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
        <Text style={styles.benefitsTitle}>Member Benefits / Përfitimet</Text>
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
  );

  const renderScanTab = () => {
    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera permission is required to scan QR codes.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scanContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          enableTorch={torchEnabled}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Scan Frame Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>
              Скенирајте QR код за понуда / Skanoni kodin QR për ofertë
            </Text>
          </View>

          {/* Torch Button */}
          <TouchableOpacity
            style={styles.torchButton}
            onPress={() => setTorchEnabled(!torchEnabled)}
          >
            {torchEnabled ? (
              <FlashlightOff color="#fff" size={24} />
            ) : (
              <Flashlight color="#fff" size={24} />
            )}
          </TouchableOpacity>
        </CameraView>

        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Scan Again / Skano Përsëri</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'show' && styles.tabActive]}
          onPress={() => setActiveTab('show')}
        >
          <QrCode color={activeTab === 'show' ? '#DC2626' : '#6B7280'} size={20} />
          <Text style={[styles.tabText, activeTab === 'show' && styles.tabTextActive]}>
            My QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.tabActive]}
          onPress={() => setActiveTab('scan')}
        >
          <ScanLine color={activeTab === 'scan' ? '#DC2626' : '#6B7280'} size={20} />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.tabTextActive]}>
            Scan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'show' ? renderShowTab() : renderScanTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#FEF2F2',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#DC2626',
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
  // Scan Tab Styles
  scanContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#DC2626',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
  torchButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 30,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
