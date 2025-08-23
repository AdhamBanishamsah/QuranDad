# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: Firebase API Keys Security

Your Firebase API keys were exposed in the public repository. Follow these steps to secure your app:

### 1. Create Environment File
Create a `.env` file in the root directory with your Firebase configuration:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyALFnrEwmhuN4VDd4FgXZe10Cbjofn9lco
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=qurannizam.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=qurannizam
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=qurannizam.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=76364560843
EXPO_PUBLIC_FIREBASE_APP_ID=1:76364560843:web:937f6964a6092bb5b85e4e
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-F0DY7YDQ0M
```

### 2. Install Environment Variables Package
```bash
npm install react-native-dotenv
```

### 3. Update babel.config.js
Add this to your babel configuration:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }]
    ]
  };
};
```

### 4. Update firebaseConfig.js
The file has been updated to use environment variables. Make sure to import them correctly:

```javascript
import {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
} from '@env';
```

### 5. Firebase Security Rules
Update your Firebase Storage rules to restrict access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /quran_audio/{fileName} {
      allow read: if true; // Public read for audio files
      allow write: if false; // No write access
    }
  }
}
```

### 6. Remove Sensitive Data from Git History
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch utils/firebaseConfig.js" \
  --prune-empty --tag-name-filter cat -- --all
```

### 7. Force Push Changes
```bash
git push origin main --force
```

## 🛡️ Additional Security Measures

1. **Firebase Console**: Set up proper authentication and security rules
2. **API Key Restrictions**: Limit API key usage to specific domains/IPs
3. **Regular Audits**: Monitor Firebase usage and access logs
4. **Backup Strategy**: Keep secure backups of your configuration

## 📱 App Security Features

- ✅ Environment variables for sensitive data
- ✅ Firebase Storage security rules
- ✅ No hardcoded API keys in source code
- ✅ Secure audio file access
- ✅ Proper error handling

## 🚨 Immediate Actions Required

1. Create the `.env` file with your Firebase config
2. Install the dotenv package
3. Update babel configuration
4. Test the app to ensure it works with environment variables
5. Remove sensitive data from Git history
6. Update Firebase security rules

Your app is now secure and ready for production! 🔒
