# App Store Publishing Guide for Quran App

## Prerequisites

1. **Apple Developer Account** ($99/year)
2. **App Store Connect Access**
3. **Xcode** (for local builds) or **EAS Build** (cloud builds)
4. **App Store Connect App ID** (from the form you're filling)

## Step 1: Complete App Store Connect Form

### Current Form Status:
- ✅ **Platforms**: iOS selected
- ✅ **Name**: "القرآن بصوت نظام بني شمسة"
- ✅ **Primary Language**: Arabic
- ✅ **Bundle ID**: "com.adhambanishamsah.qurannizam"
- ❌ **SKU**: Enter a unique identifier (e.g., `quran-nizam-2024`)
- ✅ **User Access**: Full Access

**Action**: Enter the SKU and click "Create"

## Step 2: Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

## Step 3: Login to Expo

```bash
eas login
```

## Step 4: Configure EAS Build

1. **Initialize EAS** (if not already done):
   ```bash
   eas build:configure
   ```

2. **Update eas.json** with your actual values:
   - Replace `your-apple-id@email.com` with your Apple ID
   - Replace `your-app-store-connect-app-id` with the App ID from App Store Connect
   - Replace `your-apple-team-id` with your Apple Developer Team ID

## Step 5: Build for Production

### Option A: Cloud Build (Recommended)
```bash
eas build --platform ios --profile production
```

### Option B: Local Build
```bash
eas build --platform ios --profile production --local
```

## Step 6: Submit to App Store

```bash
eas submit --platform ios --profile production
```

## Step 7: App Store Connect Setup

### Required Information:

1. **App Information**:
   - **Name**: "القرآن بصوت نظام بني شمسة"
   - **Subtitle**: "Quran with Nizam Bani Shamsah's Voice"
   - **Description**: 
     ```
     Experience the Holy Quran with the beautiful voice of Nizam Bani Shamsah. 
     This comprehensive Quran app features:
     
     • Complete 114 surahs with high-quality audio
     • Background audio playback
     • Offline download capability
     • Multiple reading modes (once, repeat, continue)
     • Lock screen controls
     • Search functionality in Arabic and English
     • Beautiful dark theme design
     • Cross-platform support
     
     Perfect for daily Quran recitation and study.
     ```

2. **Keywords**: "quran, islam, muslim, prayer, recitation, arabic, audio, religious"

3. **Category**: 
   - Primary: "Education"
   - Secondary: "Music" or "Lifestyle"

4. **Content Rights**: Declare that you have rights to use the audio content

5. **Age Rating**: 
   - Select appropriate age rating (likely 4+ for religious content)

## Step 8: Screenshots & App Preview

### Required Screenshots:
- iPhone 6.7" Display (iPhone 14 Pro Max)
- iPhone 6.5" Display (iPhone 11 Pro Max)
- iPhone 5.5" Display (iPhone 8 Plus)
- iPad Pro 12.9" Display (2nd generation)
- iPad Pro 12.9" Display (1st generation)

### Screenshot Content:
1. Welcome screen
2. Surah list with search
3. Audio player interface
4. Downloads screen
5. Settings screen

## Step 9: App Review Information

### Contact Information:
- **First Name**: [Your Name]
- **Last Name**: [Your Last Name]
- **Phone Number**: [Your Phone]
- **Email**: [Your Email]

### Demo Account (if needed):
- Create a demo account for reviewers to test the app

### Notes for Review:
```
This is a Quran recitation app featuring audio from Nizam Bani Shamsah. 
The app provides:
- Complete Quran audio (114 surahs)
- Background audio playback
- Offline download capability
- Search functionality
- Multiple reading modes

All audio content is properly licensed and sourced from reliable Islamic sources.
```

## Step 10: Submit for Review

1. **Review all information**
2. **Test the build thoroughly**
3. **Submit for review**
4. **Wait for Apple's review** (typically 1-3 days)

## Common Issues & Solutions

### 1. Bundle ID Mismatch
- Ensure bundle ID in `app.json` matches App Store Connect
- Current: `com.adhambanishamsah.qurannizam`

### 2. Audio Background Modes
- Already configured in `app.json`
- Required for background audio playback

### 3. Privacy Policy
- Required for apps with user data
- Create a privacy policy page in your app

### 4. Content Rights
- Ensure you have rights to use the audio content
- Provide documentation if requested

## Post-Submission

### 1. Monitor Review Status
- Check App Store Connect daily
- Respond to any review feedback promptly

### 2. Prepare for Launch
- Set up app analytics
- Prepare marketing materials
- Plan launch strategy

### 3. Update Strategy
- Plan regular updates
- Monitor user feedback
- Maintain audio quality

## Important Notes

1. **Audio Content**: Ensure all Quran audio is properly licensed
2. **Religious Content**: Be respectful of Islamic traditions
3. **Localization**: Consider adding more languages
4. **Accessibility**: Ensure app is accessible to all users
5. **Performance**: Optimize for smooth audio playback

## Support Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Good luck with your app submission!** 🚀
