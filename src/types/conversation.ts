export type MessageType = 'system' | 'user' | 'ai' | 'human';

export type RecommendationType =
  | 'gemstone'
  | 'tarot'
  | 'consultation'
  | 'article'
  | 'panchang'
  | 'remedy'
  | 'promotion'
  | (string & {});

export type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
  description?: string;
  accentColor?: string;
};

export type ConversationMessage = {
  id: string;
  type: MessageType;
  text: string;
  createdAt: string;
  recommendations?: Recommendation[];
  sendStatus?: 'sending' | 'sent' | 'failed';
  replyTo?: { id: string; text: string };
};

export type TimelineItem =
  | { id: string; kind: 'date'; label: string }
  | {
      id: string;
      kind: 'message';
      message: ConversationMessage;
      isFirstInGroup: boolean;
      isLastInGroup: boolean;
    };
