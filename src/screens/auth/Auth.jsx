import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Auth.Style';
import { Colors } from '../../constants';
import { useAuth } from '../../hooks';
import { AppImage } from '../../lib';

const Auth = ({ navigation }) => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert('Google Sign-In Error', err.message || 'Could not sign in with Google');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.content}>
        {/* Top Section: Logo & Tagline */}
        <View style={styles.topSection}>
          <AppImage
            source={require('../../assets/images/tinder_logo_white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.taglineContainer}>
            <Text style={styles.taglineText}>
              <Text style={styles.boldText}>It starts</Text>
              <Text style={styles.regularText}> with</Text>
              {'\n'}
              <Text style={styles.regularText}>a </Text>
              <Text style={styles.boldText}>Swipe™</Text>
            </Text>
          </View>
        </View>

        {/* Bottom Section: Legal text & Action Buttons */}
        <View style={styles.bottomSection}>
          <Text style={styles.termsText}>
            By tapping “Create account” or “Log in”, you agree to our{' '}
            <Text style={styles.linkText}>Terms</Text>. Learn how we process
            your data in our <Text style={styles.linkText}>Privacy Policy</Text>{' '}
            and <Text style={styles.linkText}>Cookies Policy</Text>.
          </Text>

          {/* Continue with Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.85}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <>
                <AppImage
                  source={require('../../assets/images/google_logo.png')}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.createAccountButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.createAccountButtonText}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.troubleButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Help', 'Contact support at support@tinder.com')}
          >
            <Text style={styles.troubleButtonText}>Trouble signing in?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
