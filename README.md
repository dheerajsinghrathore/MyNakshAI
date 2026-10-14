# MyNaksh Conversations

A React Native conversation experience with a conversation list, message timeline, interactive message actions, feedback, and reusable recommendation cards. Conversation data and network activity are currently simulated locally.

## Project structure

```text
App.tsx                         Navigation and safe-area providers
src/
  components/
    MessageBubble.tsx           Message rendering, actions, feedback, send status
    RecommendationCard.tsx      Individual typed recommendation card
    RecommendationRail.tsx      Horizontal list of recommendation cards
  conversation/
    ConversationListScreen.tsx  Conversation list and navigation entry point
    ConversationScreen.tsx      Conversation state, loading, and composer
    buildTimeline.ts            Date separators and message grouping
  data/
    initialConversation.ts       Seed messages for the demo
    mockConversations.ts         Seed conversation list
  navigation/types.ts           Typed navigation route parameters
  types/conversation.ts         Shared message and recommendation types
```

## Component architecture

`App.tsx` sets up the native stack. `ConversationListScreen` opens a conversation, and `ConversationScreen` owns its timeline and composer. `MessageBubble` renders each message and exposes callbacks for long-press actions, feedback, and retry. `RecommendationRail` maps recommendation data into reusable `RecommendationCard` components. `buildTimeline` derives date separators and adjacent-message grouping from the message array.

## State management

Screen-local React state is used for the current messages, loading and error state, draft text, reply target, and AI feedback. Sending inserts a user message immediately with a `sending` status; a simulated request later marks it `sent` or `failed`, and failed messages can be retried. Reply, delete, and feedback changes update local state. There is no global store or persistence layer because this demo only manages the currently open screen. Initial loads and send outcomes use simulated delays and occasional failures in place of API calls.

## Recommendation rendering

Messages may include an optional array of recommendations with a type, title, and optional subtitle, description, or accent color. `RecommendationRail` renders a horizontal, scrollable set of cards. `RecommendationCard` uses a type registry to select an icon and visual theme, with a generic fallback for unknown types. Presses are passed back to the screen through a callback so each recommendation can be connected to a destination or feature later.

## Performance considerations

The conversation uses `FlatList` for virtualized message rendering and provides stable item keys, an initial render limit, and a bounded window size. Timeline items are memoized from the message list, and row callbacks are memoized to reduce avoidable rerenders. `maintainVisibleContentPosition` helps keep the reader anchored when the list changes. Recommendation rails use horizontal `ScrollView`, which fits the small demo-sized sets; large, unbounded recommendation collections would benefit from a horizontal `FlatList`.

## Trade-offs and next steps

To keep the experience runnable without a backend, conversations, send outcomes, and network failures are mocked, and changes are held only in screen state. The conversation selector currently opens seeded content rather than loading data by conversation ID. Recommendation actions are illustrative callbacks rather than full feature navigation. A production integration should replace the timers and random failures with API requests, persist conversations and feedback, and define retry and offline behavior against real server responses.

## Author
### Dheeraj Rathore