import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  StatusBar,
  SectionList,
  ImageSourcePropType
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FloatingChatButton } from '@/shared-components/button';
import { navigateToAssistantChat } from '@/shared-components/navigation/ChatNavigation';

// Import avatar image
const solvboxAvatar = require('@/assets/small rounded Icon.png') as ImageSourcePropType;

// Mock data for fixed Solvbox chats
const FIXED_CHATS = [
  {
    id: '1',
    name: 'Olivia',
    avatar: solvboxAvatar,
    isBot: true,
    lastMessage: 'How can I help you today?',
    time: '14:30',
    unread: 1,
    isFixed: true,
  }
];

// Mock-Daten für reguläre Chat-Kontakte
const REGULAR_CHATS = [
  {
    id: '4',
    name: 'Thomas Müller',
    avatar: solvboxAvatar, 
    isBot: true,
    lastMessage: 'Here is the information about your tax return...',
    time: 'Oct 12',
    unread: 0,
    isFixed: false,
  },
  {
    id: '5',
    name: 'Laura Schmidt',
    avatar: solvboxAvatar,
    isBot: true, 
    lastMessage: 'I have analyzed your investment strategy.',
    time: 'Oct 5',
    unread: 2,
    isFixed: false,
  },
  {
    id: '6',
    name: 'Markus Weber',
    avatar: solvboxAvatar,
    isBot: true,
    lastMessage: 'Here are some tips for your next meeting...',
    time: 'Oct 2',
    unread: 0,
    isFixed: false,
  },
  {
    id: '7',
    name: 'Sophia Becker',
    avatar: solvboxAvatar,
    isBot: false,
    lastMessage: 'Thank you for your inquiry. We will...',
    time: 'Sep 24',
    unread: 0,
    isFixed: false,
  },
];

// Kombinierte Daten für Abschnitte
const CHAT_SECTIONS = [
  {
    title: 'Solvbox',
    data: FIXED_CHATS
  },
  {
    title: 'Other Chats',
    data: REGULAR_CHATS
  }
];

/**
 * Chat screen of the application
 */
export default function ChatsScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSections, setFilteredSections] = useState(CHAT_SECTIONS);

  // Filter contacts based on search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredSections(CHAT_SECTIONS);
    } else {
      const searchLower = text.toLowerCase();
      
      // Filter both chat groups
      const filteredSections = CHAT_SECTIONS.map(section => {
        const filteredData = section.data.filter(
          contact => contact.name.toLowerCase().includes(searchLower)
        );
        return {
          ...section,
          data: filteredData
        };
      }).filter(section => section.data.length > 0); // Remove empty sections
      
      setFilteredSections(filteredSections);
    }
  };

  // Navigate to individual chat
  const handleChatPress = (contact: (typeof FIXED_CHATS)[0]) => {
    console.log(`Opening chat with ${contact.name}`);
    
    // Navigate directly to OliviaChatScreen for Olivia
    if (contact.name === 'Olivia') {
      router.push('/chats/olivia');
      return;
    }
    
    // Navigate to regular ChatDetailScreen for all other chats
    router.push({
      pathname: `/chats/${contact.id}`,
      params: { name: contact.name }
    });
  };

  // Renders a chat contact
  const renderChatContact = ({ item }: { item: (typeof FIXED_CHATS)[0] }) => {
    const isOliviaChat = item.name === 'Olivia';
    
    return (
      <TouchableOpacity
        style={[styles.contactItem, { borderBottomColor: colors.divider }]}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.7}
      >
        {isOliviaChat && (
          <LinearGradient
            colors={['rgba(30, 107, 85, 0.2)', 'rgba(30, 107, 85, 0.05)', 'rgba(30, 107, 85, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.7, y: 0 }}
            style={styles.highlightGradient}
          />
        )}
        
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {item.isFixed && item.name === 'Olivia' ? (
            <View style={[styles.oliviaAvatarContainer, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons 
                name="semantic-web" 
                size={24} 
                color="white" 
              />
            </View>
          ) : item.isFixed ? (
            <Image source={item.avatar} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Ionicons 
                name="person-outline" 
                size={24} 
                color="white" 
              />
            </View>
          )}
        </View>
        
        {/* Contact info */}
        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <Text style={[
              styles.contactName, 
              { 
                color: colors.textPrimary,
                fontWeight: item.isFixed ? typography.fontWeight.bold : typography.fontWeight.semiBold,
              } as any
            ]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.timeText, { color: colors.textTertiary }]}>
              {item.time}
            </Text>
          </View>
          
          <View style={styles.contactSubheader}>
            <Text style={[styles.messageText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            
            {item.unread > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>
                  {item.unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Renders a section header
  const renderSectionHeader = ({ section }: { section: { title: string, data: any[] } }) => (
    <View style={[
      styles.sectionHeader, 
      { backgroundColor: colors.backgroundPrimary },
      section.title === 'Other Chats' && styles.otherChatsHeader
    ]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {section.title}
      </Text>
    </View>
  );

  // Renders a section footer (removed divider line)
  const renderSectionFooter = ({ section }: { section: { title: string } }) => {
    return null;
  };

  // Renders the header component
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Chats
        </Text>
      </View>
    </View>
  );

  // Renders the search bar
  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { 
      backgroundColor: '#F3F4F6',
      borderColor: '#E5E7EB',
    }]}>
      <Ionicons name="search-outline" size={20} color={colors.textTertiary} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: colors.textPrimary }]}
        placeholder="Search..."
        placeholderTextColor={colors.textTertiary}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => handleSearch('')}
        >
          <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );

  // Renders an empty state display
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.textTertiary} />
      </View>
      <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
        No chats found
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        {searchQuery ? 'Try a different search' : 'Start a new chat with the Solvbox assistant'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={[styles.newAssistantChatButton, { backgroundColor: colors.primary }]}
          onPress={() => handleChatPress(FIXED_CHATS[0])}
        >
          <Text style={styles.newAssistantChatButtonText}>
            Chat with assistant
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Check if both sections are empty
  const isEmpty = filteredSections.length === 0 || 
    (filteredSections.length > 0 && filteredSections.every(section => section.data.length === 0));

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.backgroundPrimary,
      paddingTop: insets.top 
    }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      {renderHeader()}
      
      {/* Search bar */}
      {renderSearchBar()}
      
      {/* Chat list with sections */}
      {isEmpty ? (
        renderEmptyState()
      ) : (
        <SectionList
          sections={filteredSections}
          renderItem={renderChatContact}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* No FloatingChatButton needed in Chat screen */}
      {/* Button removed as we are already in the chat area */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.s,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.s,
    height: 44,
    borderRadius: ui.borderRadius.m,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: typography.fontSize.m,
  },
  clearButton: {
    padding: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  sectionHeader: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  sectionTitle: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionFooter: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  highlightGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: -1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: typography.fontSize.m,
    flex: 1,
    marginRight: spacing.s,
  },
  timeText: {
    fontSize: typography.fontSize.s,
  },
  contactSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: typography.fontSize.s,
    flex: 1,
    marginRight: spacing.s,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold as any,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: typography.fontSize.m,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  newAssistantChatButton: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: ui.borderRadius.l,
    marginTop: spacing.m,
  },
  newAssistantChatButtonText: {
    color: 'white',
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  oliviaAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherChatsHeader: {
    paddingTop: spacing.l,
  },
}); 