// Simple hosting configuration for Quran audio files
// No Firebase dependency - uses direct hosting URLs

// Base URL for remote audio files
const remoteAudioBaseUrl = 'https://quran.adham-tech.com/mp3_files/surahs/';

// Get the remote URL for a surah
export const getRemoteAudioUrl = (surahId) => {
  const formattedId = surahId.toString().padStart(3, '0');
  const url = `${remoteAudioBaseUrl}surah_${formattedId}.mp3`;
  console.log(`🔗 Generated URL for surah ${surahId}: ${url}`);
  return url;
};

// Direct function to get hosting URL (no Firebase fallback)
export const getHostingUrl = (surahId) => {
  const formattedId = surahId.toString().padStart(3, '0');
  const url = `${remoteAudioBaseUrl}surah_${formattedId}.mp3`;
  console.log(`🌐 Direct hosting URL for surah ${surahId}: ${url}`);
  return url;
};

// Alias for backward compatibility
export const getFirebaseStorageUrl = async (surahId) => {
  console.log(`📡 Using hosting URL for surah ${surahId} (hosting: quran.adham-tech.com)`);
  return getHostingUrl(surahId);
};

// Test URL accessibility
export const testAudioUrl = async (surahId) => {
  try {
    const url = getHostingUrl(surahId);
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
