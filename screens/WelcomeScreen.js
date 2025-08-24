import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Start glow animation after a delay
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 1500);

    // Start spinning animation for loading spinner
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleGetStarted = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>القرآن الكريم</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Reader Image */}
          <View style={styles.imageContainer}>
            <Animated.View
              style={[
                styles.imageWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={require('../assets/images/ReaderImage.png')}
                style={styles.readerImage}
                resizeMode="contain"
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <View style={styles.loadingContainer}>
                  <Animated.View
                    style={[
                      styles.loadingSpinner,
                      {
                        transform: [
                          {
                            rotate: spinAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              )}
            </Animated.View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.readerName}>
              نظام بني شمسة
            </Text>
            <Text style={styles.descriptionTitle}>
              استمع واقرأ بسكينة وطمأنينة
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonTextArabic}>ابدأ الآن</Text>
            </View>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageWrapper: {
    position: 'relative',
  },
  readerImage: {
    width: 250,
    height: 250,
    borderRadius: 25,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 25,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    borderTopColor: '#e94560',
    backgroundColor: 'transparent',
  },

  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  readerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },

  footer: {
    paddingBottom: 80,
    paddingHorizontal: 40,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: '#e94560',
    borderRadius: 15,
  },

  buttonTextArabic: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default WelcomeScreen;
