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

const PrivacyPolicyScreen = ({ navigation }) => {
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
            <Text style={styles.headerTitle}>سياسة الخصوصية</Text>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButton}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Introduction Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>مقدمة</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  مرحباً بك في تطبيق القرآن الكريم. نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. 
                  توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام تطبيقنا.
                </Text>
                
                <Text style={styles.policyText}>
                  تم تصميم تطبيق القرآن الكريم مع التركيز على خصوصية المستخدم وأمان البيانات. 
                  تنطبق هذه السياسة على جميع مستخدمي التطبيق.
                </Text>
              </View>
            </View>

            {/* Information We Collect Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>المعلومات التي نجمعها</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  نجمع الحد الأدنى من المعلومات لتقديم خدماتنا:
                </Text>
                
                <View style={styles.listContainer}>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>تخزين البيانات محلياً: تتبع التقدم والإعدادات تُخزن محلياً على جهازك</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>بيانات استخدام التطبيق: إحصائيات استخدام مجهولة المصدر لتحسين تجربة التطبيق</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>معلومات الجهاز: نوع الجهاز وإصدار التطبيق للتوافق</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* How We Use Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="settings-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>كيفية استخدام معلوماتك</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  نستخدم المعلومات المجمعة للأغراض التالية:
                </Text>
                
                <View style={styles.listContainer}>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>تقديم ميزات التطبيق: لتقديم ميزات القرآن الكريم وتتبع التقدم</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>تحسين تجربة المستخدم: لتحسين الميزات وإصلاح المشاكل</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>تتبع التقدم: لمساعدتك في مراقبة رحلتك مع القرآن الكريم</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Data Security Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="lock-closed-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>أمان البيانات</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  نطبق إجراءات أمان مناسبة لحماية بياناتك. جميع المعلومات تُخزن محلياً على جهازك 
                  ولا تُشارك مع أطراف ثالثة دون موافقتك الصريحة.
                </Text>
              </View>
            </View>

            {/* Children's Privacy Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>خصوصية الأطفال</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  تطبيق القرآن الكريم مصمم للعائلات والأطفال. نحن ملتزمون بحماية خصوصية الأطفال 
                  ولا نجمع معلومات شخصية من الأطفال دون سن 13 عاماً دون موافقة الوالدين.
                </Text>
              </View>
            </View>

            {/* Third-Party Services Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>خدمات الأطراف الثالثة</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  قد نستخدم خدمات أطراف ثالثة للتحليلات وتحسين التطبيق. جميع خدمات الأطراف الثالثة 
                  يتم اختيارها بعناية وتتوافق مع معايير الخصوصية لدينا.
                </Text>
              </View>
            </View>

            {/* Your Rights Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-outline" size={24} color="#e94560" />
                <Text style={styles.sectionTitle}>حقوقك</Text>
              </View>
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  لديك الحقوق التالية فيما يتعلق ببياناتك:
                </Text>
                
                <View style={styles.listContainer}>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>الوصول لبياناتك: طلب نسخة من بياناتك الشخصية</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>حذف بياناتك: طلب حذف بياناتك في أي وقت</Text>
                  </View>
                  <View style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.listText}>التواصل معنا: التواصل معنا لأي استفسارات حول الخصوصية</Text>
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
              
              <View style={styles.policyCard}>
                <Text style={styles.policyText}>
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا في التعامل مع البيانات، 
                  يرجى التواصل معنا:
                </Text>
                
                <View style={styles.contactContainer}>
                  <View style={styles.contactItem}>
                    <Ionicons name="globe-outline" size={20} color="#e94560" />
                    <Text style={styles.contactText}>الموقع الإلكتروني: quran.adham-tech.com</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="mail-outline" size={20} color="#e94560" />
                    <Text style={styles.contactText}>البريد الإلكتروني: info@adham-tech.com</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                آخر تحديث: 17 أغسطس 2024
              </Text>
              <Text style={styles.footerText}>
                © 2024 القرآن الكريم. جميع الحقوق محفوظة.
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
  policyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  policyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 15,
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 10,
    flex: 1,
    lineHeight: 20,
    textAlign: 'right',
    
  },
  contactContainer: {
    marginTop: 15,
  },
  contactItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 10,
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

export default PrivacyPolicyScreen;
