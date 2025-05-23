import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import * as ImagePicker from 'expo-image-picker';

/**
 * WYSIWYG Fallstudien-Erstellungsscreen
 * Erlaubt die direkte Bearbeitung einer Fallstudie mit Echtzeit-Vorschau
 */
export default function CreateCasestudyListScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Fallstudien-Daten
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  // Ist die Fallstudie vollständig genug, um erstellt zu werden?
  const canCreateCasestudy = title.trim() !== '' && (description.trim() !== '' || isEditingDescription);
  
  // Bild auswählen
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Berechtigung erforderlich', 'Bitte erlaube den Zugriff auf deine Fotos, um ein Bild auszuwählen.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Für das Demo verwenden wir die lokale URI direkt
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Fehler beim Auswählen des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht ausgewählt werden.');
    }
  };
  
  // Fallstudie erstellen (bzw. zur nächsten Seite navigieren)
  const createCasestudy = () => {
    // Hier später die tatsächliche Fallstudie-Erstellung implementieren
    const casestudyData = {
      title,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    };
    
    // Navigiere zum nächsten Schritt mit den eingegebenen Daten
    router.push({
      pathname: '/casestudies/create/createCasestudyDetails',
      params: {
        title,
        description
      }
    });
  };

  // Weiter-Button für HeaderNavigation
  const renderWeiterButton = () => (
    <TouchableOpacity 
      onPress={createCasestudy}
      disabled={!canCreateCasestudy}
    >
      <Text 
        style={[
          styles.createButtonText, 
          { color: canCreateCasestudy ? colors.primary : colors.textSecondary }
        ]}
      >
        Weiter
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.containerOuter, { backgroundColor: colors.backgroundPrimary }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderNavigation 
            title="Neue Fallstudie" 
            rightContent={renderWeiterButton()}
            onBackPress={() => router.push('/(tabs)/profile')}
            containerStyle={styles.headerNavigationContainer}
          />
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {/* Editierbare Fallstudienkarte */}
              <View style={[styles.casestudyCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.cardContent}>
                  {/* Bild im 4:3 Format */}
                  <TouchableOpacity 
                    style={styles.imageContainer}
                    onPress={pickImage}
                  >
                    {imageUrl ? (
                      <Image 
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.imagePlaceholder, { backgroundColor: colors.backgroundTertiary }]}>
                        <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
                        <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
                          Bild hinzufügen
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  {/* Text-Content */}
                  <View style={styles.textContainer}>
                    {/* Editierbare Überschrift */}
                    <TextInput
                      style={[styles.titleInput, { color: colors.textPrimary }]}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="Titel der Fallstudie"
                      placeholderTextColor={colors.textTertiary}
                      maxLength={50}
                    />
                    
                    {/* Editierbare Beschreibung oder Anzeige */}
                    {isEditingDescription ? (
                      <TextInput
                        style={[styles.descriptionInput, { color: colors.textSecondary }]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Beschreibung der Fallstudie"
                        placeholderTextColor={colors.textTertiary}
                        multiline
                        numberOfLines={3}
                        maxLength={200}
                        onBlur={() => setIsEditingDescription(false)}
                        autoFocus
                      />
                    ) : (
                      <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                        <Text 
                          style={[
                            styles.description, 
                            { color: description ? colors.textSecondary : colors.textTertiary }
                          ]}
                          numberOfLines={3}
                        >
                          {description || "Tippe hier, um eine Beschreibung hinzuzufügen"}
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {/* Fußzeile mit Bewertung */}
                    <View style={styles.footer}>
                      <View style={{ flex: 1 }} />
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD600" style={{ marginRight: 2 }} />
                        <Text style={[styles.rating, { color: colors.textSecondary }]}>
                          5.0
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Hilfe-Text */}
              <View style={styles.helpTextContainer}>
                <Text style={[styles.helpText, { color: colors.textTertiary }]}>
                  Tippe auf die einzelnen Elemente, um sie zu bearbeiten. Auf dem nächsten Screen kannst du weitere Details hinzufügen.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 47 : 0, // Höhe der iOS-Statusbar
  },
  headerContainer: {
    zIndex: 10,
    elevation: 10,
  },
  headerNavigationContainer: {
    paddingTop: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  helpTextContainer: {
    marginTop: spacing.m,
    padding: spacing.m,
    borderRadius: ui.borderRadius.m,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  helpText: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    textAlign: 'center',
  },
  // Fallstudien-Karte Styles
  casestudyCard: {
    borderRadius: ui.borderRadius.m,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    maxHeight: 130,
    minHeight: 130,
    marginBottom: spacing.m,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -4 }],
  },
  cardContent: {
    flexDirection: 'row',
    paddingRight: spacing.m,
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: '100%',
    borderTopLeftRadius: ui.borderRadius.m,
    borderBottomLeftRadius: ui.borderRadius.m,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    marginRight: spacing.m,
    backgroundColor: '#eee',
    marginLeft: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    marginLeft: spacing.s,
    paddingRight: spacing.s,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
  },
  titleInput: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    padding: 0,
  },
  description: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.s,
  },
  descriptionInput: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    marginBottom: spacing.s,
    padding: 0,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: ui.borderRadius.s,
  },
  rating: {
    fontSize: typography.fontSize.s,
    marginLeft: spacing.xxs,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 