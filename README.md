# Quran App

A modern, beautiful Quran application built with React Native and Expo.

## Features

- ✨ Modern and elegant UI design
- 🎵 Audio player with progress tracking
- 📖 Complete surah listing with search functionality
- 🌙 Beautiful gradient backgrounds
- 📱 Responsive design for all screen sizes
- 🔍 Search surahs by name
- ⏯️ Playback controls (play, pause, skip)

## Project Structure

```
Quran/
├── assets/
│   ├── images/          # Image assets
│   └── audio/           # MP3 files for surahs
├── components/          # Reusable components
├── screens/            # App screens
│   ├── WelcomeScreen.js
│   └── QuranListScreen.js
├── App.js              # Main app component
└── package.json
```

## Audio Files Setup

### Uploading MP3 Files

1. **Navigate to the audio folder:**
   ```bash
   cd assets/audio
   ```

2. **Upload your MP3 files:**
   - Name your files following this pattern: `surah_001.mp3`, `surah_002.mp3`, etc.
   - Example: `surah_001.mp3` for Al-Fatiha, `surah_002.mp3` for Al-Baqarah

3. **Supported file formats:**
   - MP3 (recommended)
   - WAV
   - M4A

### File Naming Convention

Use the following naming convention for your audio files:

- `surah_001.mp3` - Al-Fatiha
- `surah_002.mp3` - Al-Baqarah
- `surah_003.mp3` - Al Imran
- `surah_004.mp3` - An-Nisa
- `surah_005.mp3` - Al-Ma'idah
- ... and so on

### Audio Quality Recommendations

- **Bitrate:** 128-320 kbps
- **Sample Rate:** 44.1 kHz
- **Channels:** Stereo or Mono
- **File Size:** Keep files under 50MB for better performance

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on iOS Simulator:**
   ```bash
   npm run ios
   ```

4. **Run on Android Emulator:**
   ```bash
   npm run android
   ```

## Usage

1. **Welcome Screen:** Beautiful introduction with Quran reader placeholder
2. **Surah List:** Browse all surahs with search functionality
3. **Audio Player:** Currently playing surah with controls
4. **Search:** Find surahs by name in Arabic or English

## Customization

### Colors
The app uses a modern color scheme:
- Primary: `#e94560` (Coral Red)
- Background: `#1a1a2e` (Dark Blue)
- Secondary: `#16213e` (Navy Blue)
- Accent: `#0f3460` (Deep Blue)

### Adding More Surahs
To add more surahs, edit the `surahs` array in `screens/QuranListScreen.js`:

```javascript
const surahs = [
  // ... existing surahs
  {
    id: 6,
    name: 'Al-An\'am',
    arabicName: 'سورة الأنعام',
    arabicNameSimple: 'الأنعام',
    verses: 165,
    duration: '1:45:30',
    type: 'Meccan',
    arabicType: 'مكية',
  },
  // Add more surahs here
];
```

## Dependencies

- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigation
- `expo-linear-gradient` - Gradient backgrounds
- `react-native-screens` - Native screens
- `react-native-safe-area-context` - Safe area handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
