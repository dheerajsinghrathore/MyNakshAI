import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ConversationMessage, Recommendation} from '../types/conversation';
import {RecommendationRail} from './RecommendationRail';

type Props = {
  message: ConversationMessage;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  onRecommendationPress: (recommendation: Recommendation) => void;
  onLongPress: (message: ConversationMessage) => void;
  feedback?: 'like' | 'dislike';
  feedbackReason?: string;
  onFeedback: (messageId: string, value: 'like' | 'dislike') => void;
  onFeedbackReason: (messageId: string, reason: string) => void;
  onRetrySend: (message: ConversationMessage) => void;
};

const timeLabel = (value: string) =>
  new Date(value).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});

export function MessageBubble({
  message,
  isFirstInGroup,
  isLastInGroup,
  onRecommendationPress,
  onLongPress,
  feedback,
  feedbackReason,
  onFeedback,
  onFeedbackReason,
  onRetrySend,
}: Props) {
  if (message.type === 'system') {
    return (
      <View style={styles.systemWrap}>
        <View style={styles.systemPill}>
          <Text style={styles.systemDot}>✦</Text>
          <Text style={styles.systemText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  const isUser = message.type === 'user';
  const isHuman = message.type === 'human';
  const speaker = isUser ? 'You' : isHuman ? 'Astrologer' : 'MyNaksh AI';

  return (
    <View style={[styles.row, isUser && styles.userRow, !isFirstInGroup && styles.groupedRow]}>
      {!isUser ? (
        <View style={[styles.avatar, isHuman && styles.humanAvatar]}>
          <Text style={styles.avatarText}>{isHuman ? 'A' : '✦'}</Text>
        </View>
      ) : null}
      <View style={[styles.messageColumn, isUser && styles.userColumn]}>
        {isFirstInGroup ? (
          <View style={[styles.metaRow, isUser && styles.userMetaRow]}>
            <Text style={styles.speaker}>{speaker}</Text>
            <Text style={styles.time}>{timeLabel(message.createdAt)}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="text"
          onLongPress={() => onLongPress(message)}
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            isHuman && styles.humanBubble,
            !isLastInGroup && (isUser ? styles.userGroupedBubble : styles.assistantGroupedBubble),
          ]}>
          <Text style={[styles.body, isUser && styles.userBody]}>{message.text}</Text>
        </Pressable>
        {message.type === 'ai' ? (
          <View style={styles.feedbackArea}>
            <View style={styles.feedbackRow}>
              <Text style={styles.sendState}>{message.sendStatus === 'sending' ? 'Sending…' : message.sendStatus === 'failed' ? 'Failed to send' : ''}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Like response" onPress={() => onFeedback(message.id, 'like')} style={[styles.feedbackButton, feedback === 'like' && styles.selectedFeedback]}>
                <Text style={styles.feedbackText}>👍</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Dislike response" onPress={() => onFeedback(message.id, 'dislike')} style={[styles.feedbackButton, feedback === 'dislike' && styles.selectedFeedback]}>
                <Text style={styles.feedbackText}>👎</Text>
              </Pressable>
            </View>
            {feedback === 'dislike' ? (
              <View style={styles.reasonRow}>
                {['Inaccurate', 'Too Generic', "Didn't Help", 'Too Long'].map(reason => (
                  <Pressable key={reason} onPress={() => onFeedbackReason(message.id, reason)} style={[styles.reasonChip, feedbackReason === reason && styles.selectedReason]}>
                    <Text style={[styles.reasonText, feedbackReason === reason && styles.selectedReasonText]}>{reason}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : message.type === 'user' && message.sendStatus ? (
          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryText}>{message.sendStatus === 'sending' ? 'Sending…' : message.sendStatus === 'sent' ? 'Sent' : 'Failed'}</Text>
            {message.sendStatus === 'failed' ? (
              <Pressable accessibilityRole="button" onPress={() => onRetrySend(message)} style={styles.retryInline}>
                <Text style={styles.retryInlineText}>Retry</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
        {message.recommendations?.length ? (
          <RecommendationRail
            recommendations={message.recommendations}
            onRecommendationPress={onRecommendationPress}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 18, marginTop: 18},
  userRow: {justifyContent: 'flex-end'},
  groupedRow: {marginTop: 6},
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    marginTop: 2,
    backgroundColor: '#EEE7F5',
  },
  humanAvatar: {backgroundColor: '#E5EFEB'},
  avatarText: {fontSize: 14, fontWeight: '800', color: '#71529A'},
  messageColumn: {maxWidth: '84%', flexShrink: 1},
  userColumn: {alignItems: 'flex-end', maxWidth: '84%'},
  metaRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginLeft: 2},
  userMetaRow: {justifyContent: 'flex-end', marginRight: 2},
  speaker: {fontSize: 12, fontWeight: '700', color: '#514A59'},
  time: {fontSize: 10, color: '#A19BA7', marginLeft: 8},
  bubble: {paddingHorizontal: 14, paddingVertical: 11, borderRadius: 17},
  assistantBubble: {backgroundColor: '#F4F1F7', borderTopLeftRadius: 5},
  humanBubble: {backgroundColor: '#EFF5F2'},
  userBubble: {backgroundColor: '#70538F', borderTopRightRadius: 5},
  assistantGroupedBubble: {borderTopLeftRadius: 15},
  userGroupedBubble: {borderTopRightRadius: 15},
  body: {fontSize: 14, lineHeight: 21, color: '#38333E'},
  feedbackArea: {marginTop: 5},
  feedbackRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', minHeight: 30},
  sendState: {fontSize: 10, color: '#9A929F', marginRight: 'auto'},
  feedbackButton: {padding: 5, borderRadius: 12, marginLeft: 3},
  selectedFeedback: {backgroundColor: '#EEE8F4'},
  feedbackText: {fontSize: 15},
  reasonRow: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 3},
  reasonChip: {borderRadius: 14, borderWidth: 1, borderColor: '#E3DDE8', paddingHorizontal: 9, paddingVertical: 5, marginRight: 5, marginBottom: 5},
  selectedReason: {backgroundColor: '#735591', borderColor: '#735591'},
  reasonText: {fontSize: 10, color: '#716A77'},
  selectedReasonText: {color: '#FFFFFF'},
  deliveryRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 3},
  deliveryText: {fontSize: 10, color: '#9A929F'},
  retryInline: {marginLeft: 8, paddingHorizontal: 8, paddingVertical: 3},
  retryInlineText: {fontSize: 10, fontWeight: '700', color: '#735591'},
  userBody: {color: '#FFFFFF'},
  systemWrap: {alignItems: 'center', marginTop: 15, paddingHorizontal: 22},
  systemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
    backgroundColor: '#F3F0F5',
  },
  systemDot: {fontSize: 10, color: '#8366A1', marginRight: 7},
  systemText: {fontSize: 11, color: '#827A89'},
});
