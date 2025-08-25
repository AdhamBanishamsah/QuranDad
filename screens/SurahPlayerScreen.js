import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { getFirebaseStorageUrl } from '../utils/hostingConfig';
import { checkIfSurahDownloaded, getLocalAudioPath } from '../utils/fileSystem';
import { saveReadingMode, getReadingMode } from '../utils/readingModeStorage';
import audioManager from '../utils/audioManager';

const SurahPlayerScreen = ({ route, navigation }) => {
  const { surah } = route.params;

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
    { id: 55, arabicName: 'سورة الرحمن', arabicNameSimple: 'الرحمن', verses: 78, duration: '1:15:40', arabicType: 'مدنية' },
    { id: 56, arabicName: 'سورة الواقعة', arabicNameSimple: 'الواقعة', verses: 96, duration: '1:25:15', arabicType: 'مكية' },
    { id: 57, arabicName: 'سورة الحديد', arabicNameSimple: 'الحديد', verses: 29, duration: '0:45:20', arabicType: 'مدنية' },
    { id: 58, arabicName: 'سورة المجادلة', arabicNameSimple: 'المجادلة', verses: 22, duration: '0:35:15', arabicType: 'مدنية' },
    { id: 59, arabicName: 'سورة الحشر', arabicNameSimple: 'الحشر', verses: 24, duration: '0:40:10', arabicType: 'مدنية' },
    { id: 60, arabicName: 'سورة الممتحنة', arabicNameSimple: 'الممتحنة', verses: 13, duration: '0:25:30', arabicType: 'مدنية' },
    { id: 61, arabicName: 'سورة الصف', arabicNameSimple: 'الصف', verses: 14, duration: '0:25:15', arabicType: 'مدنية' },
    { id: 62, arabicName: 'سورة الجمعة', arabicNameSimple: 'الجمعة', verses: 11, duration: '0:20:20', arabicType: 'مدنية' },
    { id: 63, arabicName: 'سورة المنافقون', arabicNameSimple: 'المنافقون', verses: 11, duration: '0:20:15', arabicType: 'مدنية' },
    { id: 64, arabicName: 'سورة التغابن', arabicNameSimple: 'التغابن', verses: 18, duration: '0:30:25', arabicType: 'مدنية' },
    { id: 65, arabicName: 'سورة الطلاق', arabicNameSimple: 'الطلاق', verses: 12, duration: '0:20:30', arabicType: 'مدنية' },
    { id: 66, arabicName: 'سورة التحريم', arabicNameSimple: 'التحريم', verses: 12, duration: '0:20:15', arabicType: 'مدنية' },
    { id: 67, arabicName: 'سورة الملك', arabicNameSimple: 'الملك', verses: 30, duration: '0:40:20', arabicType: 'مكية' },
    { id: 68, arabicName: 'سورة القلم', arabicNameSimple: 'القلم', verses: 52, duration: '0:55:15', arabicType: 'مكية' },
    { id: 69, arabicName: 'سورة الحاقة', arabicNameSimple: 'الحاقة', verses: 52, duration: '0:55:30', arabicType: 'مكية' },
    { id: 70, arabicName: 'سورة المعارج', arabicNameSimple: 'المعارج', verses: 44, duration: '0:50:25', arabicType: 'مكية' },
    { id: 71, arabicName: 'سورة نوح', arabicNameSimple: 'نوح', verses: 28, duration: '0:35:20', arabicType: 'مكية' },
    { id: 72, arabicName: 'سورة الجن', arabicNameSimple: 'الجن', verses: 28, duration: '0:35:15', arabicType: 'مكية' },
    { id: 73, arabicName: 'سورة المزمل', arabicNameSimple: 'المزمل', verses: 20, duration: '0:30:10', arabicType: 'مكية' },
    { id: 74, arabicName: 'سورة المدثر', arabicNameSimple: 'المدثر', verses: 56, duration: '0:55:40', arabicType: 'مكية' },
    { id: 75, arabicName: 'سورة القيامة', arabicNameSimple: 'القيامة', verses: 40, duration: '0:45:15', arabicType: 'مكية' },
    { id: 76, arabicName: 'سورة الإنسان', arabicNameSimple: 'الإنسان', verses: 31, duration: '0:40:20', arabicType: 'مدنية' },
    { id: 77, arabicName: 'سورة المرسلات', arabicNameSimple: 'المرسلات', verses: 50, duration: '0:55:30', arabicType: 'مكية' },
    { id: 78, arabicName: 'سورة النبأ', arabicNameSimple: 'النبأ', verses: 40, duration: '0:45:25', arabicType: 'مكية' },
    { id: 79, arabicName: 'سورة النازعات', arabicNameSimple: 'النازعات', verses: 46, duration: '0:50:15', arabicType: 'مكية' },
    { id: 80, arabicName: 'سورة عبس', arabicNameSimple: 'عبس', verses: 42, duration: '0:45:30', arabicType: 'مكية' },
    { id: 81, arabicName: 'سورة التكوير', arabicNameSimple: 'التكوير', verses: 29, duration: '0:35:20', arabicType: 'مكية' },
    { id: 82, arabicName: 'سورة الانفطار', arabicNameSimple: 'الانفطار', verses: 19, duration: '0:25:15', arabicType: 'مكية' },
    { id: 83, arabicName: 'سورة المطففين', arabicNameSimple: 'المطففين', verses: 36, duration: '0:30:25', arabicType: 'مكية' },
    { id: 84, arabicName: 'سورة الانشقاق', arabicNameSimple: 'الانشقاق', verses: 25, duration: '0:25:30', arabicType: 'مكية' },
    { id: 85, arabicName: 'سورة البروج', arabicNameSimple: 'البروج', verses: 22, duration: '0:20:15', arabicType: 'مكية' },
    { id: 86, arabicName: 'سورة الطارق', arabicNameSimple: 'الطارق', verses: 17, duration: '0:15:20', arabicType: 'مكية' },
    { id: 87, arabicName: 'سورة الأعلى', arabicNameSimple: 'الأعلى', verses: 19, duration: '0:20:10', arabicType: 'مكية' },
    { id: 88, arabicName: 'سورة الغاشية', arabicNameSimple: 'الغاشية', verses: 26, duration: '0:25:20', arabicType: 'مكية' },
    { id: 89, arabicName: 'سورة الفجر', arabicNameSimple: 'الفجر', verses: 30, duration: '0:30:15', arabicType: 'مكية' },
    { id: 90, arabicName: 'سورة البلد', arabicNameSimple: 'البلد', verses: 20, duration: '0:20:10', arabicType: 'مكية' },
    { id: 91, arabicName: 'سورة الشمس', arabicNameSimple: 'الشمس', verses: 15, duration: '0:15:15', arabicType: 'مكية' },
    { id: 92, arabicName: 'سورة الليل', arabicNameSimple: 'الليل', verses: 21, duration: '0:20:20', arabicType: 'مكية' },
    { id: 93, arabicName: 'سورة الضحى', arabicNameSimple: 'الضحى', verses: 11, duration: '0:15:10', arabicType: 'مكية' },
    { id: 94, arabicName: 'سورة الشرح', arabicNameSimple: 'الشرح', verses: 8, duration: '0:10:15', arabicType: 'مكية' },
    { id: 95, arabicName: 'سورة التين', arabicNameSimple: 'التين', verses: 8, duration: '0:10:10', arabicType: 'مكية' },
    { id: 96, arabicName: 'سورة العلق', arabicNameSimple: 'العلق', verses: 19, duration: '0:15:20', arabicType: 'مكية' },
    { id: 97, arabicName: 'سورة القدر', arabicNameSimple: 'القدر', verses: 5, duration: '0:10:15', arabicType: 'مكية' },
    { id: 98, arabicName: 'سورة البينة', arabicNameSimple: 'البينة', verses: 8, duration: '0:15:10', arabicType: 'مدنية' },
    { id: 99, arabicName: 'سورة الزلزلة', arabicNameSimple: 'الزلزلة', verses: 8, duration: '0:15:15', arabicType: 'مدنية' },
    { id: 100, arabicName: 'سورة العاديات', arabicNameSimple: 'العاديات', verses: 11, duration: '0:20:10', arabicType: 'مكية' },
    { id: 101, arabicName: 'سورة القارعة', arabicNameSimple: 'القارعة', verses: 11, duration: '0:15:15', arabicType: 'مكية' },
    { id: 102, arabicName: 'سورة التكاثر', arabicNameSimple: 'التكاثر', verses: 8, duration: '0:15:10', arabicType: 'مكية' },
    { id: 103, arabicName: 'سورة العصر', arabicNameSimple: 'العصر', verses: 3, duration: '0:10:10', arabicType: 'مكية' },
    { id: 104, arabicName: 'سورة الهمزة', arabicNameSimple: 'الهمزة', verses: 9, duration: '0:15:15', arabicType: 'مكية' },
    { id: 105, arabicName: 'سورة الفيل', arabicNameSimple: 'الفيل', verses: 5, duration: '0:10:15', arabicType: 'مكية' },
    { id: 106, arabicName: 'سورة قريش', arabicNameSimple: 'قريش', verses: 4, duration: '0:10:10', arabicType: 'مكية' },
    { id: 107, arabicName: 'سورة الماعون', arabicNameSimple: 'الماعون', verses: 7, duration: '0:15:10', arabicType: 'مكية' },
    { id: 108, arabicName: 'سورة الكوثر', arabicNameSimple: 'الكوثر', verses: 3, duration: '0:10:10', arabicType: 'مكية' },
    { id: 109, arabicName: 'سورة الكافرون', arabicNameSimple: 'الكافرون', verses: 6, duration: '0:15:15', arabicType: 'مكية' },
    { id: 110, arabicName: 'سورة النصر', arabicNameSimple: 'النصر', verses: 3, duration: '0:10:10', arabicType: 'مدنية' },
    { id: 111, arabicName: 'سورة المسد', arabicNameSimple: 'المسد', verses: 5, duration: '0:10:15', arabicType: 'مكية' },
    { id: 112, arabicName: 'سورة الإخلاص', arabicNameSimple: 'الإخلاص', verses: 4, duration: '0:10:10', arabicType: 'مكية' },
    { id: 113, arabicName: 'سورة الفلق', arabicNameSimple: 'الفلق', verses: 5, duration: '0:10:15', arabicType: 'مكية' },
    { id: 114, arabicName: 'سورة الناس', arabicNameSimple: 'الناس', verses: 6, duration: '0:10:10', arabicType: 'مكية' }
  ];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [readingMode, setReadingMode] = useState('once'); // 'once', 'repeat', 'continue'
  const readingModeRef = useRef('once'); // Ref to track current reading mode
  
  // Wave animation values
  const wave1Anim = useRef(new Animated.Value(8)).current;
  const wave2Anim = useRef(new Animated.Value(12)).current;
  const wave3Anim = useRef(new Animated.Value(18)).current;
  const wave4Anim = useRef(new Animated.Value(12)).current;
  const wave5Anim = useRef(new Animated.Value(8)).current;

    useEffect(() => {
    // Load saved reading mode
    const loadSavedReadingMode = async () => {
      const savedMode = await getReadingMode();
      setReadingMode(savedMode);
      readingModeRef.current = savedMode;
      // Update audio manager with saved reading mode
      audioManager.setReadingMode(savedMode);
    };
    
    loadSavedReadingMode();
    
    // Check if we're returning to the same surah that's already playing
    const currentPlayingSurahId = audioManager.getCurrentSurahId();
    if (currentPlayingSurahId === surah.id && audioManager.getCurrentSound()) {
      console.log(`🎵 Returning to same surah ${surah.id} - continuing playback`);
      const currentSound = audioManager.getCurrentSound();
      setSound(currentSound);
      setIsPlaying(audioManager.isCurrentlyPlaying());
      if (audioManager.isCurrentlyPlaying()) {
        startWaveAnimation();
      }
      // Set up playback status update for existing sound
      currentSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } else {
      // Load new audio
      loadAudio();
    }

    // Don't stop audio when leaving screen - let it continue playing
    return () => {
      // Only cleanup if component is unmounting completely (not just navigating away)
      // Audio will continue playing in background
      console.log('🎵 Audio continues playing in background');
    };
  }, []);

  // Wave animation function
  const startWaveAnimation = () => {
    const createWaveAnimation = (animValue, minHeight, maxHeight, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: maxHeight,
            duration: 800,
            delay: delay,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: minHeight,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
    };

    createWaveAnimation(wave1Anim, 8, 20, 0).start();
    createWaveAnimation(wave2Anim, 12, 25, 100).start();
    createWaveAnimation(wave3Anim, 18, 30, 200).start();
    createWaveAnimation(wave4Anim, 12, 25, 300).start();
    createWaveAnimation(wave5Anim, 8, 20, 400).start();
  };

  const stopWaveAnimation = () => {
    wave1Anim.stopAnimation();
    wave2Anim.stopAnimation();
    wave3Anim.stopAnimation();
    wave4Anim.stopAnimation();
    wave5Anim.stopAnimation();
  };

    // Audio playback functions
  const loadAudio = async () => {
    try {
      setLoading(true);
      
      // Check if the surah is already downloaded locally
      const isDownloaded = await checkIfSurahDownloaded(surah.id);
      let audioSource;
      
      if (isDownloaded) {
        // Use local file if downloaded
        audioSource = { uri: getLocalAudioPath(surah.id) };
        console.log('Using local file:', getLocalAudioPath(surah.id));
      } else {
        // Check network connectivity for streaming
        try {
          await fetch('https://www.google.com', { method: 'HEAD', timeout: 5000 });
        } catch (error) {
          Alert.alert(
            'غير متصل بالإنترنت',
            `لا يمكن تشغيل سورة ${surah.arabicNameSimple} بدون اتصال بالإنترنت. يرجى تحميل السورة أولاً للاستماع دون اتصال.`,
            [{ text: 'حسناً' }]
          );
          setLoading(false);
          return;
        }
        
        // Stream from Firebase
        try {
          console.log(`🎵 Loading Surah ${surah.id} (${surah.arabicNameSimple}) from Firebase...`);
          const remoteUrl = await getFirebaseStorageUrl(surah.id);
          audioSource = { uri: remoteUrl };
          console.log('✅ Streaming from Firebase URL:', remoteUrl);
        } catch (error) {
          console.error(`❌ Error getting remote audio URL for Surah ${surah.id}:`, error);
          Alert.alert(
            'السورة غير متوفرة',
            `سورة ${surah.arabicNameSimple} غير متوفرة حالياً على الخادم.`,
            [{ text: 'حسناً' }]
          );
          setLoading(false);
          return;
        }
      }

      // Use audio manager to handle surah switching
      const newSound = await audioManager.playSurah(surah.id, audioSource, onPlaybackStatusUpdate, handleSurahFinished);
      
      setSound(newSound);
      setIsPlaying(true);
      startWaveAnimation();

    } catch (error) {
      console.log('Error loading audio:', error);
      Alert.alert(
        'خطأ في الصوت',
        `حدث خطأ أثناء تحميل الصوت لسورة ${surah.arabicNameSimple}`,
        [{ text: 'حسناً' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
    }
  };



  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        // If currently playing, pause it
        await sound.pauseAsync();
        stopWaveAnimation();
      } else {
        // If paused or stopped, start playing
        // If we're at the end of the audio, restart from beginning
        if (currentTime >= duration - 1) {
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
        startWaveAnimation();
      }
    } catch (error) {
      console.log('Error in handlePlayPause:', error);
    }
  };

  const handleSkipForward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.min(currentTime + 30, duration);
      await sound.setPositionAsync(newPosition * 1000);
    } catch (error) {
      console.log('Error in handleSkipForward:', error);
    }
  };

  const handleSkipBackward = async () => {
    if (!sound) return;
    try {
      const newPosition = Math.max(currentTime - 30, 0);
      await sound.setPositionAsync(newPosition * 1000);
    } catch (error) {
      console.log('Error in handleSkipBackward:', error);
    }
  };

    const handleSurahFinished = async (finishedSurahId) => {
    console.log(`🎵 Surah ${finishedSurahId} finished, continuing to next surah`);
    
    // Find next surah
    const nextSurahId = finishedSurahId === 114 ? 1 : finishedSurahId + 1;
    const nextSurah = surahs.find(s => s.id === nextSurahId);
    
    if (nextSurah) {
      console.log(`⏭️ Loading next surah: ${nextSurah.arabicNameSimple} (${nextSurahId})`);
      
      // Update the current surah in the route params
      navigation.replace('SurahPlayer', { surah: nextSurah });
    }
  };

  const handleReadingModeChange = async (mode) => {
    setReadingMode(mode);
    readingModeRef.current = mode; // Update ref immediately
    
    // Update audio manager reading mode
    audioManager.setReadingMode(mode);
    
    // Save the reading mode for future use
    await saveReadingMode(mode);

    const modeNames = {
      'once': 'مرة واحدة',
      'repeat': 'تكرار',
      'continue': 'متابعة'
    };

    console.log(`📖 Reading mode changed to: ${modeNames[mode]} (ref: ${readingModeRef.current})`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Header */}
                           <View style={styles.header}>
                   <TouchableOpacity
                     style={styles.backButton}
                     onPress={() => {
                       // Let audio continue playing when going back
                       console.log('🎵 Audio continues playing when navigating back');
                       navigation.goBack();
                     }}
                   >
                     <View style={styles.backButtonContainer}>
                       <Ionicons name="chevron-back" size={24} color="#ffffff" />
                     </View>
                   </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>مشغل السورة</Text>
              
            </View>
            <View style={styles.placeholder} />
          </View>

          {/* Surah Info */}
          <View style={styles.surahInfoContainer}>
            
            <View style={styles.surahDetails}>
              <Text style={styles.surahName}>{surah.arabicName}</Text>
              <Text style={styles.surahNameSimple}>{surah.arabicNameSimple}</Text>
              <View style={styles.surahMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="book-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
                  <Text style={styles.surahMetaText}>{surah.verses} آية</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
                  <Text style={styles.surahMetaText}>{surah.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
                  <Text style={styles.surahMetaText}>{surah.arabicType}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Audio Player Card */}
          <View style={styles.playerCard}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.audioProgressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                <View style={styles.progressThumb} />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Wave Animation */}
            {isPlaying && (
              <View style={styles.waveContainer}>
                <Animated.View style={[styles.wave, { height: wave1Anim }]} />
                <Animated.View style={[styles.wave, { height: wave2Anim }]} />
                <Animated.View style={[styles.wave, { height: wave3Anim }]} />
                <Animated.View style={[styles.wave, { height: wave4Anim }]} />
                <Animated.View style={[styles.wave, { height: wave5Anim }]} />
                <Animated.View style={[styles.wave, { height: wave2Anim }]} />
                <Animated.View style={[styles.wave, { height: wave1Anim }]} />
              </View>
            )}

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButton} onPress={handleSkipBackward}>
                <View style={styles.controlButtonInner}>
                  <Ionicons name="play-back" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleSkipForward}>
                <View style={styles.controlButtonInner}>
                  <Ionicons name="play-forward" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>



            {/* Reading Mode Selector */}
            <View style={styles.readingModeContainer}>
              <View style={styles.readingModeHeader}>
                <Text style={styles.readingModeLabel}>وضع القراءة</Text>
                         

              </View>
                                   <View style={styles.readingModeButtons}>
                       <TouchableOpacity
                         style={[styles.readingModeButton, readingMode === 'once' && styles.readingModeActive]}
                         onPress={() => handleReadingModeChange('once')}
                       >
                         <Ionicons
                           name="play-outline"
                           size={16}
                           color={readingMode === 'once' ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
                         />
                         <Text style={[styles.readingModeText, readingMode === 'once' && styles.readingModeTextActive]}>
                           مرة واحدة
                         </Text>
                       </TouchableOpacity>
                       <TouchableOpacity
                         style={[styles.readingModeButton, readingMode === 'repeat' && styles.readingModeActive]}
                         onPress={() => handleReadingModeChange('repeat')}
                       >
                         <Ionicons
                           name="repeat-outline"
                           size={16}
                           color={readingMode === 'repeat' ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
                         />
                         <Text style={[styles.readingModeText, readingMode === 'repeat' && styles.readingModeTextActive]}>
                           تكرار
                         </Text>
                       </TouchableOpacity>
                       <TouchableOpacity
                         style={[styles.readingModeButton, readingMode === 'continue' && styles.readingModeActive]}
                         onPress={() => handleReadingModeChange('continue')}
                       >
                         <Ionicons
                           name="play-forward-outline"
                           size={16}
                           color={readingMode === 'continue' ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
                         />
                         <Text style={[styles.readingModeText, readingMode === 'continue' && styles.readingModeTextActive]}>
                           متابعة
                         </Text>
                       </TouchableOpacity>
                     </View>
            </View>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>جاري تحميل الصوت...</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  surahInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  surahNumberContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(233, 69, 96, 0.4)',
  },
  surahNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
  },
  surahDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  surahNameSimple: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  surahMetaText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  playerCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  progressContainer: {
    marginBottom: 30,
  },
  audioProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    marginBottom: 15,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 4,
  },
  progressThumb: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e94560',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 12,
  },
  controlButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButton: {
    backgroundColor: '#e94560',
    padding: 25,
    borderRadius: 40,
    marginHorizontal: 40,
    shadowColor: '#e94560',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 50,
  },
  wave: {
    width: 3,
    backgroundColor: '#e94560',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  readingModeContainer: {
    marginBottom: 10,
  },
           readingModeHeader: {
           flexDirection: 'row',
           justifyContent: 'center',
           alignItems: 'center',
           marginBottom: 20,
         },
           readingModeLabel: {
           fontSize: 16,
           color: '#ffffff',
           fontWeight: '600',
           textAlign: 'center',
         },
  currentModeIndicator: {
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.5)',
  },
  currentModeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
           readingModeButtons: {
           flexDirection: 'row',
           justifyContent: 'center',
           gap: 12,
         },
         readingModeButton: {
           flexDirection: 'row',
           alignItems: 'center',
           paddingHorizontal: 16,
           paddingVertical: 8,
           borderRadius: 16,
           backgroundColor: 'rgba(255, 255, 255, 0.08)',
           borderWidth: 1,
           borderColor: 'rgba(255, 255, 255, 0.15)',
           gap: 6,
           minWidth: 100,
           justifyContent: 'center',
         },
  readingModeActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    borderColor: '#e94560',
  },
           readingModeText: {
           fontSize: 12,
           color: 'rgba(255, 255, 255, 0.7)',
           fontWeight: '500',
         },
  readingModeTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SurahPlayerScreen;
