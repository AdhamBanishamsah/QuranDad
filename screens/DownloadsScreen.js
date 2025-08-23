import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { Ionicons } from '@expo/vector-icons';
import {
  getDownloadedSurahs,
  deleteSurah,
  deleteAllSurahs,
  getDownloadedSize,
} from '../utils/fileSystem';

const DownloadsScreen = ({ navigation }) => {
  const [downloadedSurahs, setDownloadedSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState('0 MB');

  useEffect(() => {
    loadDownloadedSurahs();
  }, []);

  // Refresh downloads when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDownloadedSurahs();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDownloadedSurahs = async () => {
    try {
      setLoading(true);
      const downloadedSurahIds = await getDownloadedSurahs();
      const size = await getDownloadedSize();
      
      // Create full surah objects with names and details
      const fullSurahData = [
        { id: 1, arabicName: 'سورة الفاتحة', arabicNameSimple: 'الفاتحة', verses: 7, duration: '0:05:30', arabicType: 'مكية' },
        { id: 2, arabicName: 'سورة البقرة', arabicNameSimple: 'البقرة', verses: 286, duration: '2:30:15', arabicType: 'مدنية' },
        { id: 3, arabicName: 'سورة آل عمران', arabicNameSimple: 'آل عمران', verses: 200, duration: '1:45:20', arabicType: 'مدنية' },
        { id: 4, arabicName: 'سورة النساء', arabicNameSimple: 'النساء', verses: 176, duration: '1:35:45', arabicType: 'مدنية' },
        { id: 5, arabicName: 'سورة المائدة', arabicNameSimple: 'المائدة', verses: 120, duration: '1:15:30', arabicType: 'مدنية' },
        { id: 6, arabicName: 'سورة الأنعام', arabicNameSimple: 'الأنعام', verses: 165, duration: '1:25:15', arabicType: 'مكية' },
        { id: 7, arabicName: 'سورة الأعراف', arabicNameSimple: 'الأعراف', verses: 206, duration: '1:40:20', arabicType: 'مكية' },
        { id: 8, arabicName: 'سورة الأنفال', arabicNameSimple: 'الأنفال', verses: 75, duration: '0:45:30', arabicType: 'مدنية' },
        { id: 9, arabicName: 'سورة التوبة', arabicNameSimple: 'التوبة', verses: 129, duration: '1:10:45', arabicType: 'مدنية' },
        { id: 10, arabicName: 'سورة يونس', arabicNameSimple: 'يونس', verses: 109, duration: '0:55:20', arabicType: 'مكية' },
        { id: 11, arabicName: 'سورة هود', arabicNameSimple: 'هود', verses: 123, duration: '1:00:15', arabicType: 'مكية' },
        { id: 12, arabicName: 'سورة يوسف', arabicNameSimple: 'يوسف', verses: 111, duration: '0:58:30', arabicType: 'مكية' },
        { id: 13, arabicName: 'سورة الرعد', arabicNameSimple: 'الرعد', verses: 43, duration: '0:25:45', arabicType: 'مدنية' },
        { id: 14, arabicName: 'سورة إبراهيم', arabicNameSimple: 'إبراهيم', verses: 52, duration: '0:30:20', arabicType: 'مكية' },
        { id: 15, arabicName: 'سورة الحجر', arabicNameSimple: 'الحجر', verses: 99, duration: '0:45:15', arabicType: 'مكية' },
        { id: 16, arabicName: 'سورة النحل', arabicNameSimple: 'النحل', verses: 128, duration: '1:05:30', arabicType: 'مكية' },
        { id: 17, arabicName: 'سورة الإسراء', arabicNameSimple: 'الإسراء', verses: 111, duration: '0:55:45', arabicType: 'مكية' },
        { id: 18, arabicName: 'سورة الكهف', arabicNameSimple: 'الكهف', verses: 110, duration: '0:58:20', arabicType: 'مكية' },
        { id: 19, arabicName: 'سورة مريم', arabicNameSimple: 'مريم', verses: 98, duration: '0:50:15', arabicType: 'مكية' },
        { id: 20, arabicName: 'سورة طه', arabicNameSimple: 'طه', verses: 135, duration: '1:05:45', arabicType: 'مكية' },
        { id: 21, arabicName: 'سورة الأنبياء', arabicNameSimple: 'الأنبياء', verses: 112, duration: '0:55:30', arabicType: 'مكية' },
        { id: 22, arabicName: 'سورة الحج', arabicNameSimple: 'الحج', verses: 78, duration: '0:40:20', arabicType: 'مدنية' },
        { id: 23, arabicName: 'سورة المؤمنون', arabicNameSimple: 'المؤمنون', verses: 118, duration: '0:58:45', arabicType: 'مكية' },
        { id: 24, arabicName: 'سورة النور', arabicNameSimple: 'النور', verses: 64, duration: '0:35:30', arabicType: 'مدنية' },
        { id: 25, arabicName: 'سورة الفرقان', arabicNameSimple: 'الفرقان', verses: 77, duration: '0:40:15', arabicType: 'مكية' },
        { id: 26, arabicName: 'سورة الشعراء', arabicNameSimple: 'الشعراء', verses: 227, duration: '1:50:30', arabicType: 'مكية' },
        { id: 27, arabicName: 'سورة النمل', arabicNameSimple: 'النمل', verses: 93, duration: '0:45:20', arabicType: 'مكية' },
        { id: 28, arabicName: 'سورة القصص', arabicNameSimple: 'القصص', verses: 88, duration: '0:45:45', arabicType: 'مكية' },
        { id: 29, arabicName: 'سورة العنكبوت', arabicNameSimple: 'العنكبوت', verses: 69, duration: '0:35:15', arabicType: 'مكية' },
        { id: 30, arabicName: 'سورة الروم', arabicNameSimple: 'الروم', verses: 60, duration: '0:30:30', arabicType: 'مكية' },
        { id: 31, arabicName: 'سورة لقمان', arabicNameSimple: 'لقمان', verses: 34, duration: '0:20:15', arabicType: 'مكية' },
        { id: 32, arabicName: 'سورة السجدة', arabicNameSimple: 'السجدة', verses: 30, duration: '0:18:45', arabicType: 'مكية' },
        { id: 33, arabicName: 'سورة الأحزاب', arabicNameSimple: 'الأحزاب', verses: 73, duration: '0:40:30', arabicType: 'مدنية' },
        { id: 34, arabicName: 'سورة سبأ', arabicNameSimple: 'سبأ', verses: 54, duration: '0:30:45', arabicType: 'مكية' },
        { id: 35, arabicName: 'سورة فاطر', arabicNameSimple: 'فاطر', verses: 45, duration: '0:25:20', arabicType: 'مكية' },
        { id: 36, arabicName: 'سورة يس', arabicNameSimple: 'يس', verses: 83, duration: '0:40:15', arabicType: 'مكية' },
        { id: 37, arabicName: 'سورة الصافات', arabicNameSimple: 'الصافات', verses: 182, duration: '1:25:30', arabicType: 'مكية' },
        { id: 38, arabicName: 'سورة ص', arabicNameSimple: 'ص', verses: 88, duration: '0:45:20', arabicType: 'مكية' },
        { id: 39, arabicName: 'سورة الزمر', arabicNameSimple: 'الزمر', verses: 75, duration: '0:40:45', arabicType: 'مكية' },
        { id: 40, arabicName: 'سورة غافر', arabicNameSimple: 'غافر', verses: 85, duration: '0:45:30', arabicType: 'مكية' },
        { id: 41, arabicName: 'سورة فصلت', arabicNameSimple: 'فصلت', verses: 54, duration: '0:30:15', arabicType: 'مكية' },
        { id: 42, arabicName: 'سورة الشورى', arabicNameSimple: 'الشورى', verses: 53, duration: '0:30:30', arabicType: 'مكية' },
        { id: 43, arabicName: 'سورة الزخرف', arabicNameSimple: 'الزخرف', verses: 89, duration: '0:45:45', arabicType: 'مكية' },
        { id: 44, arabicName: 'سورة الدخان', arabicNameSimple: 'الدخان', verses: 59, duration: '0:30:20', arabicType: 'مكية' },
        { id: 45, arabicName: 'سورة الجاثية', arabicNameSimple: 'الجاثية', verses: 37, duration: '0:20:15', arabicType: 'مكية' },
        { id: 46, arabicName: 'سورة الأحقاف', arabicNameSimple: 'الأحقاف', verses: 35, duration: '0:20:30', arabicType: 'مكية' },
        { id: 47, arabicName: 'سورة محمد', arabicNameSimple: 'محمد', verses: 38, duration: '0:20:45', arabicType: 'مدنية' },
        { id: 48, arabicName: 'سورة الفتح', arabicNameSimple: 'الفتح', verses: 29, duration: '0:18:30', arabicType: 'مدنية' },
        { id: 49, arabicName: 'سورة الحجرات', arabicNameSimple: 'الحجرات', verses: 18, duration: '0:12:15', arabicType: 'مدنية' },
        { id: 50, arabicName: 'سورة ق', arabicNameSimple: 'ق', verses: 45, duration: '0:25:20', arabicType: 'مكية' },
        { id: 51, arabicName: 'سورة الذاريات', arabicNameSimple: 'الذاريات', verses: 60, duration: '0:30:45', arabicType: 'مكية' },
        { id: 52, arabicName: 'سورة الطور', arabicNameSimple: 'الطور', verses: 49, duration: '0:25:30', arabicType: 'مكية' },
        { id: 53, arabicName: 'سورة النجم', arabicNameSimple: 'النجم', verses: 62, duration: '0:30:15', arabicType: 'مكية' },
        { id: 54, arabicName: 'سورة القمر', arabicNameSimple: 'القمر', verses: 55, duration: '0:28:45', arabicType: 'مكية' },
        { id: 55, arabicName: 'سورة الرحمن', arabicNameSimple: 'الرحمن', verses: 78, duration: '0:35:20', arabicType: 'مدنية' },
        { id: 56, arabicName: 'سورة الواقعة', arabicNameSimple: 'الواقعة', verses: 96, duration: '0:45:30', arabicType: 'مكية' },
        { id: 57, arabicName: 'سورة الحديد', arabicNameSimple: 'الحديد', verses: 29, duration: '0:18:45', arabicType: 'مدنية' },
        { id: 58, arabicName: 'سورة المجادلة', arabicNameSimple: 'المجادلة', verses: 22, duration: '0:15:30', arabicType: 'مدنية' },
        { id: 59, arabicName: 'سورة الحشر', arabicNameSimple: 'الحشر', verses: 24, duration: '0:16:15', arabicType: 'مدنية' },
        { id: 60, arabicName: 'سورة الممتحنة', arabicNameSimple: 'الممتحنة', verses: 13, duration: '0:10:45', arabicType: 'مدنية' },
        { id: 61, arabicName: 'سورة الصف', arabicNameSimple: 'الصف', verses: 14, duration: '0:10:30', arabicType: 'مدنية' },
        { id: 62, arabicName: 'سورة الجمعة', arabicNameSimple: 'الجمعة', verses: 11, duration: '0:08:15', arabicType: 'مدنية' },
        { id: 63, arabicName: 'سورة المنافقون', arabicNameSimple: 'المنافقون', verses: 11, duration: '0:08:30', arabicType: 'مدنية' },
        { id: 64, arabicName: 'سورة التغابن', arabicNameSimple: 'التغابن', verses: 18, duration: '0:12:20', arabicType: 'مدنية' },
        { id: 65, arabicName: 'سورة الطلاق', arabicNameSimple: 'الطلاق', verses: 12, duration: '0:09:15', arabicType: 'مدنية' },
        { id: 66, arabicName: 'سورة التحريم', arabicNameSimple: 'التحريم', verses: 12, duration: '0:09:30', arabicType: 'مدنية' },
        { id: 67, arabicName: 'سورة الملك', arabicNameSimple: 'الملك', verses: 30, duration: '0:18:45', arabicType: 'مكية' },
        { id: 68, arabicName: 'سورة القلم', arabicNameSimple: 'القلم', verses: 52, duration: '0:25:30', arabicType: 'مكية' },
        { id: 69, arabicName: 'سورة الحاقة', arabicNameSimple: 'الحاقة', verses: 52, duration: '0:25:45', arabicType: 'مكية' },
        { id: 70, arabicName: 'سورة المعارج', arabicNameSimple: 'المعارج', verses: 44, duration: '0:22:15', arabicType: 'مكية' },
        { id: 71, arabicName: 'سورة نوح', arabicNameSimple: 'نوح', verses: 28, duration: '0:15:30', arabicType: 'مكية' },
        { id: 72, arabicName: 'سورة الجن', arabicNameSimple: 'الجن', verses: 28, duration: '0:15:45', arabicType: 'مكية' },
        { id: 73, arabicName: 'سورة المزمل', arabicNameSimple: 'المزمل', verses: 20, duration: '0:12:30', arabicType: 'مكية' },
        { id: 74, arabicName: 'سورة المدثر', arabicNameSimple: 'المدثر', verses: 56, duration: '0:28:15', arabicType: 'مكية' },
        { id: 75, arabicName: 'سورة القيامة', arabicNameSimple: 'القيامة', verses: 40, duration: '0:20:45', arabicType: 'مكية' },
        { id: 76, arabicName: 'سورة الإنسان', arabicNameSimple: 'الإنسان', verses: 31, duration: '0:18:30', arabicType: 'مدنية' },
        { id: 77, arabicName: 'سورة المرسلات', arabicNameSimple: 'المرسلات', verses: 50, duration: '0:25:15', arabicType: 'مكية' },
        { id: 78, arabicName: 'سورة النبأ', arabicNameSimple: 'النبأ', verses: 40, duration: '0:20:30', arabicType: 'مكية' },
        { id: 79, arabicName: 'سورة النازعات', arabicNameSimple: 'النازعات', verses: 46, duration: '0:22:45', arabicType: 'مكية' },
        { id: 80, arabicName: 'سورة عبس', arabicNameSimple: 'عبس', verses: 42, duration: '0:20:15', arabicType: 'مكية' },
        { id: 81, arabicName: 'سورة التكوير', arabicNameSimple: 'التكوير', verses: 29, duration: '0:15:30', arabicType: 'مكية' },
        { id: 82, arabicName: 'سورة الانفطار', arabicNameSimple: 'الانفطار', verses: 19, duration: '0:12:45', arabicType: 'مكية' },
        { id: 83, arabicName: 'سورة المطففين', arabicNameSimple: 'المطففين', verses: 36, duration: '0:18:20', arabicType: 'مكية' },
        { id: 84, arabicName: 'سورة الانشقاق', arabicNameSimple: 'الانشقاق', verses: 25, duration: '0:13:30', arabicType: 'مكية' },
        { id: 85, arabicName: 'سورة البروج', arabicNameSimple: 'البروج', verses: 22, duration: '0:12:15', arabicType: 'مكية' },
        { id: 86, arabicName: 'سورة الطارق', arabicNameSimple: 'الطارق', verses: 17, duration: '0:10:45', arabicType: 'مكية' },
        { id: 87, arabicName: 'سورة الأعلى', arabicNameSimple: 'الأعلى', verses: 19, duration: '0:11:30', arabicType: 'مكية' },
        { id: 88, arabicName: 'سورة الغاشية', arabicNameSimple: 'الغاشية', verses: 26, duration: '0:14:15', arabicType: 'مكية' },
        { id: 89, arabicName: 'سورة الفجر', arabicNameSimple: 'الفجر', verses: 30, duration: '0:16:30', arabicType: 'مكية' },
        { id: 90, arabicName: 'سورة البلد', arabicNameSimple: 'البلد', verses: 20, duration: '0:12:45', arabicType: 'مكية' },
        { id: 91, arabicName: 'سورة الشمس', arabicNameSimple: 'الشمس', verses: 15, duration: '0:09:30', arabicType: 'مكية' },
        { id: 92, arabicName: 'سورة الليل', arabicNameSimple: 'الليل', verses: 21, duration: '0:13:15', arabicType: 'مكية' },
        { id: 93, arabicName: 'سورة الضحى', arabicNameSimple: 'الضحى', verses: 11, duration: '0:07:45', arabicType: 'مكية' },
        { id: 94, arabicName: 'سورة الشرح', arabicNameSimple: 'الشرح', verses: 8, duration: '0:06:30', arabicType: 'مكية' },
        { id: 95, arabicName: 'سورة التين', arabicNameSimple: 'التين', verses: 8, duration: '0:06:45', arabicType: 'مكية' },
        { id: 96, arabicName: 'سورة العلق', arabicNameSimple: 'العلق', verses: 19, duration: '0:12:30', arabicType: 'مكية' },
        { id: 97, arabicName: 'سورة القدر', arabicNameSimple: 'القدر', verses: 5, duration: '0:04:15', arabicType: 'مكية' },
        { id: 98, arabicName: 'سورة البينة', arabicNameSimple: 'البينة', verses: 8, duration: '0:06:45', arabicType: 'مدنية' },
        { id: 99, arabicName: 'سورة الزلزلة', arabicNameSimple: 'الزلزلة', verses: 8, duration: '0:06:30', arabicType: 'مدنية' },
        { id: 100, arabicName: 'سورة العاديات', arabicNameSimple: 'العاديات', verses: 11, duration: '0:07:15', arabicType: 'مكية' },
        { id: 101, arabicName: 'سورة القارعة', arabicNameSimple: 'القارعة', verses: 11, duration: '0:07:30', arabicType: 'مكية' },
        { id: 102, arabicName: 'سورة التكاثر', arabicNameSimple: 'التكاثر', verses: 8, duration: '0:05:45', arabicType: 'مكية' },
        { id: 103, arabicName: 'سورة العصر', arabicNameSimple: 'العصر', verses: 3, duration: '0:03:15', arabicType: 'مكية' },
        { id: 104, arabicName: 'سورة الهمزة', arabicNameSimple: 'الهمزة', verses: 9, duration: '0:06:00', arabicType: 'مكية' },
        { id: 105, arabicName: 'سورة الفيل', arabicNameSimple: 'الفيل', verses: 5, duration: '0:04:30', arabicType: 'مكية' },
        { id: 106, arabicName: 'سورة قريش', arabicNameSimple: 'قريش', verses: 4, duration: '0:03:45', arabicType: 'مكية' },
        { id: 107, arabicName: 'سورة الماعون', arabicNameSimple: 'الماعون', verses: 7, duration: '0:05:15', arabicType: 'مكية' },
        { id: 108, arabicName: 'سورة الكوثر', arabicNameSimple: 'الكوثر', verses: 3, duration: '0:03:00', arabicType: 'مكية' },
        { id: 109, arabicName: 'سورة الكافرون', arabicNameSimple: 'الكافرون', verses: 6, duration: '0:04:45', arabicType: 'مكية' },
        { id: 110, arabicName: 'سورة النصر', arabicNameSimple: 'النصر', verses: 3, duration: '0:03:15', arabicType: 'مدنية' },
        { id: 111, arabicName: 'سورة المسد', arabicNameSimple: 'المسد', verses: 5, duration: '0:04:00', arabicType: 'مكية' },
        { id: 112, arabicName: 'سورة الإخلاص', arabicNameSimple: 'الإخلاص', verses: 4, duration: '0:03:30', arabicType: 'مكية' },
        { id: 113, arabicName: 'سورة الفلق', arabicNameSimple: 'الفلق', verses: 5, duration: '0:04:15', arabicType: 'مكية' },
        { id: 114, arabicName: 'سورة الناس', arabicNameSimple: 'الناس', verses: 6, duration: '0:04:30', arabicType: 'مكية' },
      ];
      
      // Filter and sort downloaded surahs by ID
      const downloadedSurahsWithDetails = fullSurahData
        .filter(surah => downloadedSurahIds.some(downloaded => downloaded.id === surah.id))
        .sort((a, b) => a.id - b.id);
      
      console.log('📁 Downloaded surah IDs:', downloadedSurahIds.map(s => s.id));
      console.log('📋 Downloaded surahs with details:', downloadedSurahsWithDetails.length);
      
      setDownloadedSurahs(downloadedSurahsWithDetails);
      setTotalSize(size);
    } catch (error) {
      console.error('Error loading downloaded surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurah = async (surahId) => {
    try {
      await deleteSurah(surahId);
      await loadDownloadedSurahs(); // Reload the list
      Alert.alert('تم الحذف', 'تم حذف السورة بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء حذف السورة');
    }
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      'حذف جميع التحميلات',
      'هل أنت متأكد من حذف جميع السور المحملة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف الكل',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllSurahs();
              await loadDownloadedSurahs();
              Alert.alert('تم الحذف', 'تم حذف جميع السور المحملة');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف السور');
            }
          },
        },
      ]
    );
  };

  const renderSurahItem = ({ item }) => (
    <View style={styles.surahItem}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSurah(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
      </TouchableOpacity>
      
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.arabicName}</Text>
        <Text style={styles.surahNameSimple}>{item.arabicNameSimple}</Text>
        <Text style={styles.surahDetails}>
          {item.verses} آية • {item.duration} • {item.arabicType}
        </Text>
      </View>
      
      <Text style={styles.surahNumber}>{item.id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ImageBackground
          source={require('../assets/background.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

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
            style={styles.deleteAllButton}
            onPress={handleDeleteAll}
            disabled={downloadedSurahs.length === 0}
          >
            <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>التحميلات</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadDownloadedSurahs}
            >
              <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{downloadedSurahs.length}</Text>
            <Text style={styles.statLabel}>السور المحملة</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalSize}</Text>
            <Text style={styles.statLabel}>المساحة المستخدمة</Text>
          </View>
        </View>

        {/* Downloads List */}
        {downloadedSurahs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-download-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyTitle}>لا توجد تحميلات</Text>
            <Text style={styles.emptySubtitle}>
              السور التي تقوم بتحميلها ستظهر هنا
            </Text>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.goBackButtonText}>العودة إلى السور</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={downloadedSurahs}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    textAlign: 'center',
  },
  deleteAllButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  surahInfo: {
    flex: 1,
    alignItems: 'flex-end',
    textAlign: 'right',
    marginHorizontal: 15,
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    textAlign: 'right',
  },
  surahNameSimple: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textAlign: 'right',
  },
  surahDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  },
  surahActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e94560',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    textAlign: 'center',
    lineHeight: 35,
  },
  deleteButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  goBackButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  refreshButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default DownloadsScreen;