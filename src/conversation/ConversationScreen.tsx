import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MessageBubble} from '../components/MessageBubble';
import {initialConversation} from '../data/initialConversation';
import {buildTimeline} from './buildTimeline';
import {ConversationMessage, TimelineItem} from '../types/conversation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

function buildSimulatedReply(prompt: string): string {
  if (/\bcareer\b|\bjob\b|\bwork\b/i.test(prompt)) {
    return 'This year may be a good time to focus on steady progress and building skills in your career. For a more personal astrology reading, share your birth date, exact birth time, and birthplace—or tell me about a specific decision you’re weighing.';
  }
  return 'Thanks for sharing that with me. I’m here to help you explore it. If you can add a little more context or tell me what you’d like to understand, I can offer more focused guidance.';
}

export function ConversationScreen({navigation, route}: Props) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<ConversationMessage | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({});
  const [feedbackReasons, setFeedbackReasons] = useState<Record<string, string>>({});
  const timeline = useMemo(() => buildTimeline(messages), [messages]);
  const listRef = useRef<FlatList<TimelineItem>>(null);
  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const loadConversation = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    setTimeout(() => {
      if (Math.random() < 0.08) {
        setLoading(false);
        setLoadError(true);
        return;
      }
      setMessages(initialConversation);
      setLoading(false);
    }, 450);
  }, []);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  const sendMessage = useCallback((retryMessage?: ConversationMessage) => {
    const text = retryMessage?.text ?? draft.trim();
    if (!text) return;
    const message: ConversationMessage = retryMessage ?? {
      id: `user-${Date.now()}`,
      type: 'user',
      text,
      createdAt: new Date().toISOString(),
      sendStatus: 'sending',
      ...(replyTo ? {replyTo: {id: replyTo.id, text: replyTo.text}} : {}),
    };
    setMessages(current => retryMessage
      ? current.map(item => item.id === retryMessage.id ? {...item, sendStatus: 'sending'} : item)
      : [...current, message]);
    if (!retryMessage) {
      setDraft('');
      setReplyTo(null);
    }
    requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
    setTimeout(() => {
      const failed = Math.random() < 0.12;
      setMessages(current => {
        const updated: ConversationMessage[] = current.map(item => item.id === message.id
          ? {...item, sendStatus: failed ? 'failed' : 'sent'}
          : item);
        if (failed || updated.some(item => item.id === `ai-${message.id}`)) {
          return updated;
        }
        return [...updated, {
          id: `ai-${message.id}`,
          type: 'ai',
          text: buildSimulatedReply(text),
          createdAt: new Date().toISOString(),
        }];
      });
      if (!failed) {
        requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
      }
    }, 1100);
  }, [draft, replyTo]);

  const onLongPress = useCallback((message: ConversationMessage) => {
    if (message.type !== 'ai') return;
    Alert.alert('Message actions', undefined, [
      {text: 'Reply', onPress: () => { setReplyTo(message); inputRef.current?.focus(); }},
      {text: 'Copy', onPress: () => { Clipboard.setString(message.text); Alert.alert('Copied', 'Message copied to clipboard.'); }},
      {text: 'Delete', style: 'destructive', onPress: () => setMessages(current => current.filter(item => item.id !== message.id))},
      {text: 'Cancel', style: 'cancel'},
    ]);
  }, []);

  const renderItem = useCallback(({item}: {item: TimelineItem}) => {
    if (item.kind === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <View style={styles.dateLine} />
          <Text style={styles.dateLabel}>{item.label}</Text>
          <View style={styles.dateLine} />
        </View>
      );
    }
    return (
      <MessageBubble
        message={item.message}
        isFirstInGroup={item.isFirstInGroup}
        isLastInGroup={item.isLastInGroup}
        onLongPress={onLongPress}
        feedback={feedback[item.message.id]}
        feedbackReason={feedbackReasons[item.message.id]}
        onFeedback={(id, value) => setFeedback(current => ({...current, [id]: value}))}
        onFeedbackReason={(id, reason) => setFeedbackReasons(current => ({...current, [id]: reason}))}
        onRetrySend={message => sendMessage(message)}
        onRecommendationPress={recommendation =>
          Alert.alert(recommendation.title, recommendation.description ?? 'This experience can be connected to its own feature as the app grows.')
        }
      />
    );
  }, [feedback, feedbackReasons, onLongPress, sendMessage]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={navigation.goBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headerAvatar}><Text style={styles.headerAvatarText}>✦</Text></View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>{route.params.title}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Your astrology guide</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Conversation options"
            onPress={() => Alert.alert('Conversation options', 'More conversation actions can go here.')}
            style={styles.moreButton}>
            <Text style={styles.moreText}>···</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color="#735591" />
            <Text style={styles.stateTitle}>Loading conversation...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.stateWrap}>
            <Text style={styles.errorLabel}>Network Failure</Text>
            <Text style={styles.stateTitle}>Unable to load conversation.</Text>
            <Pressable accessibilityRole="button" onPress={loadConversation} style={styles.retryButton}><Text style={styles.retryText}>Retry</Text></Pressable>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateTitle}>Start your conversation.</Text>
          </View>
        ) : <FlatList
          ref={listRef}
          data={timeline}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.timeline}
          contentContainerStyle={styles.timelineContent}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          windowSize={9}
          removeClippedSubviews={Platform.OS === 'android'}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
          ListFooterComponent={<View style={styles.listBottomSpace} />}
        />}

        <View style={styles.composerShell}>
          {replyTo ? (
            <View style={styles.replyPreview}>
              <View style={styles.replyCopy}>
                <Text style={styles.replyLabel}>Replying to MyNaksh AI</Text>
                <Text numberOfLines={1} style={styles.replyText}>{replyTo.text}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Cancel reply" onPress={() => setReplyTo(null)}><Text style={styles.cancelReply}>×</Text></Pressable>
            </View>
          ) : null}
          <Text style={styles.composerHint}>Your story is written in the stars</Text>
          <View style={styles.composer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add an attachment"
              onPress={() => Alert.alert('Add to conversation', 'Attachments can be added here.')}
              style={styles.addButton}>
              <Text style={styles.addText}>＋</Text>
            </Pressable>
            <TextInput
              ref={inputRef}
              placeholder="Ask the stars anything…"
              placeholderTextColor="#A7A1AC"
              multiline
              maxLength={1000}
              style={styles.input}
              accessibilityLabel="Write a message"
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send message"
              onPress={() => sendMessage()}
              disabled={!draft.trim()}
              style={styles.sendButton}>
              <Text style={styles.sendText}>↑</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FBFAF8'},
  keyboardView: {flex: 1},
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF0',
    backgroundColor: '#FBFAF8',
  },
  backButton: {width: 31, height: 42, justifyContent: 'center'},
  backArrow: {fontSize: 34, color: '#4B4551', lineHeight: 38},
  headerAvatar: {width: 39, height: 39, borderRadius: 15, backgroundColor: '#EDE5F4', alignItems: 'center', justifyContent: 'center', marginRight: 10},
  headerAvatarText: {fontSize: 19, color: '#755796'},
  headerCopy: {flex: 1},
  headerTitle: {fontSize: 15, fontWeight: '700', color: '#2D2932'},
  onlineRow: {flexDirection: 'row', alignItems: 'center', marginTop: 3},
  onlineDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#65A888', marginRight: 5},
  onlineText: {fontSize: 11, color: '#8E8794'},
  moreButton: {width: 34, height: 40, alignItems: 'flex-end', justifyContent: 'center'},
  moreText: {fontSize: 24, letterSpacing: 1, color: '#625B68', marginTop: -12},
  timeline: {flex: 1},
  timelineContent: {paddingTop: 12, paddingBottom: 8},
  dateSeparator: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginTop: 12, marginBottom: 2},
  dateLine: {height: 1, flex: 1, backgroundColor: '#EDE9ED'},
  dateLabel: {fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: '#A19AA5', marginHorizontal: 12},
  listBottomSpace: {height: 12},
  stateWrap: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  stateTitle: {fontSize: 14, color: '#716A77', marginTop: 12, textAlign: 'center'},
  errorLabel: {fontSize: 12, fontWeight: '700', color: '#8D5161'},
  retryButton: {marginTop: 14, backgroundColor: '#735591', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 9},
  retryText: {color: '#FFFFFF', fontWeight: '700', fontSize: 13},
  composerShell: {paddingHorizontal: 16, paddingTop: 10, paddingBottom: 9, backgroundColor: '#FBFAF8', borderTopWidth: 1, borderTopColor: '#F0EDF0'},
  composerHint: {fontSize: 10, color: '#A098A6', textAlign: 'center', marginBottom: 8},
  composer: {minHeight: 50, flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderColor: '#E9E4EB', borderRadius: 19, backgroundColor: '#FFFFFF', padding: 5},
  addButton: {width: 38, height: 38, alignItems: 'center', justifyContent: 'center'},
  addText: {fontSize: 25, color: '#80768A', lineHeight: 30},
  input: {flex: 1, maxHeight: 100, minHeight: 38, fontSize: 14, lineHeight: 20, paddingHorizontal: 5, paddingTop: 9, paddingBottom: 7, color: '#312B36'},
  sendButton: {width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#735591'},
  sendText: {fontSize: 22, lineHeight: 26, fontWeight: '700', color: '#FFFFFF'},
  replyPreview: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2EEF5', borderLeftWidth: 3, borderLeftColor: '#735591', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, marginBottom: 9},
  replyCopy: {flex: 1},
  replyLabel: {fontSize: 10, fontWeight: '700', color: '#735591'},
  replyText: {fontSize: 11, color: '#6E6774', marginTop: 2},
  cancelReply: {fontSize: 23, color: '#837B89', paddingHorizontal: 4},
});
