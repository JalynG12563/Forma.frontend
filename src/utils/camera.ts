import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

export const useCameraPermission = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const hasPermission = permission?.granted;

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    return result?.granted || false;
  };

  return {
    hasPermission,
    requestCameraPermission,
    permission,
  };
};

export { CameraView, CameraType };
