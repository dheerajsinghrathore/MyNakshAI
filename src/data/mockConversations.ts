export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  avatar: string;
  unreadCount?: number;
}

export const mockConversations: Conversation[] = [
  {
    id: 'ai-career',
    title: 'AI Astrologer',
    lastMessage: 'Your career looks promising this year.',
    updatedAt: '7:30 PM',
    avatar: '✦',
    unreadCount: 0,
  },
  {
    id: 'human-astrologer',
    title: 'Astrologer Ananya',
    lastMessage: 'Focus on your upcoming Jupiter transit.',
    updatedAt: '5:45 PM',
    avatar: 'A',
    unreadCount: 1,
  },
  {
    id: 'tarot-reading',
    title: 'Career Tarot Reading',
    lastMessage: 'Your cards suggest new opportunities.',
    updatedAt: 'Yesterday',
    avatar: '✧',
    unreadCount: 0,
  },
  {
    id: 'gemstone-consultation',
    title: 'Gemstone Consultation',
    lastMessage: 'We discussed Blue Sapphire.',
    updatedAt: 'Monday',
    avatar: '◇',
    unreadCount: 0,
  },
];
