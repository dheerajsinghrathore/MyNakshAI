import {ConversationMessage, TimelineItem} from '../types/conversation';

const dateKey = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const dateLabel = (value: string) => {
  const date = new Date(value);
  const today = new Date();
  if (dateKey(value) === dateKey(today.toISOString())) {
    return 'Today';
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dateKey(value) === dateKey(yesterday.toISOString())) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'});
};

export function buildTimeline(messages: ConversationMessage[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  let previousDateKey = '';

  messages.forEach((message, index) => {
    const currentDateKey = dateKey(message.createdAt);
    if (currentDateKey !== previousDateKey) {
      items.push({
        id: `date-${currentDateKey}`,
        kind: 'date',
        label: dateLabel(message.createdAt),
      });
      previousDateKey = currentDateKey;
    }

    const previous = messages[index - 1];
    const next = messages[index + 1];
    const canGroup = (candidate?: ConversationMessage) =>
      !!candidate &&
      candidate.type === message.type &&
      candidate.type !== 'system' &&
      dateKey(candidate.createdAt) === currentDateKey &&
      Math.abs(new Date(candidate.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5 * 60 * 1000;

    items.push({
      id: `message-${message.id}`,
      kind: 'message',
      message,
      isFirstInGroup: !canGroup(previous),
      isLastInGroup: !canGroup(next),
    });
  });

  return items;
}
