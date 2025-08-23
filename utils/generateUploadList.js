// Generate list of missing surah files for upload
export const generateMissingFilesList = () => {
  // Based on your logs, these are the uploaded files
  const uploadedFiles = [
    'surah_002.mp3', 'surah_003.mp3', 'surah_004.mp3', 'surah_005.mp3', 'surah_006.mp3',
    'surah_028.mp3', 'surah_029.mp3', 'surah_030.mp3', 'surah_031.mp3', 'surah_032.mp3'
  ];
  
  // Extract uploaded surah IDs
  const uploadedSurahIds = uploadedFiles
    .map(file => {
      const match = file.match(/surah_(\d+)\.mp3/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(id => id !== null);
  
  // Generate all required files (1-114)
  const allRequiredFiles = [];
  for (let i = 1; i <= 114; i++) {
    const fileName = `surah_${i.toString().padStart(3, '0')}.mp3`;
    if (!uploadedSurahIds.includes(i)) {
      allRequiredFiles.push(fileName);
    }
  }
  
  console.log('📋 Files to upload to Firebase Storage:');
  console.log('📁 Folder: quran_audio/');
  console.log('📊 Total missing files:', allRequiredFiles.length);
  console.log('📄 Missing files:');
  allRequiredFiles.forEach(file => console.log(`   ${file}`));
  
  return {
    totalMissing: allRequiredFiles.length,
    files: allRequiredFiles,
    uploadedCount: uploadedSurahIds.length,
    progress: Math.round((uploadedSurahIds.length / 114) * 100)
  };
};

// Generate upload checklist
export const generateUploadChecklist = () => {
  const result = generateMissingFilesList();
  
  console.log('\n📋 UPLOAD CHECKLIST:');
  console.log('==================');
  console.log(`✅ Progress: ${result.progress}% (${result.uploadedCount}/114)`);
  console.log(`📁 Upload to: Firebase Storage > quran_audio/`);
  console.log(`📄 Files needed: ${result.totalMissing}`);
  console.log('\n📋 MISSING FILES:');
  console.log('================');
  
  // Group by ranges for easier upload
  const ranges = [];
  let currentRange = [];
  
  result.files.forEach(file => {
    const surahId = parseInt(file.match(/surah_(\d+)\.mp3/)[1]);
    if (currentRange.length === 0 || surahId === currentRange[currentRange.length - 1] + 1) {
      currentRange.push(surahId);
    } else {
      if (currentRange.length > 0) {
        ranges.push([...currentRange]);
      }
      currentRange = [surahId];
    }
  });
  
  if (currentRange.length > 0) {
    ranges.push(currentRange);
  }
  
  ranges.forEach((range, index) => {
    if (range.length === 1) {
      console.log(`${index + 1}. surah_${range[0].toString().padStart(3, '0')}.mp3`);
    } else {
      console.log(`${index + 1}. surah_${range[0].toString().padStart(3, '0')}.mp3 - surah_${range[range.length - 1].toString().padStart(3, '0')}.mp3 (${range.length} files)`);
    }
  });
  
  return {
    ranges,
    totalMissing: result.totalMissing,
    progress: result.progress
  };
};

// Run the checklist
if (typeof window === 'undefined') {
  console.log('🔍 Firebase Upload Analysis');
  console.log('==========================');
  generateUploadChecklist();
}
