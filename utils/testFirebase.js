import { getFirebaseStorageUrl, checkNetworkConnectivity } from './fileSystem';
import { storage } from './firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

// Test Firebase storage connectivity
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test 1: Check network connectivity
    const isConnected = await checkNetworkConnectivity();
    console.log('📡 Network connected:', isConnected);
    
    if (!isConnected) {
      return {
        success: false,
        error: 'No internet connection'
      };
    }
    
    // Test 2: List all files in the quran_audio folder
    console.log('📁 Listing files in quran_audio folder...');
    const quranAudioRef = ref(storage, 'quran_audio');
    const result = await listAll(quranAudioRef);
    
    console.log('📋 Found files:', result.items.length);
    const files = result.items.map(item => item.name);
    console.log('📄 File names:', files);
    
    // Test 3: Try to get download URL for a few surahs
    const testSurahs = [1, 2, 3, 114]; // Test first 3 and last surah
    const urlTests = [];
    
    for (const surahId of testSurahs) {
      try {
        const url = await getFirebaseStorageUrl(surahId);
        urlTests.push({
          surahId,
          success: true,
          url: url
        });
        console.log(`✅ Surah ${surahId}: URL accessible`);
      } catch (error) {
        urlTests.push({
          surahId,
          success: false,
          error: error.message
        });
        console.log(`❌ Surah ${surahId}: ${error.message}`);
      }
    }
    
    return {
      success: true,
      networkConnected: isConnected,
      totalFiles: result.items.length,
      files: files,
      urlTests: urlTests
    };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test specific surah download URL
export const testSurahUrl = async (surahId) => {
  try {
    console.log(`🔍 Testing URL for Surah ${surahId}...`);
    const url = await getFirebaseStorageUrl(surahId);
    console.log(`✅ Surah ${surahId} URL:`, url);
    return {
      success: true,
      url: url
    };
  } catch (error) {
    console.error(`❌ Surah ${surahId} URL test failed:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get detailed upload status
export const getUploadStatus = async () => {
  try {
    console.log('📊 Getting detailed upload status...');
    
    const quranAudioRef = ref(storage, 'quran_audio');
    const result = await listAll(quranAudioRef);
    const uploadedFiles = result.items.map(item => item.name);
    
    // Extract surah IDs from filenames
    const uploadedSurahIds = uploadedFiles
      .filter(file => file.startsWith('surah_') && file.endsWith('.mp3'))
      .map(file => {
        const match = file.match(/surah_(\d+)\.mp3/);
        return match ? parseInt(match[1]) : null;
      })
      .filter(id => id !== null)
      .sort((a, b) => a - b);
    
    // Find missing surahs
    const allSurahIds = Array.from({length: 114}, (_, i) => i + 1);
    const missingSurahIds = allSurahIds.filter(id => !uploadedSurahIds.includes(id));
    
    console.log('✅ Uploaded surahs:', uploadedSurahIds);
    console.log('❌ Missing surahs:', missingSurahIds);
    
    return {
      success: true,
      totalSurahs: 114,
      uploadedCount: uploadedSurahIds.length,
      missingCount: missingSurahIds.length,
      uploadedSurahs: uploadedSurahIds,
      missingSurahs: missingSurahIds,
      progress: Math.round((uploadedSurahIds.length / 114) * 100)
    };
    
  } catch (error) {
    console.error('❌ Error getting upload status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
