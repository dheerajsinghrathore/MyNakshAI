import { ConversationMessage } from '../types/conversation';

export const initialConversation: ConversationMessage[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    createdAt: '2026-10-13T09:40:00.000Z',
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    createdAt: '2026-10-13T09:41:00.000Z',
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    createdAt: '2026-10-13T09:41:20.000Z',
    recommendations: [
      {
        id: 'r1',
        type: 'gemstone',
        title: 'Blue Sapphire',
        subtitle: 'Recommended for Saturn',
      },
      { id: 'r2', type: 'tarot', title: 'Career Tarot Reading' },
      { id: 'r3', type: 'consultation', title: 'Talk to an Astrologer' },
      { id: 'r4', type: 'article', title: 'Understanding Saturn Mahadasha' },
    ],
  },
  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    createdAt: '2026-10-13T09:42:00.000Z',
  },
];
