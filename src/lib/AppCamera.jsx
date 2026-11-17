import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { Colors } from '../constants';
import AppIcon from './AppIcon';
import styles from './AppCamera.Style';

export const AppCamera = ({ visible, onClose, onCapture }) => {
  const [position, setPosition] = useState('front');
  const [isCapturing, setIsCapturing] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(position);
  const photoOutput = usePhotoOutput();

  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission();
    }
  }, [visible, hasPermission, requestPermission]);

  if (!visible) return null;

  const toggleCameraPosition = () => {
    setPosition((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleCapture = async () => {
    if (isCapturing || !photoOutput) return;

    try {
      setIsCapturing(true);
      const photo = await photoOutput.capturePhoto({ flashMode: 'off' }, {});
      const filePath = await photo.saveToTemporaryFileAsync();
      photo.dispose();

      const uri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

      if (onCapture) {
        onCapture({
          uri,
          type: 'image/jpeg',
          name: `camera_${Date.now()}.jpg`,
        });
      }
      onClose();
    } catch (err) {
      Alert.alert('Capture Failed', err.message || 'Could not take photo.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />

      {!hasPermission ? (
        <View style={styles.permissionContainer}>
          <AppIcon name="camera" size={50} color={Colors.primary} style={{ marginBottom: 16 }} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            Tinder needs access to your camera so you can take a profile photo.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Allow Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : !device ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>No Camera Found</Text>
          <Text style={styles.permissionText}>
            Could not find an available {position} camera on this device.
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            outputs={[photoOutput]}
            isActive={visible}
          />

          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBtn} onPress={onClose} activeOpacity={0.7}>
              <AppIcon name="times" size={20} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={toggleCameraPosition}
              activeOpacity={0.7}
            >
              <AppIcon name="refresh" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.captureBtnOuter}
              onPress={handleCapture}
              activeOpacity={0.7}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <View style={styles.captureBtnInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};

export const useAppCamera = (onImageSelected) => {
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const openAppCamera = () => setIsCameraVisible(true);
  const closeAppCamera = () => setIsCameraVisible(false);

  const handleCapture = (image) => {
    setIsCameraVisible(false);
    if (onImageSelected && image) {
      onImageSelected(image);
    }
  };

  const CameraComponent = (
    <AppCamera
      visible={isCameraVisible}
      onClose={closeAppCamera}
      onCapture={handleCapture}
    />
  );

  return {
    openAppCamera,
    CameraComponent,
  };
};

export default AppCamera;
