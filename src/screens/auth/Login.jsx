import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,         
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { styles } from './Login.Style';
import { Colors } from '../../constants';
import { useAuth } from '../../hooks';
import { AppIcon, AppImage } from '../../lib';
import { sendPasswordReset } from '../../services/firebase';

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login, signInWithGoogle, loading } = useAuth();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    Keyboard.dismiss();
    try {
      await login(data.email, data.password);
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert('Google Sign-In Error', err.message || 'Could not sign in with Google');
    }
  };

  const handleForgotPassword = async () => {
    const currentEmail = getValues('email')?.trim();
    if (!currentEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your email address in the email field above, then tap "Forgot password?" to receive a reset link.'
      );
      return;
    }

    try {
      await sendPasswordReset(currentEmail);
      Alert.alert(
        'Reset Email Sent',
        `A password reset link has been sent to ${currentEmail}. Check your inbox and follow the link to reset your password.`
      );
    } catch (err) {
      Alert.alert('Reset Failed', err.message || 'Could not send password reset email.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => navigation?.goBack()}
              >
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue connecting with people near you.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'email' && styles.inputContainerFocused,
                        errors.email && styles.inputContainerError,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="name@example.com"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        onBlur={() => {
                          onBlur();
                          setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('email')}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'password' && styles.inputContainerFocused,
                        errors.password && styles.inputContainerError,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={Colors.textMuted}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={value}
                        onBlur={() => {
                          onBlur();
                          setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('password')}
                        onChangeText={onChange}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        activeOpacity={0.7}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <AppIcon
                          name={showPassword ? 'eye-slash' : 'eye'}
                          size={18}
                          color={Colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                activeOpacity={0.7}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.85}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <AppImage
                source={require('../../assets/images/google_logo.png')}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate('Signup')}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
