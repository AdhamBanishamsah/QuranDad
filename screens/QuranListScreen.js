import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  AppState,
  Animated,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from 'react-native';


import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import {
  downloadSurah,
  isSurahDownloaded,
  getLocalAudioPath,
  checkNetworkConnectivity,
  getFirebaseStorageUrl,
  checkIfSurahDownloaded,
  getDownloadedSurahs,
  cancelCurrentDownload,
} from '../utils/fileSystem';
import { getRemoteAudioUrl } from '../utils/firebaseConfig';
import { testFirebaseConnection, testSurahUrl, getUploadStatus } from '../utils/testFirebase';
import { getReadingMode, saveReadingMode } from '../utils/readingModeStorage';
import audioManager from '../utils/audioManager';
import FloatingMediaPlayer from '../components/FloatingMediaPlayer';

// No bundled audio files - all audio will be streamed from Firebase

const QuranListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlayingSurah, setCurrentPlayingSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [waveAnimation, setWaveAnimation] = useState(false);
  const [downloadingSurah, setDownloadingSurah] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkDownloadProgress, setBulkDownloadProgress] = useState(0);
  const [networkConnected, setNetworkConnected] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [downloadedSurahs, setDownloadedSurahs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [readingMode, setReadingMode] = useState('once'); // 'once', 'repeat', 'continue'
  const [cancelled, setCancelled] = useState(false);
  
  // Use ref for immediate cancellation check
  const cancelledRef = useRef(false);
  
  // Wave animation values
  const wave1Anim = useRef(new Animated.Value(8)).current;
  const wave2Anim = useRef(new Animated.Value(12)).current;
  const wave3Anim = useRef(new Animated.Value(18)).current;
  const wave4Anim = useRef(new Animated.Value(12)).current;
  const wave5Anim = useRef(new Animated.Value(8)).current;
  
  // Check network connectivity
  const checkNetwork = async () => {
    const isConnected = await checkNetworkConnectivity();
    setNetworkConnected(isConnected);
    return isConnected;
  };
  
  // Check network on app focus
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkNetwork();
        refreshDownloadedSurahs(); // Refresh download status when app comes to foreground
      }
      setAppState(nextAppState);
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    checkNetwork();
    refreshDownloadedSurahs(); // Refresh on initial load
    
    // Load saved reading mode
    const loadSavedReadingMode = async () => {
      const savedMode = await getReadingMode();
      setReadingMode(savedMode);
      // Update audio manager with saved reading mode
      audioManager.setReadingMode(savedMode);
    };
    
    loadSavedReadingMode();
    
    return () => {
      subscription?.remove();
    };
  }, [appState]);

  // Refresh downloads when screen comes into focus (e.g., returning from Downloads page)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshDownloadedSurahs();
    });

    return unsubscribe;
  }, [navigation]);

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
    { id: 83, arabicName: 'سورة المطففين', arabicNameSimple: 'المطففين', verses: 36, duration: '0:40:25', arabicType: 'مكية' },
    { id: 84, arabicName: 'سورة الانشقاق', arabicNameSimple: 'الانشقاق', verses: 25, duration: '0:30:20', arabicType: 'مكية' },
    { id: 85, arabicName: 'سورة البروج', arabicNameSimple: 'البروج', verses: 22, duration: '0:30:15', arabicType: 'مكية' },
    { id: 86, arabicName: 'سورة الطارق', arabicNameSimple: 'الطارق', verses: 17, duration: '0:25:10', arabicType: 'مكية' },
    { id: 87, arabicName: 'سورة الأعلى', arabicNameSimple: 'الأعلى', verses: 19, duration: '0:25:20', arabicType: 'مكية' },
    { id: 88, arabicName: 'سورة الغاشية', arabicNameSimple: 'الغاشية', verses: 26, duration: '0:30:25', arabicType: 'مكية' },
    { id: 89, arabicName: 'سورة الفجر', arabicNameSimple: 'الفجر', verses: 30, duration: '0:35:15', arabicType: 'مكية' },
    { id: 90, arabicName: 'سورة البلد', arabicNameSimple: 'البلد', verses: 20, duration: '0:25:30', arabicType: 'مكية' },
    { id: 91, arabicName: 'سورة الشمس', arabicNameSimple: 'الشمس', verses: 15, duration: '0:20:15', arabicType: 'مكية' },
    { id: 92, arabicName: 'سورة الليل', arabicNameSimple: 'الليل', verses: 21, duration: '0:25:20', arabicType: 'مكية' },
    { id: 93, arabicName: 'سورة الضحى', arabicNameSimple: 'الضحى', verses: 11, duration: '0:15:10', arabicType: 'مكية' },
    { id: 94, arabicName: 'سورة الشرح', arabicNameSimple: 'الشرح', verses: 8, duration: '0:10:15', arabicType: 'مكية' },
    { id: 95, arabicName: 'سورة التين', arabicNameSimple: 'التين', verses: 8, duration: '0:10:20', arabicType: 'مكية' },
    { id: 96, arabicName: 'سورة العلق', arabicNameSimple: 'العلق', verses: 19, duration: '0:20:15', arabicType: 'مكية' },
    { id: 97, arabicName: 'سورة القدر', arabicNameSimple: 'القدر', verses: 5, duration: '0:05:10', arabicType: 'مكية' },
    { id: 98, arabicName: 'سورة البينة', arabicNameSimple: 'البينة', verses: 8, duration: '0:10:25', arabicType: 'مدنية' },
    { id: 99, arabicName: 'سورة الزلزلة', arabicNameSimple: 'الزلزلة', verses: 8, duration: '0:10:15', arabicType: 'مدنية' },
    { id: 100, arabicName: 'سورة العاديات', arabicNameSimple: 'العاديات', verses: 11, duration: '0:15:20', arabicType: 'مكية' },
    { id: 101, arabicName: 'سورة القارعة', arabicNameSimple: 'القارعة', verses: 11, duration: '0:15:15', arabicType: 'مكية' },
    { id: 102, arabicName: 'سورة التكاثر', arabicNameSimple: 'التكاثر', verses: 8, duration: '0:10:10', arabicType: 'مكية' },
    { id: 103, arabicName: 'سورة العصر', arabicNameSimple: 'العصر', verses: 3, duration: '0:05:05', arabicType: 'مكية' },
    { id: 104, arabicName: 'سورة الهمزة', arabicNameSimple: 'الهمزة', verses: 9, duration: '0:10:20', arabicType: 'مكية' },
    { id: 105, arabicName: 'سورة الفيل', arabicNameSimple: 'الفيل', verses: 5, duration: '0:05:15', arabicType: 'مكية' },
    { id: 106, arabicName: 'سورة قريش', arabicNameSimple: 'قريش', verses: 4, duration: '0:05:10', arabicType: 'مكية' },
    { id: 107, arabicName: 'سورة الماعون', arabicNameSimple: 'الماعون', verses: 7, duration: '0:08:15', arabicType: 'مكية' },
    { id: 108, arabicName: 'سورة الكوثر', arabicNameSimple: 'الكوثر', verses: 3, duration: '0:05:05', arabicType: 'مكية' },
    { id: 109, arabicName: 'سورة الكافرون', arabicNameSimple: 'الكافرون', verses: 6, duration: '0:08:10', arabicType: 'مكية' },
    { id: 110, arabicName: 'سورة النصر', arabicNameSimple: 'النصر', verses: 3, duration: '0:05:05', arabicType: 'مدنية' },
    { id: 111, arabicName: 'سورة المسد', arabicNameSimple: 'المسد', verses: 5, duration: '0:05:15', arabicType: 'مكية' },
    { id: 112, arabicName: 'سورة الإخلاص', arabicNameSimple: 'الإخلاص', verses: 4, duration: '0:05:10', arabicType: 'مكية' },
    { id: 113, arabicName: 'سورة الفلق', arabicNameSimple: 'الفلق', verses: 5, duration: '0:05:15', arabicType: 'مكية' },
    { id: 114, arabicName: 'سورة الناس', arabicNameSimple: 'الناس', verses: 6, duration: '0:05:20', arabicType: 'مكية' },
  ];

  const filteredSurahs = surahs.filter(surah =>
    surah.arabicName.includes(searchQuery) ||
    surah.arabicNameSimple.includes(searchQuery)
  );

  // Configure audio session for background playback
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Error configuring audio session:', error);
      }
    };

    configureAudioSession();
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground!');
      } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        console.log('App has gone to the background!');
        // Show notification when going to background with audio playing

      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [appState, isPlaying, currentPlayingSurah]);



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

  // Check if surah is downloaded
  const checkIfSurahDownloaded = async (surahId) => {
    try {
      return await isSurahDownloaded(surahId);
    } catch (error) {
      console.log('Error checking if surah is downloaded:', error);
      return false;
    }
  };

  // Refresh downloaded surahs list
  const refreshDownloadedSurahs = async () => {
    try {
      const downloadedSurahsList = await getDownloadedSurahs();
      const downloadedIds = downloadedSurahsList.map(surah => surah.id);
      setDownloadedSurahs(downloadedIds);
      console.log('🔄 Refreshed downloaded surahs:', downloadedIds);
    } catch (error) {
      console.error('Error refreshing downloaded surahs:', error);
    }
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDownloadedSurahs();
    setRefreshing(false);
  };

  // Audio playback functions - Check local first, then Firebase
  const loadAudio = async (surahId) => {
    try {
      setLoading(true);
      setLoadingAudio(true);
      
      const currentSurah = surahs.find(s => s.id === surahId);
      
      // Check if the surah is already downloaded locally
      const isDownloaded = await checkIfSurahDownloaded(surahId);
      let audioSource;
      
      if (isDownloaded) {
        // Use local file if downloaded
        audioSource = { uri: getLocalAudioPath(surahId) };
        console.log('Using local file:', getLocalAudioPath(surahId));
      } else {
        // Check network connectivity for streaming
        const isConnected = await checkNetwork();
        if (!isConnected) {
          Alert.alert(
            'غير متصل بالإنترنت',
            `لا يمكن تشغيل سورة ${currentSurah?.arabicNameSimple} بدون اتصال بالإنترنت. يرجى تحميل السورة أولاً للاستماع دون اتصال.`,
            [{ text: 'حسناً' }]
          );
          setLoading(false);
          setLoadingAudio(false);
          return;
        }
        
        // Stream from Firebase
        try {
          console.log(`🎵 Attempting to load Surah ${surahId} (${currentSurah?.arabicNameSimple}) from Firebase...`);
          const remoteUrl = await getFirebaseStorageUrl(surahId);
          audioSource = { uri: remoteUrl };
          console.log('✅ Streaming from Firebase URL:', remoteUrl);
        } catch (error) {
          console.error(`❌ Error getting remote audio URL for Surah ${surahId}:`, error);
          Alert.alert(
            'السورة غير متوفرة',
            `سورة ${currentSurah?.arabicNameSimple} (${surahId}) غير متوفرة حالياً على الخادم.\n\nيمكنك:\n• المحاولة لاحقاً\n• تحميل السورة للاستماع دون اتصال\n• اختبار الاتصال بالسورة`,
            [
              { text: 'حسناً' },
              { text: 'اختبار الاتصال', onPress: () => testSurahConnection(surahId) }
            ]
          );
          setLoading(false);
          setLoadingAudio(false);
          return;
        }
      }
      
      // Use audio manager to handle surah switching
      const newSound = await audioManager.playSurah(surahId, audioSource, onPlaybackStatusUpdate);
      
      setSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingSurah(surahId);
      startWaveAnimation();
      
    } catch (error) {
      console.log('Error loading audio:', error);
      Alert.alert(
        'خطأ في الصوت',
        `حدث خطأ أثناء تحميل الصوت لسورة ${surahs.find(s => s.id === surahId)?.arabicNameSimple}`,
        [{ text: 'حسناً' }]
      );
    } finally {
      setLoading(false);
      setLoadingAudio(false);
    }
  };
  
  // Perform download function (extracted for reuse)
  const performDownload = async (surahId, currentSurah, showSuccessAlert = true) => {
    try {
      // Set downloading state
      setDownloadingSurah(currentSurah);
      setDownloadProgress(0);
      
      let downloadUrl;
      
      // Always try to get remote URL from Firebase first for downloading
      try {
        downloadUrl = await getFirebaseStorageUrl(surahId);
        console.log('Got remote URL for download:', downloadUrl);
      } catch (error) {
        console.error('Error getting remote URL:', error);
        if (showSuccessAlert) {
          Alert.alert(
            'خطأ في الاتصال',
            'تعذر الوصول إلى الملف الصوتي. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.',
            [{ text: 'حسناً' }]
          );
        }
        setDownloadingSurah(null);
        setDownloadProgress(0);
        throw error;
      }
      
      // Download the file
      await downloadSurah(
        surahId,
        downloadUrl,
        (progress) => {
          setDownloadProgress(Math.floor(progress * 100));
        },
        async (filePath) => {
          // Download complete
          setDownloadingSurah(null);
          setDownloadProgress(0);
          
          // Refresh the downloaded surahs list to update all icons
          refreshDownloadedSurahs();
          
          if (showSuccessAlert) {
            Alert.alert(
              'تم التحميل',
              `تم تحميل سورة ${currentSurah?.arabicNameSimple} بنجاح.`,
              [{ text: 'حسناً' }]
            );
          }
        },
        (error) => {
          setDownloadingSurah(null);
          setDownloadProgress(0);
          
          if (showSuccessAlert) {
            Alert.alert(
              'خطأ في التحميل',
              `حدث خطأ أثناء تحميل سورة ${currentSurah?.arabicNameSimple}.`,
              [{ text: 'حسناً' }]
            );
          }
          throw error;
        }
      );
    } catch (error) {
      console.log('Error in performDownload:', error);
      setDownloadingSurah(null);
      setDownloadProgress(0);
      throw error;
    }
  };

  // Download surah function
  const downloadSurahAudio = async (surahId) => {
    try {
      // Check network connectivity
      const isConnected = await checkNetwork();
      if (!isConnected) {
        Alert.alert(
          'غير متصل بالإنترنت',
          'يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.',
          [{ text: 'حسناً' }]
        );
        return;
      }
      
      const currentSurah = surahs.find(s => s.id === surahId);
      
      // Check if already downloaded
      const isDownloaded = await checkIfSurahDownloaded(surahId);
      
      if (isDownloaded) {
        Alert.alert(
          'تم التحميل مسبقاً',
          `تم تحميل سورة ${currentSurah?.arabicNameSimple} مسبقاً.`,
          [{ text: 'حسناً' }]
        );
        return;
      }
      
      // Proceed with download from Firebase
      await performDownload(surahId, currentSurah);
      
    } catch (error) {
      console.log('Error downloading surah:', error);
      Alert.alert(
        'خطأ في التحميل',
        'حدث خطأ أثناء تحميل السورة.',
        [{ text: 'حسناً' }]
      );
      setDownloadingSurah(null);
      setDownloadProgress(0);
    }
  };

  // Check which surahs are available for download (optimized)
  const checkAvailableSurahs = async () => {
    const availableSurahs = [];
    const unavailableSurahs = [];
    
    // Only check first 10 surahs to determine pattern, then estimate
    const sampleSize = 10;
    const timeout = 5000; // 5 seconds timeout per check
    
    // Check a sample of surahs first
    let availableCount = 0;
    let totalChecked = 0;
    
    for (let i = 1; i <= sampleSize; i++) {
      const surah = surahs.find(s => s.id === i);
      if (surah && !downloadedSurahs.includes(i)) {
        totalChecked++;
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          );
          
          const urlPromise = getFirebaseStorageUrl(i);
          await Promise.race([urlPromise, timeoutPromise]);
          
          availableCount++;
          availableSurahs.push(surah);
          console.log(`✅ Sample surah ${i} available`);
        } catch (error) {
          console.log(`❌ Sample surah ${i} not available:`, error.message);
          unavailableSurahs.push(surah);
        }
      }
    }
    
    // If we have a good sample, estimate the rest
    if (totalChecked > 0) {
      const availabilityRate = availableCount / totalChecked;
      console.log(`📊 Availability rate: ${(availabilityRate * 100).toFixed(1)}%`);
      
      // Estimate remaining surahs based on sample
      for (let i = sampleSize + 1; i <= 114; i++) {
        const surah = surahs.find(s => s.id === i);
        if (surah && !downloadedSurahs.includes(i)) {
          if (availabilityRate > 0.5) {
            // If more than 50% are available, assume this one is too
            availableSurahs.push(surah);
          } else {
            // If less than 50% are available, assume this one isn't
            unavailableSurahs.push(surah);
          }
        }
      }
    }
    
    console.log(`📊 Quick check complete: ${availableSurahs.length} estimated available, ${unavailableSurahs.length} estimated unavailable`);
    return { availableSurahs, unavailableSurahs };
  };

  // Check WiFi connection
  const checkWiFiConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log('WiFi check failed:', error.message);
      return false;
    }
  };

  // Download all available surahs
  const downloadAllAvailableSurahs = async () => {
    try {
      // Show checking phase
      setLoading(true);
      
      // Check network connectivity first
      const isConnected = await checkNetwork();
      if (!isConnected) {
        setLoading(false);
        Alert.alert(
          'غير متصل بالإنترنت',
          'يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.',
          [{ text: 'حسناً' }]
        );
        return;
      }

      // Check WiFi connection with timeout
      try {
        const isWiFi = await checkWiFiConnection();
        if (!isWiFi) {
          setLoading(false);
          Alert.alert(
            'تحذير: استخدام البيانات الخلوية',
            'أنت غير متصل بشبكة WiFi. التحميل سيستخدم بيانات الجوال.\n\nهل تريد المتابعة؟',
            [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'متابعة', onPress: () => startDownloadProcess() }
            ]
          );
          return;
        }
      } catch (error) {
        console.log('WiFi check failed, proceeding anyway:', error);
        // Continue even if WiFi check fails
      }

      // Ask user for checking preference
      Alert.alert(
        'خيارات التحميل',
        'اختر طريقة التحميل:',
        [
          { text: 'إلغاء', style: 'cancel' },
          { 
            text: 'فحص سريع (10 ثواني)', 
            onPress: () => startDownloadProcess()
          },
          { 
            text: 'تحميل مباشر', 
            onPress: () => startDirectDownload()
          }
        ]
      );
      
      setLoading(false);
      
    } catch (error) {
      setLoading(false);
      console.log('Error in downloadAllAvailableSurahs:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء فحص الاتصال');
    }
  };

  // Start direct download without checking
  const startDirectDownload = async () => {
    try {
      // Get all surahs that aren't downloaded yet
      const undownloadedSurahs = surahs.filter(surah => !downloadedSurahs.includes(surah.id));
      
      if (undownloadedSurahs.length === 0) {
        Alert.alert(
          'لا توجد سور للتحميل',
          'جميع السور محملة مسبقاً.',
          [{ text: 'حسناً' }]
        );
        return;
      }
      
      Alert.alert(
        'تحميل مباشر',
        `سيتم محاولة تحميل ${undownloadedSurahs.length} سورة.\n\nسيتم تجاهل السور غير المتاحة تلقائياً.`,
        [
          { text: 'إلغاء', style: 'cancel' },
          { 
            text: 'بدء التحميل', 
            onPress: () => executeBulkDownload(undownloadedSurahs)
          }
        ]
      );
    } catch (error) {
      console.log('Error in startDirectDownload:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء بدء التحميل المباشر');
    }
  };

  // Start the actual download process
  const startDownloadProcess = async () => {
    try {
      // Add overall timeout for the entire process
      const processTimeout = setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'انتهت مهلة الفحص',
          'استغرق الفحص وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
          [{ text: 'حسناً' }]
        );
      }, 15000); // 15 seconds timeout (reduced from 30)

      // Check which surahs are available
      const { availableSurahs, unavailableSurahs } = await checkAvailableSurahs();
      
      clearTimeout(processTimeout);
      
      if (availableSurahs.length === 0) {
        setLoading(false);
        Alert.alert(
          'لا توجد سور متاحة',
          'جميع السور إما محملة مسبقاً أو غير متاحة للتحميل.',
          [{ text: 'حسناً' }]
        );
        return;
      }
      
      // Show summary before starting download
      let message = `سيتم تحميل ${availableSurahs.length} سورة متاحة.\n\n`;
      if (unavailableSurahs.length > 0) {
        message += `${unavailableSurahs.length} سورة غير متاحة للتحميل.\n\n`;
      }
      message += 'ملاحظة: تم فحص عينة من السور لتسريع العملية.\n\nهل تريد المتابعة؟';
      
      Alert.alert(
        'ملخص التحميل',
        message,
        [
          { text: 'إلغاء', style: 'cancel' },
          { 
            text: 'تحميل المتاح', 
            onPress: () => executeBulkDownload(availableSurahs)
          }
        ]
      );
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in startDownloadProcess:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء فحص السور المتاحة');
    }
  };

  // Execute bulk download with progress tracking
  const executeBulkDownload = async (availableSurahs) => {
    let successCount = 0;
    let failedCount = 0;
    let currentIndex = 0;
    let totalSurahs = availableSurahs.length;
    
    // Reset cancellation flag (both state and ref)
    setCancelled(false);
    cancelledRef.current = false;
    
    // Set bulk download state
    setBulkDownloading(true);
    setBulkDownloadProgress(0);
    
    // Show start message with cancel option
    Alert.alert(
      'تم بدء التحميل',
      `سيتم تحميل ${totalSurahs} سورة.\n\nستظهر أيقونة التحميل ⏳ بجانب كل سورة أثناء تحميلها.\n\nيمكنك إلغاء العملية بالضغط على زر "إلغاء الكل".`,
      [{ text: 'حسناً' }]
    );

    for (let i = 0; i < availableSurahs.length; i++) {
      // Check if bulk download was cancelled (using ref for immediate check)
      if (cancelledRef.current) {
        console.log('Bulk download cancelled by user');
        break;
      }
      
      const surah = availableSurahs[i];
      currentIndex = i + 1;
      
      // Update bulk download progress
      const progress = Math.floor((currentIndex / totalSurahs) * 100);
      setBulkDownloadProgress(progress);
      
      try {
        // Set current downloading surah to show progress
        setDownloadingSurah(surah);
        setDownloadProgress(0);
        
        // Download the surah (silent mode for bulk download)
        await performDownload(surah.id, surah, false);
        successCount++;
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`Failed to download surah ${surah.id}:`, error);
        failedCount++;
      }
    }
    
    // Clear all downloading states
    setDownloadingSurah(null);
    setDownloadProgress(0);
    setBulkDownloading(false);
    setBulkDownloadProgress(0);
    
    // Show final summary
    let resultMessage = `تم تحميل ${successCount} سورة بنجاح.`;
    if (failedCount > 0) {
      resultMessage += `\nفشل تحميل ${failedCount} سورة.`;
    }
    if (cancelledRef.current) {
      resultMessage += `\nتم إلغاء العملية.`;
    }
    
    Alert.alert('تم التحميل', resultMessage, [{ text: 'حسناً' }]);
  };

  // Cancel all downloads
  const cancelAllDownloads = async () => {
    Alert.alert(
      'إلغاء التحميل',
      'هل تريد إلغاء جميع التحميلات الجارية؟',
      [
        { text: 'لا', style: 'cancel' },
        { 
          text: 'نعم، إلغاء الكل', 
          style: 'destructive',
          onPress: async () => {
            // Set cancellation flag (both state and ref)
            setCancelled(true);
            cancelledRef.current = true;
            
            // Cancel the current download
            await cancelCurrentDownload();
            
            // Clear all download states
            setDownloadingSurah(null);
            setDownloadProgress(0);
            setBulkDownloading(false);
            setBulkDownloadProgress(0);
            
            Alert.alert('تم الإلغاء', 'تم إلغاء جميع التحميلات.');
          }
        }
      ]
    );
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      
      // Handle reading modes when audio finishes
      if (status.didJustFinish) {
        handleAudioFinished();
      }
    }
  };

  const handleAudioFinished = async () => {
    if (readingMode === 'once') {
      // Stop playing and reset
      setIsPlaying(false);
      stopWaveAnimation();
    } else if (readingMode === 'repeat') {
      // Restart the same surah
      if (sound) {
        try {
          await sound.setPositionAsync(0);
          await sound.playAsync();
          startWaveAnimation();
        } catch (error) {
          console.log('Error restarting surah:', error);
        }
      }
    } else if (readingMode === 'continue') {
      // Play next surah
      await playNextSurah();
    }
  };

  const playNextSurah = async () => {
    if (!currentPlayingSurah) return;
    
    const currentIndex = surahs.findIndex(s => s.id === currentPlayingSurah);
    if (currentIndex === -1 || currentIndex === surahs.length - 1) {
      // If it's the last surah, stop playing
      setIsPlaying(false);
      stopWaveAnimation();
      return;
    }
    
    const nextSurah = surahs[currentIndex + 1];
    console.log(`🎵 Auto-playing next surah: ${nextSurah.arabicNameSimple}`);
    
    // Load and play the next surah
    await loadAudio(nextSurah.id);
  };

  const handleReadingModeChange = async (mode) => {
    setReadingMode(mode);
    
    // Update audio manager reading mode
    audioManager.setReadingMode(mode);
    
    // Save the reading mode for future use
    try {
      await saveReadingMode(mode);
    } catch (error) {
      console.log('Error saving reading mode:', error);
    }
    
    // Show feedback to user
    const modeNames = {
      'once': 'مرة واحدة',
      'repeat': 'تكرار',
      'continue': 'متابعة'
    };
    
    console.log(`📖 Reading mode changed to: ${modeNames[mode]}`);
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        stopWaveAnimation();
      } else {
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

  const handleSurahPress = (surah) => {
    navigation.navigate('SurahPlayer', { surah });
  };
  
  const handleSurahLongPress = (surah) => {
    Alert.alert(
      `سورة ${surah.arabicNameSimple}`,
      'ماذا تريد أن تفعل؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تشغيل', onPress: () => loadAudio(surah.id) },
        { text: 'تحميل', onPress: () => downloadSurahAudio(surah.id) },
        { text: 'اختبار الاتصال', onPress: () => testSurahConnection(surah.id) },
      ]
    );
  };

  const testSurahConnection = async (surahId) => {
    try {
      const result = await testSurahUrl(surahId);
      if (result.success) {
        Alert.alert(
          '✅ تم الاتصال بنجاح',
          `سورة ${surahs.find(s => s.id === surahId)?.arabicNameSimple}\n\nالرابط متاح للتحميل`,
          [{ text: 'حسناً' }]
        );
      } else {
        Alert.alert(
          '❌ فشل الاتصال',
          `سورة ${surahs.find(s => s.id === surahId)?.arabicNameSimple}\n\n${result.error}`,
          [{ text: 'حسناً' }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ خطأ في الاختبار',
        error.message,
        [{ text: 'حسناً' }]
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        try {
          sound.unloadAsync();
        } catch (error) {
          console.log('Error unloading sound on cleanup:', error);
        }
      }
    };
  }, [sound]);

  // Check all downloaded surahs when component mounts or after download completes
  useEffect(() => {
    const checkAllDownloadedSurahs = async () => {
      const downloaded = [];
      for (const surah of surahs) {
        const isDownloaded = await checkIfSurahDownloaded(surah.id);
        if (isDownloaded) {
          downloaded.push(surah.id);
        }
      }
      setDownloadedSurahs(downloaded);
    };
    
    checkAllDownloadedSurahs();
  }, [downloadingSurah]);
  
  const renderSurahCard = ({ item }) => {
    const isPlaying = currentPlayingSurah === item.id;
    const isDownloading = downloadingSurah?.id === item.id;
    const isDownloaded = downloadedSurahs.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.surahCard, Boolean(isPlaying) && styles.playingCard]}
        onPress={() => handleSurahPress(item)}
        onLongPress={() => handleSurahLongPress(item)}
        disabled={Boolean(isDownloading)}
      >
                  <View style={[styles.cardGradient, Boolean(isPlaying) && styles.playingCardGradient]}>
          <View style={styles.cardContent}>
            {/* Left Section - Metadata */}
            <View style={styles.leftSection}>
              <View style={[styles.typeTag, Boolean(isPlaying) && styles.playingTag]}>
                <Text style={[styles.typeText, Boolean(isPlaying) && styles.playingTagText]}>
                  {item.arabicType}
                </Text>
              </View>
              <Text style={[styles.versesText, Boolean(isPlaying) && styles.playingText]}>
                {item.verses} آية
              </Text>
              <Text style={[styles.durationText, Boolean(isPlaying) && styles.playingText]}>
                {item.duration}
              </Text>
            </View>
            
            {/* Center Section - Surah Names */}
            <View style={styles.centerSection}>
              <View style={styles.surahInfo}>
                <Text style={[styles.surahName, Boolean(isPlaying) && styles.playingText]}>
                  {item.arabicName}
                </Text>
                <Text style={[styles.surahNameSimple, Boolean(isPlaying) && styles.playingText]}>
                  {item.arabicNameSimple}
                </Text>
              </View>
            </View>
            
            {/* Right Section - Surah Number and Download Icon */}
            <View style={styles.rightSection}>
              {Boolean(isDownloading) ? (
                <>
                  <View style={styles.downloadingBadge}>
                    <Text style={styles.downloadingText}>⏳</Text>
                  </View>
                  
                  {/* Cancel Download Button */}
                  <TouchableOpacity
                    style={styles.cancelDownloadButton}
                    onPress={async (e) => {
                      e.stopPropagation();
                      
                      // Set cancellation flag (both state and ref)
                      setCancelled(true);
                      cancelledRef.current = true;
                      
                      // Cancel the current download
                      await cancelCurrentDownload();
                      
                      // Clear download states
                      setDownloadingSurah(null);
                      setDownloadProgress(0);
                      
                      Alert.alert('تم الإلغاء', 'تم إلغاء تحميل السورة.');
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={[styles.numberBadge, Boolean(isPlaying) && styles.playingBadge]}>
                                          <Text style={[styles.numberText, Boolean(isPlaying) && styles.playingNumberText]}>
                      {item.id}
                    </Text>
                    {Boolean(isDownloaded) && (
                      <View style={styles.downloadedIndicator}>
                        <Ionicons name="cloud-done" size={12} color="#4CAF50" />
                      </View>
                    )}
                  </View>
                  
                  {/* Download Icon */}
                  <TouchableOpacity
                    style={styles.downloadIconButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      downloadSurahAudio(item.id);
                    }}
                    disabled={Boolean(isDownloaded)}
                  >
                    <Ionicons 
                      name={isDownloaded ? "cloud-done" : "cloud-download-outline"} 
                      size={20} 
                      color={isDownloaded ? "#4CAF50" : "#ffffff"} 
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const currentSurah = surahs.find(s => s.id === currentPlayingSurah);

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
            <View style={styles.placeholder} />
            <Text style={styles.headerTitle}>فهرس السور</Text>
            <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن السورة..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>

        {/* Download All Container - Always Visible */}
        <View style={styles.downloadAllContainer}>
          {/* Main Button - Changes based on state */}
          <TouchableOpacity 
            style={[
              styles.buttonGradient,
              Boolean(bulkDownloading) && styles.cancelAllButton
            ]}
            onPress={Boolean(bulkDownloading) ? cancelAllDownloads : downloadAllAvailableSurahs}
            disabled={Boolean(loading) || (Boolean(downloadingSurah) && !Boolean(bulkDownloading))}
          >
            <Text style={[
              styles.downloadAllText,
              Boolean(bulkDownloading) && styles.cancelAllText
            ]}>
              {loading ? 'جاري الفحص...' : 
               Boolean(bulkDownloading) ? 'إلغاء الكل' : 
               Boolean(downloadingSurah) ? 'جاري التحميل...' : 
               'تحميل الكل'}
            </Text>
          </TouchableOpacity>
          
          {/* Progress Indicator - Always visible when downloading */}
          {(Boolean(downloadingSurah) || Boolean(bulkDownloading)) && (
            <View style={[
              styles.progressIndicator,
              Boolean(bulkDownloading) && styles.bulkProgressIndicator
            ]}>
              <Text style={[
                styles.progressText,
                Boolean(bulkDownloading) && styles.bulkProgressText
              ]}>
                {Boolean(bulkDownloading) 
                  ? `جاري تحميل جميع السور: ${bulkDownloadProgress}%`
                  : `جاري تحميل: ${downloadingSurah?.arabicNameSimple}`
                }
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBar, 
                  { width: `${Boolean(bulkDownloading) ? bulkDownloadProgress : downloadProgress}%` }
                ]} />
              </View>
              <Text style={[
                styles.progressPercentage,
                Boolean(bulkDownloading) && styles.currentSurahText
              ]}>
                {Boolean(bulkDownloading) && Boolean(downloadingSurah)
                  ? `الحالي: ${downloadingSurah.arabicNameSimple} (${downloadProgress}%)`
                  : `${Boolean(bulkDownloading) ? bulkDownloadProgress : downloadProgress}%`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Floating Media Player */}
        <FloatingMediaPlayer
          isVisible={Boolean(currentSurah)}
          surah={currentSurah}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSkipForward={handleSkipForward}
          onSkipBackward={handleSkipBackward}
          onPress={() => {
            if (currentSurah) {
              navigation.navigate('SurahPlayer', { surah: currentSurah });
            }
          }}
        />

        {/* Surah List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>فهرس السور</Text>
          <FlatList
            data={filteredSurahs}
            renderItem={renderSurahCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#e94560']}
                tintColor="#e94560"
              />
            }
          />
        </View>
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
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  placeholder: {
    width: 40,
  },
  downloadedIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 2,
  },

  menuButton: {
    fontSize: 20,
    color: '#e94560',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'right',
  },
  searchIcon: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 10,
  },
  downloadAllContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginBottom: 10,
  },
  downloadAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: 'nowrap',
  },

  buttonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    width: 160,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: '#e94560',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },


  
  currentPlayingContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  currentPlayingCard: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
  },
  playingHeader: {
    marginBottom: 12,
  },
  currentPlayingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  currentPlayingSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    marginBottom: 10,
  },
  audioProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 2,
    width: '60%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: '#e94560',
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  readingModeContainer: {
    marginBottom: 10,
  },
  readingModeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingModeLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  currentModeIndicator: {
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.5)',
  },
  currentModeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  readingModeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  readingModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  readingModeActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  readingModeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  readingModeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 30,
  },
  wave: {
    width: 3,
    backgroundColor: '#e94560',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  downloadContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    width: 300,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  downloadProgressBar: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 4,
  },
  progressText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '700',
  },
  downloadingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  downloadingText: {
    fontSize: 16,
    color: '#ffc107',
  },


  surahCard: {
    marginBottom: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  playingCard: {
    borderWidth: 2,
    borderColor: '#e94560',
  },
  cardGradient: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
  },
  playingCardGradient: {
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 15,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    flexDirection: 'row',
    gap: 8,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingBadge: {
    backgroundColor: '#e94560',
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playingNumberText: {
    color: '#ffffff',
  },
  surahInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    textAlign: 'center',
  },
  surahNameSimple: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  playingText: {
    color: '#ffffff',
  },
  typeTag: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  playingTag: {
    backgroundColor: '#e94560',
  },
  typeText: {
    fontSize: 12,
    color: '#e94560',
    fontWeight: '500',
  },
  playingTagText: {
    color: '#ffffff',
  },
  versesText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    textAlign: 'right',
  },
  durationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 100,
  },
  downloadIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  cancelDownloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  progressIndicator: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#e94560',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelAllButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bulkProgressIndicator: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  bulkProgressText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  currentSurahText: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },


});

export default QuranListScreen;
