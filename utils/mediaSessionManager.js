import { Audio } from 'expo-av';

class MediaSessionManager {
  constructor() {
    this.currentSurah = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.onPlayPause = null;
    this.onSkipForward = null;
    this.onSkipBackward = null;
  }

  // Initialize media session
  async initialize() {
    try {
      // Set up audio mode for background playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('✅ Media session manager initialized');
    } catch (error) {
      console.error('Error initializing media session:', error);
    }
  }

  // Update media session with current track info
  updateMediaSession(surah, isPlaying, currentTime, duration) {
    this.currentSurah = surah;
    this.isPlaying = isPlaying;
    this.currentTime = currentTime;
    this.duration = duration;

    // For iOS, this will update the lock screen controls
    if (surah) {
      this.setNowPlayingInfo({
        title: surah.arabicNameSimple,
        artist: 'نظام بني شمسة',
        album: 'القرآن الكريم',
        duration: duration,
        currentTime: currentTime,
        isPlaying: isPlaying,
      });
    }
  }

  // Set now playing info for iOS lock screen
  setNowPlayingInfo(info) {
    // This would typically use a native module for iOS
    // For now, we'll log the info that would be sent to iOS
    console.log('🎵 Now Playing Info:', {
      title: info.title,
      artist: info.artist,
      album: info.album,
      duration: info.duration,
      currentTime: info.currentTime,
      isPlaying: info.isPlaying,
    });
  }

  // Handle media control events
  handleMediaControl(event) {
    switch (event) {
      case 'play':
        if (this.onPlayPause) this.onPlayPause();
        break;
      case 'pause':
        if (this.onPlayPause) this.onPlayPause();
        break;
      case 'next':
        if (this.onSkipForward) this.onSkipForward();
        break;
      case 'previous':
        if (this.onSkipBackward) this.onSkipBackward();
        break;
      default:
        console.log('Unknown media control event:', event);
    }
  }

  // Set control callbacks
  setControlCallbacks(callbacks) {
    this.onPlayPause = callbacks.onPlayPause;
    this.onSkipForward = callbacks.onSkipForward;
    this.onSkipBackward = callbacks.onSkipBackward;
  }

  // Cleanup
  cleanup() {
    this.currentSurah = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.onPlayPause = null;
    this.onSkipForward = null;
    this.onSkipBackward = null;
    console.log('🧹 Media session manager cleaned up');
  }
}

// Create singleton instance
const mediaSessionManager = new MediaSessionManager();

export default mediaSessionManager;
