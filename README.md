# Quran App

A modern, beautiful Quran application built with React Native and Expo, featuring audio playback, download management, and a comprehensive surah library.

## Features

- ✨ Modern and elegant UI design with Arabic language support
- 🎵 Advanced audio player with background playback and lock screen controls
- 📖 Complete surah listing (114 surahs) with search functionality
- 🌙 Beautiful gradient backgrounds and dark theme
- 📱 Responsive design for all screen sizes
- 🔍 Search surahs by name in Arabic and English
- ⏯️ Advanced playback controls (play, pause, skip, seek)
- 📥 Download management for offline listening
- 🔄 Multiple reading modes (once, repeat, continue)
- 🎧 Global floating player for continuous playback
- 🔔 Media session integration for lock screen controls
- ☁️ Firebase integration for remote audio storage
- 💾 Local file system management for downloads
- ⚙️ Comprehensive settings and preferences
- 📱 Cross-platform support (iOS & Android)

## Project Structure

```
Quran/
├── assets/
│   ├── images/          # Image assets
│   ├── audio/           # Audio file documentation
│   └── icons/           # App icons for different platforms
├── components/          # Reusable components
│   ├── FloatingMediaPlayer.js
│   └── GlobalFloatingPlayer.js
├── screens/            # App screens
│   ├── WelcomeScreen.js
│   ├── MainScreen.js
│   ├── QuranListScreen.js
│   ├── SurahPlayerScreen.js
│   ├── DownloadsScreen.js
│   ├── SettingsScreen.js
│   ├── AboutDeveloperScreen.js
│   └── PrivacyPolicyScreen.js
├── utils/              # Utility functions
│   ├── audioManager.js
│   ├── fileSystem.js
│   ├── firebaseConfig.js
│   ├── mediaSessionManager.js
│   └── readingModeStorage.js
├── App.js              # Main app component
└── package.json
```

## Key Features Explained

### Audio Management
- **Background Playback**: Audio continues playing when app is in background
- **Lock Screen Controls**: Full media controls on device lock screen
- **Multiple Reading Modes**: 
  - Once: Play surah once and stop
  - Repeat: Loop current surah
  - Continue: Auto-play next surah
- **Progress Tracking**: Real-time playback progress with seek functionality
- **Audio Quality**: High-quality MP3 files with optimized streaming

### Download Management
- **Offline Listening**: Download surahs for offline playback
- **Storage Management**: Automatic file system organization
- **Download Progress**: Real-time download progress tracking
- **Storage Optimization**: Efficient local storage management

### Firebase Integration
- **Remote Storage**: Audio files stored in Firebase Cloud Storage
- **Secure Access**: Environment-based configuration
- **CDN Delivery**: Fast global content delivery
- **Automatic URL Generation**: Dynamic audio URL generation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or Android Emulator (Android Studio)

### Environment Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Firebase (optional for local development):**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

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

5. **Run on web (development):**
   ```bash
   npm run web
   ```

## Usage

### Main Navigation
- **السور (Surahs)**: Browse and search all 114 surahs
- **التحميلات (Downloads)**: Manage downloaded surahs for offline listening
- **الإعدادات (Settings)**: Configure app preferences and reading modes

### Audio Controls
- **Play/Pause**: Tap the play button to start/stop playback
- **Seek**: Drag the progress bar to jump to specific time
- **Skip**: Use forward/backward buttons for quick navigation
- **Reading Mode**: Choose between once, repeat, or continue modes

### Search Functionality
- Search surahs by Arabic name (e.g., "الفاتحة")
- Search by English name (e.g., "Fatiha")
- Real-time search results with highlighting

## Technical Implementation

### Audio Architecture
- **Expo AV**: Core audio playback functionality
- **Background Audio**: Configured for continuous playback
- **Media Session**: Lock screen and notification controls
- **State Management**: Centralized audio state management

### File System
- **Expo File System**: Local file management
- **Download Queue**: Efficient download management
- **Storage Optimization**: Automatic cleanup and organization

### Navigation
- **React Navigation**: Stack and tab navigation
- **Bottom Tabs**: Main app navigation
- **Stack Navigation**: Screen transitions

## Dependencies

### Core Dependencies
- `expo`: ^53.0.22 - Expo framework
- `react`: 19.0.0 - React library
- `react-native`: 0.79.5 - React Native framework

### Navigation
- `@react-navigation/native`: ^7.1.17 - Navigation core
- `@react-navigation/stack`: ^7.4.7 - Stack navigation
- `@react-navigation/bottom-tabs`: ^7.4.6 - Tab navigation

### Audio & Media
- `expo-av`: ^15.1.7 - Audio/video playback
- `expo-media-library`: ~17.1.7 - Media library access
- `expo-notifications`: ^0.31.4 - Push notifications

### UI & Styling
- `expo-linear-gradient`: ^14.1.5 - Gradient backgrounds
- `react-native-vector-icons`: ^10.3.0 - Icon library
- `react-native-gesture-handler`: ~2.24.0 - Gesture handling

### Storage & Data
- `@react-native-async-storage/async-storage`: ^1.24.0 - Local storage
- `expo-file-system`: ~18.1.11 - File system operations
- `firebase`: ^12.1.0 - Firebase services
- `@react-native-firebase/app`: ^23.1.1 - Firebase app
- `@react-native-firebase/storage`: ^23.1.1 - Firebase storage

### Utilities
- `react-native-dotenv`: ^3.4.11 - Environment variables
- `react-native-safe-area-context`: ^5.6.1 - Safe area handling
- `react-native-screens`: ~4.11.1 - Native screens
- `expo-status-bar`: ~2.2.3 - Status bar management

## Customization

### Theme Colors
The app uses a modern dark theme:
- Primary: `#e94560` (Coral Red)
- Background: `#1a1a2e` (Dark Blue)
- Secondary: `#16213e` (Navy Blue)
- Accent: `#0f3460` (Deep Blue)
- Text: `#ffffff` (White)
- Muted: `rgba(255, 255, 255, 0.6)` (Semi-transparent white)

### Audio Configuration
Modify `utils/audioManager.js` for audio behavior:
- Reading modes
- Playback options
- Background audio settings

### Firebase Setup
Configure Firebase in `utils/firebaseConfig.js`:
- Storage bucket configuration
- Audio file organization
- URL generation patterns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive comments for complex logic
- Test on both iOS and Android platforms

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue in the repository
- Check the documentation in the code comments
- Review the Firebase configuration guide

## Acknowledgments

- Quran audio files sourced from reliable Islamic sources
- Icons provided by Expo Vector Icons
- Firebase for reliable cloud storage
- React Native community for excellent documentation

---

**Note**: This app is designed for educational and religious purposes. Please ensure compliance with local laws and regulations regarding religious content distribution.
