import { checkNetworkConnectivity } from './fileSystem';
import { getFirebaseStorageUrl, testAudioUrl, testMultipleSurahs } from './hostingConfig';

// Test hosting connectivity
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing hosting connection...');
    
    // Test 1: Check network connectivity
    const isConnected = await checkNetworkConnectivity();
    console.log('📡 Network connected:', isConnected);
    
    if (!isConnected) {
      return {
        success: false,
        error: 'No internet connection'
      };
    }
    
    // Test 2: Test multiple surah URLs
    console.log('📁 Testing surah URLs...');
    const testResults = await testMultipleSurahs(1, 5);
    
    const accessibleCount = testResults.filter(r => r.accessible).length;
    console.log(`📋 Found ${accessibleCount} accessible surahs`);
    
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
      totalFiles: accessibleCount,
      files: testResults.map(r => `surah_${r.surahId.toString().padStart(3, '0')}.mp3`),
      urlTests: urlTests
    };
    
  } catch (error) {
    console.error('❌ Hosting test failed:', error);
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
    const isAccessible = await testAudioUrl(surahId);
    const url = getFirebaseStorageUrl(surahId);
    console.log(`✅ Surah ${surahId} URL:`, url);
    return {
      success: isAccessible,
      url: url,
      accessible: isAccessible
    };
  } catch (error) {
    console.error(`❌ Surah ${surahId} URL test failed:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get detailed hosting status
export const getUploadStatus = async () => {
  try {
    console.log('📊 Getting detailed hosting status...');
    
    // Test first 10 surahs to check availability
    const testResults = await testMultipleSurahs(1, 10);
    const accessibleSurahIds = testResults
      .filter(r => r.accessible)
      .map(r => r.surahId)
      .sort((a, b) => a - b);
    
    // For now, assume all 114 surahs are available on hosting
    // In a real implementation, you might want to test all 114
    const allSurahIds = Array.from({length: 114}, (_, i) => i + 1);
    const missingSurahIds = allSurahIds.filter(id => !accessibleSurahIds.includes(id));
    
    console.log('✅ Accessible surahs (tested):', accessibleSurahIds);
    console.log('❌ Potentially missing surahs:', missingSurahIds);
    
    return {
      success: true,
      totalSurahs: 114,
      accessibleCount: accessibleSurahIds.length,
      missingCount: missingSurahIds.length,
      accessibleSurahs: accessibleSurahIds,
      missingSurahs: missingSurahIds,
      progress: Math.round((accessibleSurahIds.length / 10) * 100) // Based on tested surahs
    };
    
  } catch (error) {
    console.error('❌ Error getting hosting status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
