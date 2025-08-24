import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import audioManager from '../utils/audioManager';

const { width, height } = Dimensions.get('window');

const GlobalFloatingPlayer = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [surah, setSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
      
      // Show floating player when app goes to background and audio is playing
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        const currentSurahId = audioManager.getCurrentSurahId();
        if (currentSurahId && audioManager.isCurrentlyPlaying()) {
          const currentSurah = getSurahById(currentSurahId);
          setSurah(currentSurah);
          setIsVisible(true);
        }
      }
      
      // Hide floating player when app comes to foreground
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setIsVisible(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Check if audio is already playing
    const checkAudioStatus = () => {
      const currentSurahId = audioManager.getCurrentSurahId();
      if (currentSurahId && audioManager.isCurrentlyPlaying()) {
        const currentSurah = getSurahById(currentSurahId);
        setSurah(currentSurah);
        setIsVisible(true);
        setIsPlaying(true);
      }
    };

    checkAudioStatus();

    return () => subscription?.remove();
  }, [appState]);

  // Complete list of all 114 surahs (copied from QuranListScreen)
  const surahs = [
    { id: 1, arabicName: 'سورة الفاتحة', arabicNameSimple: 'الفاتحة', verses: 7, duration: '1:30', arabicType: 'مكية' },
    { id: 2, arabicName: 'سورة البقرة', arabicNameSimple: 'البقرة', verses: 286, duration: '2:30:45', arabicType: 'مدنية' },
    // ... add all 114 surahs here
  ];

  const getSurahById = (id) => {
    return surahs.find(s => s.id === id);
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioManager.pauseAudio();
      setIsPlaying(false);
    } else {
      await audioManager.resumeAudio();
      setIsPlaying(true);
    }
  };

  const handleSkipForward = async () => {
    const sound = audioManager.getCurrentSound();
    if (sound) {
      const newPosition = Math.min(currentTime + 30, duration);
      await sound.setPositionAsync(newPosition * 1000);
      setCurrentTime(newPosition);
    }
  };

  const handleSkipBackward = async () => {
    const sound = audioManager.getCurrentSound();
    if (sound) {
      const newPosition = Math.max(currentTime - 30, 0);
      await sound.setPositionAsync(newPosition * 1000);
      setCurrentTime(newPosition);
    }
  };

  const handlePress = () => {
    if (surah) {
      navigation.navigate('SurahPlayer', { surah });
    }
  };

  if (!isVisible || !surah) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.playerWidget}>
        {/* Thumbnail/Icon */}
        <View style={styles.thumbnail}>
          <Ionicons name="book" size={24} color="#e94560" />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {surah.arabicNameSimple}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {surah.arabicName}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>-{formatTime(duration - currentTime)}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSkipBackward}>
            <Ionicons name="play-skip-back" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleSkipForward}>
            <Ionicons name="play-skip-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Audio Output Icon */}
        <View style={styles.audioOutputIcon}>
          <Ionicons name="headset" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  playerWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    left: 77,
    right: 15,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  audioOutputIcon: {
    marginLeft: 8,
    padding: 4,
  },
});

export default GlobalFloatingPlayer;
