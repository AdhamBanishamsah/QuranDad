import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
} from '@env';

// Firebase configuration - Use environment variables for security
const firebaseConfig = {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Base URL for remote audio files
const remoteAudioBaseUrl = 'https://qurannizam.firebasestorage.app/quran_audio/';

// Get the remote URL for a surah
export const getRemoteAudioUrl = (surahId) => {
  const formattedId = surahId.toString().padStart(3, '0');
  return `${remoteAudioBaseUrl}surah_${formattedId}.mp3`;
};

// Get Firebase Storage URL for a surah
export const getFirebaseStorageUrl = async (surahId) => {
  try {
    const formattedId = surahId.toString().padStart(3, '0');
    const fileName = `surah_${formattedId}.mp3`;
    const fileRef = ref(storage, `quran_audio/${fileName}`);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error(`Error getting Firebase URL for surah ${surahId}:`, error);
    throw error;
  }
};

export { storage, app };
