import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Conversation, mockConversations } from '../data/mockConversations';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'ConversationList'
>;

function ConversationSeparator() {
  return <View style={styles.separator} />;
}

export function ConversationListScreen() {
  const navigation = useNavigation<Navigation>();
  const openConversation = useCallback(
    (conversation: Conversation) => {
      navigation.navigate('Conversation', {
        conversationId: conversation.id,
        title: conversation.title,
      });
    },
    [navigation],
  );

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title}. ${item.lastMessage}`}
        onPress={() => openConversation(item)}
        style={({ pressed }) => [
          styles.conversationRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.avatarWrap}>
          <Text style={styles.avatar}>{item.avatar}</Text>
          {item.unreadCount ? <View style={styles.onlineIndicator} /> : null}
        </View>
        <View style={styles.conversationCopy}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.updatedAt}>{item.updatedAt}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.preview} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    ),
    [openConversation],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>✦</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>YOUR COSMIC GUIDE</Text>
          <Text style={styles.headerTitle}>Conversations</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start a new conversation"
          onPress={() =>
            openConversation({
              id: `new-${Date.now()}`,
              title: 'New conversation',
              lastMessage: '',
              updatedAt: 'Now',
              avatar: '✦',
            })
          }
          style={styles.newButton}
        >
          <Text style={styles.newButtonText}>＋</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT</Text>
        <Text style={styles.count}>
          {mockConversations.length} conversations
        </Text>
      </View>

      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        windowSize={7}
        ItemSeparatorComponent={ConversationSeparator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FBFAF8' },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  brandMark: {
    width: 43,
    height: 43,
    borderRadius: 16,
    backgroundColor: '#FFF1B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandMarkText: { fontSize: 23, color: '#8A6500' },
  headerCopy: { flex: 1 },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.35,
    fontWeight: '800',
    color: '#978BA2',
    marginBottom: 3,
  },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#302A36' },
  newButton: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2C230',
  },
  newButtonText: { fontSize: 25, lineHeight: 29, color: '#332700' },
  intro: {
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 25,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFF6D7',
  },
  introTitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    color: '#493800',
  },
  introBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#75643A',
    marginTop: 5,
    maxWidth: 285,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.25,
    fontWeight: '800',
    color: '#958D99',
  },
  count: { fontSize: 11, color: '#A49DA8' },
  listContent: { paddingHorizontal: 18, paddingBottom: 20 },
  conversationRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  pressed: { backgroundColor: '#FFF8DF' },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 19,
    backgroundColor: '#FFF8DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  avatar: { fontSize: 24 },
  onlineIndicator: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#E6B916',
    borderWidth: 2,
    borderColor: '#FBFAF8',
  },
  conversationCopy: { flex: 1, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#302B35',
    flex: 1,
    marginRight: 8,
  },
  updatedAt: { fontSize: 10, color: '#A49DA8' },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  preview: { fontSize: 12, color: '#89828E', flex: 1, marginRight: 8 },
  unreadBadge: {
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2C230',
  },
  unreadText: { fontSize: 10, fontWeight: '700', color: '#332700' },
  separator: { height: 1, backgroundColor: '#F0EDF0', marginLeft: 71 },
});
