import { getRemoteAudioUrl } from './firebaseConfig';

// Test audio URL accessibility
export const testAudioUrl = async (surahId) => {
  try {
    const url = getRemoteAudioUrl(surahId);
    console.log(`🔍 Testing audio URL for surah ${surahId}: ${url}`);
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        'User-Agent': 'QuranApp/1.0'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Audio URL accessible for surah ${surahId}`);
      console.log(`📊 Content-Length: ${response.headers.get('content-length')} bytes`);
      console.log(`🎵 Content-Type: ${response.headers.get('content-type')}`);
      return true;
    } else {
      console.log(`❌ Audio URL failed for surah ${surahId}: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error testing audio URL for surah ${surahId}:`, error);
    return false;
  }
};

// Test multiple surahs
export const testMultipleSurahs = async (startId = 1, endId = 5) => {
  console.log(`🧪 Testing audio URLs for surahs ${startId} to ${endId}`);
  
  const results = [];
  for (let i = startId; i <= endId; i++) {
    const isAccessible = await testAudioUrl(i);
    results.push({ surahId: i, accessible: isAccessible });
  }
  
  const accessibleCount = results.filter(r => r.accessible).length;
  console.log(`📊 Test Results: ${accessibleCount}/${results.length} surahs accessible`);
  
  return results;
};

// Get audio URL for testing
export const getAudioUrlForTesting = (surahId) => {
  return getRemoteAudioUrl(surahId);
};
