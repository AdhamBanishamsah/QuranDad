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

// Check if Firebase environment variables are available
const hasFirebaseConfig = EXPO_PUBLIC_FIREBASE_API_KEY && 
                         EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN && 
                         EXPO_PUBLIC_FIREBASE_PROJECT_ID;

// Firebase configuration - Use environment variables for security
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
} : null;

// Initialize Firebase only if config is available
let app = null;
let storage = null;

if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.log('⚠️ Firebase environment variables not found, using direct URLs');
}

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
    // If Firebase is not available, use direct URL
    if (!storage) {
      console.log(`📡 Using direct URL for surah ${surahId}`);
      return getRemoteAudioUrl(surahId);
    }

    const formattedId = surahId.toString().padStart(3, '0');
    const fileName = `surah_${formattedId}.mp3`;
    const fileRef = ref(storage, `quran_audio/${fileName}`);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error(`Error getting Firebase URL for surah ${surahId}:`, error);
    console.log(`📡 Falling back to direct URL for surah ${surahId}`);
    // Fallback to direct URL if Firebase fails
    return getRemoteAudioUrl(surahId);
  }
};

export { storage, app };
