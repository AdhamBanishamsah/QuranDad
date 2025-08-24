import * as FileSystem from 'expo-file-system';
import { Alert, Platform, NetInfo } from 'react-native';
import { getRemoteAudioUrl } from './firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

// Base directory for storing downloaded audio files
const audioDirectory = FileSystem.documentDirectory + 'quran_audio/';

// Ensure the audio directory exists
const ensureDirectoryExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
  }
};

// Get the local file path for a surah
export const getLocalAudioPath = (surahId) => {
  return `${audioDirectory}surah_${surahId.toString().padStart(3, '0')}.mp3`;
};

// Check if a surah is downloaded
export const isSurahDownloaded = async (surahId) => {
  await ensureDirectoryExists();
  const filePath = getLocalAudioPath(surahId);
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  return fileInfo.exists;
};

// Alias for isSurahDownloaded for backward compatibility
export const checkIfSurahDownloaded = isSurahDownloaded;

// Check network connectivity
export const checkNetworkConnectivity = async () => {
  try {
    // This is a simple check that attempts to fetch a small file from Google
    const response = await fetch('https://www.google.com/favicon.ico');
    return response.status === 200;
  } catch (error) {
    console.log('Network connectivity error:', error);
    return false;
  }
};

// Get remote URL from Firebase Storage
export const getFirebaseStorageUrl = async (surahId) => {
  try {
    const formattedId = surahId.toString().padStart(3, '0');
    const storageRef = ref(storage, `quran_audio/surah_${formattedId}.mp3`);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting Firebase storage URL:', error);
    // Fallback to the predefined URL pattern if Firebase fails
    return getRemoteAudioUrl(surahId);
  }
};

// Global variable to store current download resumable
let currentDownloadResumable = null;

// Download a surah with progress tracking and cancellation support
export const downloadSurah = async (surahId, url, onProgress, onComplete, onError) => {
  try {
    // Check network connectivity first
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      throw new Error('No internet connection. Please check your network settings and try again.');
    }
    
    await ensureDirectoryExists();
    const filePath = getLocalAudioPath(surahId);
    
    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      onComplete && onComplete(filePath);
      return filePath;
    }
    
    // If no URL is provided, try to get it from Firebase
    if (!url) {
      try {
        url = await getFirebaseStorageUrl(surahId);
      } catch (error) {
        console.error('Failed to get Firebase URL:', error);
        throw new Error('Could not retrieve audio file URL. Please try again later.');
      }
    }
    
    // Download the file with progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        onProgress && onProgress(progress);
      }
    );
    
    // Store the current download resumable for cancellation
    currentDownloadResumable = downloadResumable;
    
    const result = await downloadResumable.downloadAsync();
    
    // Clear the current download resumable
    currentDownloadResumable = null;
    
    if (result && result.uri) {
      onComplete && onComplete(result.uri);
      return result.uri;
    }
    
    return null;
  } catch (error) {
    // Clear the current download resumable on error
    currentDownloadResumable = null;
    console.error('Error downloading surah:', error);
    onError && onError(error);
    return null;
  }
};

// Cancel current download
export const cancelCurrentDownload = async () => {
  if (currentDownloadResumable) {
    try {
      await currentDownloadResumable.cancelAsync();
      currentDownloadResumable = null;
      return true;
    } catch (error) {
      console.error('Error cancelling download:', error);
      currentDownloadResumable = null;
      return false;
    }
  }
  return false;
};

// Delete a downloaded surah
export const deleteSurah = async (surahId) => {
  try {
    const filePath = getLocalAudioPath(surahId);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting surah:', error);
    return false;
  }
};

// Get all downloaded surahs
export const getDownloadedSurahs = async () => {
  try {
    await ensureDirectoryExists();
    const files = await FileSystem.readDirectoryAsync(audioDirectory);
    
    // Extract surah IDs from filenames (surah_001.mp3 -> 1)
    return files
      .filter(file => file.startsWith('surah_') && file.endsWith('.mp3'))
      .map(file => {
        const surahId = parseInt(file.replace('surah_', '').replace('.mp3', ''));
        return {
          id: surahId,
          filePath: getLocalAudioPath(surahId),
          fileName: file
        };
      });
  } catch (error) {
    console.error('Error getting downloaded surahs:', error);
    return [];
  }
};

// Delete all downloaded surahs
export const deleteAllSurahs = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(audioDirectory, { idempotent: true });
      await ensureDirectoryExists();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting all surahs:', error);
    return false;
  }
};

// Get the total size of downloaded files
export const getDownloadedSize = async () => {
  try {
    const downloadedSurahs = await getDownloadedSurahs();
    let totalSize = 0;
    
    for (const surah of downloadedSurahs) {
      const fileInfo = await FileSystem.getInfoAsync(surah.filePath);
      if (fileInfo.exists && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }
    
    // Convert to MB with 2 decimal places
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log('📊 Total downloaded size:', sizeInMB, 'MB');
    return sizeInMB + ' MB';
  } catch (error) {
    console.error('Error calculating downloaded size:', error);
    return '0 MB';
  }
};