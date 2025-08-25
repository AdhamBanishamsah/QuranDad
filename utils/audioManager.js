import { Audio } from 'expo-av';
import mediaSessionManager from './mediaSessionManager';

class AudioManager {
  constructor() {
    this.currentSound = null;
    this.currentSurahId = null;
    this.isPlaying = false;
    this.readingMode = 'once'; // 'once', 'repeat', 'continue'
    this.onPlaybackStatusUpdate = null;
    this.onSurahFinished = null; // Callback for when surah finishes
    
    // Initialize media session manager
    mediaSessionManager.initialize();
  }

  // Stop current audio and start new surah
  async playSurah(surahId, audioSource, onPlaybackStatusUpdate = null, onSurahFinished = null) {
    try {
      // Stop current audio if playing a different surah
      if (this.currentSound && this.currentSurahId !== surahId) {
        console.log(`🛑 Stopping previous surah ${this.currentSurahId} to play surah ${surahId}`);
        await this.stopCurrentAudio();
      }

      // If same surah, just return current sound
      if (this.currentSurahId === surahId && this.currentSound) {
        console.log(`🎵 Continuing with same surah ${surahId}`);
        return this.currentSound;
      }

      // Load new audio
      console.log(`🎵 Loading new surah ${surahId}`);
      console.log(`🔗 Audio source: ${audioSource}`);
      
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: true,
          staysActiveInBackground: true,
          progressUpdateIntervalMillis: 1000,
          androidImplementation: 'MediaPlayer',
          iosImplementation: 'AVPlayer',
        }
      );

      this.currentSound = sound;
      this.currentSurahId = surahId;
      this.isPlaying = true;
      this.onPlaybackStatusUpdate = onPlaybackStatusUpdate;
      this.onSurahFinished = onSurahFinished;

      // Set up playback status update with reading mode handling
      if (onPlaybackStatusUpdate) {
        sound.setOnPlaybackStatusUpdate((status) => {
          onPlaybackStatusUpdate(status);
          this.handlePlaybackStatus(status);
        });
      }

      // Update media session for lock screen controls
      const currentSurah = this.getCurrentSurah();
      if (currentSurah) {
        mediaSessionManager.updateMediaSession(
          currentSurah,
          true,
          0,
          0 // Duration will be updated when playback status is received
        );
      }

      console.log(`✅ Started playing surah ${surahId}`);
      return sound;

    } catch (error) {
      console.log('❌ Error in playSurah:', error);
      
      // iOS-specific error handling
      if (error.message && error.message.includes('Network')) {
        throw new Error('Network error: Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('404')) {
        throw new Error('Audio file not found. Please try again later.');
      } else if (error.message && error.message.includes('403')) {
        throw new Error('Access denied. Please check your network settings.');
      }
      
      throw new Error('Failed to load audio. Please try again.');
    }
  }

  // Stop current audio
  async stopCurrentAudio() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.isPlaying = false;
        console.log(`🛑 Stopped surah ${this.currentSurahId}`);
      } catch (error) {
        console.log('Error stopping current audio:', error);
      }
    }
  }

  // Get current surah ID
  getCurrentSurahId() {
    return this.currentSurahId;
  }

  // Check if currently playing
  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  // Get current sound object
  getCurrentSound() {
    return this.currentSound;
  }

  // Get current surah object (placeholder - you'll need to pass surah data)
  getCurrentSurah() {
    // This is a placeholder - in a real implementation, you'd store the surah object
    // For now, return a basic object with the ID
    return this.currentSurahId ? {
      id: this.currentSurahId,
      arabicNameSimple: `سورة ${this.currentSurahId}`,
      arabicName: `سورة ${this.currentSurahId}`
    } : null;
  }

  // Get current state for floating player
  getCurrentState() {
    return {
      currentSurahId: this.currentSurahId,
      isPlaying: this.isPlaying,
      currentTime: this.currentSound ? this.currentSound._lastStatusUpdateEvent?.positionMillis / 1000 : 0,
      duration: this.currentSound ? this.currentSound._lastStatusUpdateEvent?.durationMillis / 1000 : 0,
    };
  }

  // Pause current audio
  async pauseAudio() {
    if (this.currentSound && this.isPlaying) {
      try {
        await this.currentSound.pauseAsync();
        this.isPlaying = false;
        console.log(`⏸️ Paused surah ${this.currentSurahId}`);
      } catch (error) {
        console.log('Error pausing audio:', error);
      }
    }
  }

  // Resume current audio
  async resumeAudio() {
    if (this.currentSound && !this.isPlaying) {
      try {
        await this.currentSound.playAsync();
        this.isPlaying = true;
        console.log(`▶️ Resumed surah ${this.currentSurahId}`);
      } catch (error) {
        console.log('Error resuming audio:', error);
      }
    }
  }

  // Set reading mode
  setReadingMode(mode) {
    this.readingMode = mode;
    console.log(`📖 Reading mode set to: ${mode}`);
  }

  // Get reading mode
  getReadingMode() {
    return this.readingMode;
  }

  // Handle playback status and reading mode logic
  async handlePlaybackStatus(status) {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying;

      // Update media session for lock screen controls
      const currentSurah = this.getCurrentSurah();
      if (currentSurah) {
        mediaSessionManager.updateMediaSession(
          currentSurah,
          status.isPlaying,
          status.positionMillis / 1000,
          status.durationMillis / 1000
        );
      }

      // Handle reading modes when audio finishes
      if (status.didJustFinish || (status.positionMillis >= status.durationMillis && status.isPlaying)) {
        console.log(`🎵 Audio finished, current reading mode: ${this.readingMode}`);
        
        if (this.readingMode === 'once') {
          // Stop playing and reset
          console.log('⏹️ Stopping audio (once mode)');
          this.isPlaying = false;
        } else if (this.readingMode === 'repeat') {
          // Restart the same surah
          console.log('🔄 Auto-restarting surah (repeat mode)');
          if (this.currentSound) {
            try {
              // Reset position to beginning and start playing
              await this.currentSound.setPositionAsync(0);
              await this.currentSound.playAsync();
              this.isPlaying = true;
              console.log('✅ Surah auto-restarted successfully');
            } catch (error) {
              console.log('❌ Error auto-restarting surah:', error);
            }
          }
        } else if (this.readingMode === 'continue') {
          // Continue to next surah
          console.log('⏭️ Continuing to next surah (continue mode)');
          if (this.onSurahFinished) {
            this.onSurahFinished(this.currentSurahId);
          }
        }
      }
    }
  }

  // Cleanup all audio
  async cleanup() {
    await this.stopCurrentAudio();
    this.currentSound = null;
    this.currentSurahId = null;
    this.isPlaying = false;
    this.readingMode = 'once';
    this.onPlaybackStatusUpdate = null;
    this.onSurahFinished = null;
    console.log('🧹 Audio manager cleaned up');
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
