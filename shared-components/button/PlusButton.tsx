import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  StyleProp,
  View
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { ui } from '@/config/theme/ui';
import { useMode } from '@/features/mode/hooks/useMode';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PlusButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

/**
 * Schwebender Plus-Button für das Hochladen von Inhalten
 * Nur im Live-Mode sichtbar
 * @param onPress.onPress
 * @param onPress - Callback-Funktion für den Button-Press
 * @param style - Zusätzliche Styles für den Button
 * @param size - Größe des Buttons (optional)
 * @param onPress.style
 * @param onPress.size
 */
export function PlusButton({ 
  onPress, 
  style, 
  size = 56
}: PlusButtonProps) {
  const colors = useThemeColor();
  const { isDemoMode } = useMode();
  
  // Wenn wir im Demo-Modus sind, zeigen wir den Button nicht an
  if (isDemoMode()) {
    return null;
  }
  
  // Verwende dunklere Pastellfarben für mehr Kontrast
  const backgroundColor = `${colors.primary}30`; // 30% Opazität für dunkleren Pastell-Look
  const borderColor = `${colors.primary}60`;    // 60% Opazität für dunkleren Rand
  
  // Dynamische Styles basierend auf der Größe
  const buttonStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5, // Dickerer Rand für bessere Sichtbarkeit
    borderColor: borderColor,
    backgroundColor: backgroundColor,
    // Verstärkter Schatten für besseren schwebenden Effekt
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    elevation: 6,
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Neuen Inhalt hinzufügen"
        accessibilityRole="button"
      >
        <Ionicons 
          name="add" 
          size={size * 0.5} 
          color={colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.m,
    alignSelf: 'center',
    bottom: 15, // Direkt über der BottomTabbar mit minimalem Abstand
    zIndex: 1000, // Hoher z-Index, damit der Button über allen anderen Elementen liegt
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 