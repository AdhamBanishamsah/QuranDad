import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

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
          <Text style={styles.headerTitle}>الإعدادات</Text>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backButton}>→</Text>
          </TouchableOpacity>
        </View>

          {/* Settings Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* About App Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>حول التطبيق</Text>
              </View>
              
              <View style={styles.aboutCard}>
                <Text style={styles.appName}>القرآن الكريم</Text>
                <Text style={styles.appVersion}>الإصدار 1.0.0</Text>
                
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>
                    تطبيق القرآن الكريم هو تطبيق حديث ومتطور يوفر لك تجربة استماع وقراءة مميزة للقرآن الكريم.
                  </Text>
                  
                  <Text style={styles.descriptionText}>
                    يمكنك الاستماع إلى جميع السور الـ 114 مع إمكانية التحميل للاستماع دون اتصال بالإنترنت.
                  </Text>
                  
                  <Text style={styles.descriptionText}>
                    التطبيق مصمم ليكون سهل الاستخدام مع واجهة جميلة ومريحة للعين.
                  </Text>
                </View>

                <View style={styles.readerInfoContainer}>
                  <Text style={styles.readerTitle}>القارئ:</Text>
                  <Text style={styles.readerName}>نظام بني شمسة</Text>
                  <Text style={styles.readerNote}>
                    القارئ ليس مجازًا في قراءة القرآن، وقد تقع بعض الأخطاء غير المقصودة. نسأل الله أن يتقبل هذا العمل صدقة جارية.
                  </Text>
                </View>

                <View style={styles.linksContainer}>
                  <TouchableOpacity 
                    style={styles.linkItem}
                    onPress={() => navigation.navigate('AboutDeveloper')}
                  >
                    <Ionicons name="person-circle-outline" size={20} color="#e94560" />
                    <Text style={styles.linkText}>حول المطور</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.linkItem}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                  >
                    <Ionicons name="shield-checkmark-outline" size={20} color="#e94560" />
                    <Text style={styles.linkText}>سياسة الخصوصية</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>المميزات:</Text>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>جميع السور الـ 114</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>إمكانية التحميل للاستماع دون اتصال</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>واجهة مستخدم حديثة وجميلة</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>البحث في السور</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>معلومات تفصيلية عن كل سورة</Text>
                  </View>
                </View>
              </View>
            </View>

     
          </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 90 : 70,
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
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
  },
  aboutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 10,
  },
  readerInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
    marginBottom: 20,
  },
  readerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'right',
    marginBottom: 5,
  },
  readerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
    marginBottom: 10,
  },
  readerNote: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  linksContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
  },
  linkText: {
    fontSize: 14,
    color: '#e94560',
    marginRight: 10,
    fontWeight: '600',
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'right',
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 10,
    textAlign: 'right',
  },
  developerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  developerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 10,
  },
});

export default SettingsScreen;
