import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';

interface Wizard2Props {
  onOpenSidebar?: () => void;
}

export default function Wizard2({ onOpenSidebar }: Wizard2Props) {
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();
  const [answer, setAnswer] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (answer.trim()) {
      // Navigation zu Wizard3
      router.push('/wizard3');
    }
  };

  const isValid = answer.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title={t('wizard2.headerTitle')}
        onBackPress={handleBack}
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: keyboardHeight > 0 ? 60 : spacing.l }
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: colors.inputBorder }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '25%' }]} />
          </View>
        </View>

        {/* Question Section */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.textPrimary }]}>
            {t('wizard2.questionTitle')}
          </Text>
          <Text style={[styles.questionSubtitle, { color: colors.textSecondary }]}>
            {t('wizard2.questionSubtitle')}
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: answer.trim() ? colors.primary : colors.inputBorder,
                color: colors.textPrimary,
              }
            ]}
            placeholder={t('wizard2.placeholder')}
            placeholderTextColor={colors.textTertiary}
            value={answer}
            onChangeText={setAnswer}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            autoFocus={true}
          />
        </View>
      </ScrollView>

      {/* Keyboard Toolbar */}
      <View 
        style={[
          styles.keyboardToolbar,
          { 
            backgroundColor: colors.backgroundPrimary,
            bottom: keyboardHeight,
            borderTopColor: colors.inputBorder,
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isValid ? colors.primary : colors.inputBorder,
            }
          ]}
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.nextButtonText,
            {
              color: isValid ? 'white' : colors.textTertiary,
            }
          ]}>
            {t('wizard2.nextButtonText')}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={isValid ? 'white' : colors.textTertiary}
            style={styles.nextIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  progressContainer: {
    paddingBottom: spacing.l,
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionContainer: {
    paddingBottom: spacing.l,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    lineHeight: 32,
  },
  questionSubtitle: {
    fontSize: 14,
    lineHeight: 24,
  },
  inputContainer: {
    paddingBottom: spacing.xl,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  nextIcon: {
    marginLeft: spacing.xs,
  },
  keyboardToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderTopWidth: 1,
  },
}); 