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

  // Complete list of all 114 surahs
  const surahs = [
    { id: 1, arabicName: 'سورة الفاتحة', arabicNameSimple: 'الفاتحة', verses: 7, duration: '1:30', arabicType: 'مكية' },
    { id: 2, arabicName: 'سورة البقرة', arabicNameSimple: 'البقرة', verses: 286, duration: '2:30:45', arabicType: 'مدنية' },
    { id: 3, arabicName: 'سُورَةُ آل عمران', arabicNameSimple: 'آل عمران', verses: 200, duration: '1:45:20', arabicType: 'مدنية' },
    { id: 4, arabicName: 'سورة النساء', arabicNameSimple: 'النساء', verses: 176, duration: '1:55:10', arabicType: 'مدنية' },
    { id: 5, arabicName: 'سورة المائدة', arabicNameSimple: 'المائدة', verses: 120, duration: '1:30:15', arabicType: 'مدنية' },
    { id: 6, arabicName: 'سورة الأنعام', arabicNameSimple: 'الأنعام', verses: 165, duration: '1:45:30', arabicType: 'مكية' },
    { id: 7, arabicName: 'سورة الأعراف', arabicNameSimple: 'الأعراف', verses: 206, duration: '2:15:40', arabicType: 'مكية' },
    { id: 8, arabicName: 'سورة الأنفال', arabicNameSimple: 'الأنفال', verses: 75, duration: '1:20:30', arabicType: 'مدنية' },
    { id: 9, arabicName: 'سورة التوبة', arabicNameSimple: 'التوبة', verses: 129, duration: '1:50:25', arabicType: 'مدنية' },
    { id: 10, arabicName: 'سورة يونس', arabicNameSimple: 'يونس', verses: 109, duration: '1:35:15', arabicType: 'مكية' },
    { id: 11, arabicName: 'سورة هود', arabicNameSimple: 'هود', verses: 123, duration: '1:40:20', arabicType: 'مكية' },
    { id: 12, arabicName: 'سورة يوسف', arabicNameSimple: 'يوسف', verses: 111, duration: '1:45:30', arabicType: 'مكية' },
    { id: 13, arabicName: 'سورة الرعد', arabicNameSimple: 'الرعد', verses: 43, duration: '0:55:10', arabicType: 'مدنية' },
    { id: 14, arabicName: 'سورة إبراهيم', arabicNameSimple: 'إبراهيم', verses: 52, duration: '1:05:15', arabicType: 'مكية' },
    { id: 15, arabicName: 'سورة الحجر', arabicNameSimple: 'الحجر', verses: 99, duration: '1:25:20', arabicType: 'مكية' },
    { id: 16, arabicName: 'سورة النحل', arabicNameSimple: 'النحل', verses: 128, duration: '1:50:30', arabicType: 'مكية' },
    { id: 17, arabicName: 'سورة الإسراء', arabicNameSimple: 'الإسراء', verses: 111, duration: '1:45:25', arabicType: 'مكية' },
    { id: 18, arabicName: 'سورة الكهف', arabicNameSimple: 'الكهف', verses: 110, duration: '1:50:40', arabicType: 'مكية' },
    { id: 19, arabicName: 'سورة مريم', arabicNameSimple: 'مريم', verses: 98, duration: '1:30:15', arabicType: 'مكية' },
    { id: 20, arabicName: 'سورة طه', arabicNameSimple: 'طه', verses: 135, duration: '1:55:30', arabicType: 'مكية' },
    { id: 21, arabicName: 'سورة الأنبياء', arabicNameSimple: 'الأنبياء', verses: 112, duration: '1:45:20', arabicType: 'مكية' },
    { id: 22, arabicName: 'سورة الحج', arabicNameSimple: 'الحج', verses: 78, duration: '1:25:40', arabicType: 'مدنية' },
    { id: 23, arabicName: 'سورة المؤمنون', arabicNameSimple: 'المؤمنون', verses: 118, duration: '1:50:15', arabicType: 'مكية' },
    { id: 24, arabicName: 'سورة النور', arabicNameSimple: 'النور', verses: 64, duration: '1:15:30', arabicType: 'مدنية' },
    { id: 25, arabicName: 'سورة الفرقان', arabicNameSimple: 'الفرقان', verses: 77, duration: '1:20:45', arabicType: 'مكية' },
    { id: 26, arabicName: 'سورة الشعراء', arabicNameSimple: 'الشعراء', verses: 227, duration: '2:30:20', arabicType: 'مكية' },
    { id: 27, arabicName: 'سورة النمل', arabicNameSimple: 'النمل', verses: 93, duration: '1:35:15', arabicType: 'مكية' },
    { id: 28, arabicName: 'سورة القصص', arabicNameSimple: 'القصص', verses: 88, duration: '1:40:30', arabicType: 'مكية' },
    { id: 29, arabicName: 'سورة العنكبوت', arabicNameSimple: 'العنكبوت', verses: 69, duration: '1:15:20', arabicType: 'مكية' },
    { id: 30, arabicName: 'سورة الروم', arabicNameSimple: 'الروم', verses: 60, duration: '1:10:15', arabicType: 'مكية' },
    { id: 31, arabicName: 'سورة لقمان', arabicNameSimple: 'لقمان', verses: 34, duration: '0:45:10', arabicType: 'مكية' },
    { id: 32, arabicName: 'سورة السجدة', arabicNameSimple: 'السجدة', verses: 30, duration: '0:40:15', arabicType: 'مكية' },
    { id: 33, arabicName: 'سورة الأحزاب', arabicNameSimple: 'الأحزاب', verses: 73, duration: '1:20:30', arabicType: 'مدنية' },
    { id: 34, arabicName: 'سورة سبأ', arabicNameSimple: 'سبأ', verses: 54, duration: '1:05:20', arabicType: 'مكية' },
    { id: 35, arabicName: 'سورة فاطر', arabicNameSimple: 'فاطر', verses: 45, duration: '0:55:15', arabicType: 'مكية' },
    { id: 36, arabicName: 'سورة يس', arabicNameSimple: 'يس', verses: 83, duration: '1:25:40', arabicType: 'مكية' },
    { id: 37, arabicName: 'سورة الصافات', arabicNameSimple: 'الصافات', verses: 182, duration: '2:15:30', arabicType: 'مكية' },
    { id: 38, arabicName: 'سورة ص', arabicNameSimple: 'ص', verses: 88, duration: '1:30:25', arabicType: 'مكية' },
    { id: 39, arabicName: 'سورة الزمر', arabicNameSimple: 'الزمر', verses: 75, duration: '1:25:15', arabicType: 'مكية' },
    { id: 40, arabicName: 'سورة غافر', arabicNameSimple: 'غافر', verses: 85, duration: '1:35:20', arabicType: 'مكية' },
    { id: 41, arabicName: 'سورة فصلت', arabicNameSimple: 'فصلت', verses: 54, duration: '1:10:30', arabicType: 'مكية' },
    { id: 42, arabicName: 'سورة الشورى', arabicNameSimple: 'الشورى', verses: 53, duration: '1:05:25', arabicType: 'مكية' },
    { id: 43, arabicName: 'سورة الزخرف', arabicNameSimple: 'الزخرف', verses: 89, duration: '1:30:15', arabicType: 'مكية' },
    { id: 44, arabicName: 'سورة الدخان', arabicNameSimple: 'الدخان', verses: 59, duration: '1:00:20', arabicType: 'مكية' },
    { id: 45, arabicName: 'سورة الجاثية', arabicNameSimple: 'الجاثية', verses: 37, duration: '0:50:15', arabicType: 'مكية' },
    { id: 46, arabicName: 'سورة الأحقاف', arabicNameSimple: 'الأحقاف', verses: 35, duration: '0:45:30', arabicType: 'مكية' },
    { id: 47, arabicName: 'سورة محمد', arabicNameSimple: 'محمد', verses: 38, duration: '0:55:20', arabicType: 'مدنية' },
    { id: 48, arabicName: 'سورة الفتح', arabicNameSimple: 'الفتح', verses: 29, duration: '0:40:15', arabicType: 'مدنية' },
    { id: 49, arabicName: 'سورة الحجرات', arabicNameSimple: 'الحجرات', verses: 18, duration: '0:30:10', arabicType: 'مدنية' },
    { id: 50, arabicName: 'سورة ق', arabicNameSimple: 'ق', verses: 45, duration: '0:55:25', arabicType: 'مكية' },
    { id: 51, arabicName: 'سورة الذاريات', arabicNameSimple: 'الذاريات', verses: 60, duration: '1:10:30', arabicType: 'مكية' },
    { id: 52, arabicName: 'سورة الطور', arabicNameSimple: 'الطور', verses: 49, duration: '1:00:15', arabicType: 'مكية' },
    { id: 53, arabicName: 'سورة النجم', arabicNameSimple: 'النجم', verses: 62, duration: '1:05:20', arabicType: 'مكية' },
    { id: 54, arabicName: 'سورة القمر', arabicNameSimple: 'القمر', verses: 55, duration: '1:00:30', arabicType: 'مكية' },
    { id: 55, arabicName: 'سورة الرحمن', arabicNameSimple: 'الرحمن', verses: 78, duration: '1:15:45', arabicType: 'مدنية' },
    { id: 56, arabicName: 'سورة الواقعة', arabicNameSimple: 'الواقعة', verses: 96, duration: '1:25:15', arabicType: 'مكية' },
    { id: 57, arabicName: 'سورة الحديد', arabicNameSimple: 'الحديد', verses: 29, duration: '0:40:20', arabicType: 'مدنية' },
    { id: 58, arabicName: 'سورة المجادلة', arabicNameSimple: 'المجادلة', verses: 22, duration: '0:30:15', arabicType: 'مدنية' },
    { id: 59, arabicName: 'سورة الحشر', arabicNameSimple: 'الحشر', verses: 24, duration: '0:35:25', arabicType: 'مدنية' },
    { id: 60, arabicName: 'سورة الممتحنة', arabicNameSimple: 'الممتحنة', verses: 13, duration: '0:20:10', arabicType: 'مدنية' },
    { id: 61, arabicName: 'سورة الصف', arabicNameSimple: 'الصف', verses: 14, duration: '0:25:15', arabicType: 'مدنية' },
    { id: 62, arabicName: 'سورة الجمعة', arabicNameSimple: 'الجمعة', verses: 11, duration: '0:20:20', arabicType: 'مدنية' },
    { id: 63, arabicName: 'سورة المنافقون', arabicNameSimple: 'المنافقون', verses: 11, duration: '0:20:25', arabicType: 'مدنية' },
    { id: 64, arabicName: 'سورة التغابن', arabicNameSimple: 'التغابن', verses: 18, duration: '0:25:30', arabicType: 'مدنية' },
    { id: 65, arabicName: 'سورة الطلاق', arabicNameSimple: 'الطلاق', verses: 12, duration: '0:20:35', arabicType: 'مدنية' },
    { id: 66, arabicName: 'سورة التحريم', arabicNameSimple: 'التحريم', verses: 12, duration: '0:20:40', arabicType: 'مدنية' },
    { id: 67, arabicName: 'سورة الملك', arabicNameSimple: 'الملك', verses: 30, duration: '0:35:15', arabicType: 'مكية' },
    { id: 68, arabicName: 'سورة القلم', arabicNameSimple: 'القلم', verses: 52, duration: '0:45:20', arabicType: 'مكية' },
    { id: 69, arabicName: 'سورة الحاقة', arabicNameSimple: 'الحاقة', verses: 52, duration: '0:45:25', arabicType: 'مكية' },
    { id: 70, arabicName: 'سورة المعارج', arabicNameSimple: 'المعارج', verses: 44, duration: '0:40:30', arabicType: 'مكية' },
    { id: 71, arabicName: 'سورة نوح', arabicNameSimple: 'نوح', verses: 28, duration: '0:35:40', arabicType: 'مكية' },
    { id: 72, arabicName: 'سورة الجن', arabicNameSimple: 'الجن', verses: 28, duration: '0:35:45', arabicType: 'مكية' },
    { id: 73, arabicName: 'سورة المزمل', arabicNameSimple: 'المزمل', verses: 20, duration: '0:30:50', arabicType: 'مكية' },
    { id: 74, arabicName: 'سورة المدثر', arabicNameSimple: 'المدثر', verses: 56, duration: '0:45:35', arabicType: 'مكية' },
    { id: 75, arabicName: 'سورة القيامة', arabicNameSimple: 'القيامة', verses: 40, duration: '0:35:55', arabicType: 'مكية' },
    { id: 76, arabicName: 'سورة الإنسان', arabicNameSimple: 'الإنسان', verses: 31, duration: '0:30:60', arabicType: 'مدنية' },
    { id: 77, arabicName: 'سورة المرسلات', arabicNameSimple: 'المرسلات', verses: 50, duration: '0:40:45', arabicType: 'مكية' },
    { id: 78, arabicName: 'سورة النبأ', arabicNameSimple: 'النبأ', verses: 40, duration: '0:35:70', arabicType: 'مكية' },
    { id: 79, arabicName: 'سورة النازعات', arabicNameSimple: 'النازعات', verses: 46, duration: '0:40:80', arabicType: 'مكية' },
    { id: 80, arabicName: 'سورة عبس', arabicNameSimple: 'عبس', verses: 42, duration: '0:35:90', arabicType: 'مكية' },
    { id: 81, arabicName: 'سورة التكوير', arabicNameSimple: 'التكوير', verses: 29, duration: '0:30:100', arabicType: 'مكية' },
    { id: 82, arabicName: 'سورة الانفطار', arabicNameSimple: 'الانفطار', verses: 19, duration: '0:25:110', arabicType: 'مكية' },
    { id: 83, arabicName: 'سورة المطففين', arabicNameSimple: 'المطففين', verses: 36, duration: '0:35:120', arabicType: 'مكية' },
    { id: 84, arabicName: 'سورة الانشقاق', arabicNameSimple: 'الانشقاق', verses: 25, duration: '0:30:130', arabicType: 'مكية' },
    { id: 85, arabicName: 'سورة البروج', arabicNameSimple: 'البروج', verses: 22, duration: '0:25:140', arabicType: 'مكية' },
    { id: 86, arabicName: 'سورة الطارق', arabicNameSimple: 'الطارق', verses: 17, duration: '0:20:150', arabicType: 'مكية' },
    { id: 87, arabicName: 'سورة الأعلى', arabicNameSimple: 'الأعلى', verses: 19, duration: '0:25:160', arabicType: 'مكية' },
    { id: 88, arabicName: 'سورة الغاشية', arabicNameSimple: 'الغاشية', verses: 26, duration: '0:30:170', arabicType: 'مكية' },
    { id: 89, arabicName: 'سورة الفجر', arabicNameSimple: 'الفجر', verses: 30, duration: '0:35:180', arabicType: 'مكية' },
    { id: 90, arabicName: 'سورة البلد', arabicNameSimple: 'البلد', verses: 20, duration: '0:25:190', arabicType: 'مكية' },
    { id: 91, arabicName: 'سورة الشمس', arabicNameSimple: 'الشمس', verses: 15, duration: '0:20:200', arabicType: 'مكية' },
    { id: 92, arabicName: 'سورة الليل', arabicNameSimple: 'الليل', verses: 21, duration: '0:25:210', arabicType: 'مكية' },
    { id: 93, arabicName: 'سورة الضحى', arabicNameSimple: 'الضحى', verses: 11, duration: '0:15:220', arabicType: 'مكية' },
    { id: 94, arabicName: 'سورة الشرح', arabicNameSimple: 'الشرح', verses: 8, duration: '0:10:230', arabicType: 'مكية' },
    { id: 95, arabicName: 'سورة التين', arabicNameSimple: 'التين', verses: 8, duration: '0:10:240', arabicType: 'مكية' },
    { id: 96, arabicName: 'سورة العلق', arabicNameSimple: 'العلق', verses: 19, duration: '0:20:250', arabicType: 'مكية' },
    { id: 97, arabicName: 'سورة القدر', arabicNameSimple: 'القدر', verses: 5, duration: '0:05:260', arabicType: 'مكية' },
    { id: 98, arabicName: 'سورة البينة', arabicNameSimple: 'البينة', verses: 8, duration: '0:10:270', arabicType: 'مدنية' },
    { id: 99, arabicName: 'سورة الزلزلة', arabicNameSimple: 'الزلزلة', verses: 8, duration: '0:10:280', arabicType: 'مدنية' },
    { id: 100, arabicName: 'سورة العاديات', arabicNameSimple: 'العاديات', verses: 11, duration: '0:15:290', arabicType: 'مكية' },
    { id: 101, arabicName: 'سورة القارعة', arabicNameSimple: 'القارعة', verses: 11, duration: '0:15:300', arabicType: 'مكية' },
    { id: 102, arabicName: 'سورة التكاثر', arabicNameSimple: 'التكاثر', verses: 8, duration: '0:10:310', arabicType: 'مكية' },
    { id: 103, arabicName: 'سورة العصر', arabicNameSimple: 'العصر', verses: 3, duration: '0:05:320', arabicType: 'مكية' },
    { id: 104, arabicName: 'سورة الهمزة', arabicNameSimple: 'الهمزة', verses: 9, duration: '0:10:330', arabicType: 'مكية' },
    { id: 105, arabicName: 'سورة الفيل', arabicNameSimple: 'الفيل', verses: 5, duration: '0:05:340', arabicType: 'مكية' },
    { id: 106, arabicName: 'سورة قريش', arabicNameSimple: 'قريش', verses: 4, duration: '0:05:350', arabicType: 'مكية' },
    { id: 107, arabicName: 'سورة الماعون', arabicNameSimple: 'الماعون', verses: 7, duration: '0:10:360', arabicType: 'مكية' },
    { id: 108, arabicName: 'سورة الكوثر', arabicNameSimple: 'الكوثر', verses: 3, duration: '0:05:370', arabicType: 'مكية' },
    { id: 109, arabicName: 'سورة الكافرون', arabicNameSimple: 'الكافرون', verses: 6, duration: '0:10:380', arabicType: 'مكية' },
    { id: 110, arabicName: 'سورة النصر', arabicNameSimple: 'النصر', verses: 3, duration: '0:05:390', arabicType: 'مدنية' },
    { id: 111, arabicName: 'سورة المسد', arabicNameSimple: 'المسد', verses: 5, duration: '0:05:400', arabicType: 'مكية' },
    { id: 112, arabicName: 'سورة الإخلاص', arabicNameSimple: 'الإخلاص', verses: 4, duration: '0:05:410', arabicType: 'مكية' },
    { id: 113, arabicName: 'سورة الفلق', arabicNameSimple: 'الفلق', verses: 5, duration: '0:05:420', arabicType: 'مكية' },
    { id: 114, arabicName: 'سورة الناس', arabicNameSimple: 'الناس', verses: 6, duration: '0:05:430', arabicType: 'مكية' },
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
