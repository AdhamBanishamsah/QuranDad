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

const AboutDeveloperScreen = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePrivacyPress = () => {
    navigation.navigate('PrivacyPolicy');
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
            <Text style={styles.headerTitle}>حول المطور</Text>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButton}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Developer Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>المطور</Text>
              </View>
              
                              <View style={styles.developerCard}>
                  <Text style={styles.developerName}>أدهم بني شمسة</Text>
                </View>
            </View>

            {/* App Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>معلومات التطبيق</Text>
              </View>
              
              <View style={styles.appCard}>
                <Text style={styles.appName}>القرآن الكريم</Text>
                <Text style={styles.appVersion}>الإصدار 1.0.0</Text>
                
                <View style={styles.appFeaturesContainer}>
                  <Text style={styles.appFeaturesTitle}>مميزات التطبيق:</Text>
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
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>أوضاع القراءة المختلفة</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>التشغيل في الخلفية</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="mail-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>تواصل معنا</Text>
              </View>
              
              <View style={styles.contactCard}>
                <View style={styles.contactItem}>
                  <Ionicons name="globe-outline" size={20} color="#e94560" />
                  <Text style={styles.contactText}>الموقع الإلكتروني: quran.adham-tech.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color="#e94560" />
                  <Text style={styles.contactText}>البريد الإلكتروني: info@adham-tech.com</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="document-text-outline" size={20} color="#e94560" />
                  <TouchableOpacity onPress={handlePrivacyPress}>
                    <Text style={styles.privacyLink}>سياسة الخصوصية</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2025 القرآن الكريم. جميع الحقوق محفوظة.
              </Text>
              <Text style={styles.footerText}>
                تم التطوير بواسطة أدهم بني شمسة
              </Text>
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
    paddingBottom: Platform.OS === 'android' ? 120 : 90,
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
  developerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 5,
  },
  developerTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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
  skillsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'right',
    marginBottom: 10,
  },
  skillItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 10,
  },
  appCard: {
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
  appFeaturesContainer: {
    marginBottom: 20,
  },
  appFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'right',
    marginBottom: 10,
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
  },
  contactCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 10,
  },
  privacyLink: {
    fontSize: 14,
    color: '#e94560',
    marginRight: 10,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default AboutDeveloperScreen;
