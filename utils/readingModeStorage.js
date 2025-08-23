import AsyncStorage from '@react-native-async-storage/async-storage';

const READING_MODE_KEY = 'quran_reading_mode';

export const saveReadingMode = async (mode) => {
  try {
    await AsyncStorage.setItem(READING_MODE_KEY, mode);
    console.log('💾 Reading mode saved:', mode);
  } catch (error) {
    console.log('Error saving reading mode:', error);
  }
};

export const getReadingMode = async () => {
  try {
    const mode = await AsyncStorage.getItem(READING_MODE_KEY);
    const defaultMode = mode || 'once';
    console.log('📖 Reading mode loaded:', defaultMode);
    return defaultMode;
  } catch (error) {
    console.log('Error loading reading mode:', error);
    return 'once'; // Default fallback
  }
};
