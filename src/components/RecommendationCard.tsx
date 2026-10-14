import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Recommendation } from '../types/conversation';

type ExperienceDefinition = {
  icon: string;
  eyebrow: string;
  tint: string;
  accent: string;
};

const experienceRegistry: Record<string, ExperienceDefinition> = {
  gemstone: {
    icon: '✦',
    eyebrow: 'GEMSTONE',
    tint: '#FFF1B8',
    accent: '#8A6500',
  },
  tarot: {
    icon: '✧',
    eyebrow: 'TAROT READING',
    tint: '#FFF4CC',
    accent: '#8A6500',
  },
  consultation: {
    icon: '◉',
    eyebrow: 'CONSULTATION',
    tint: '#FFF6D7',
    accent: '#765700',
  },
  article: {
    icon: '▤',
    eyebrow: 'LEARN MORE',
    tint: '#FFF8DF',
    accent: '#765700',
  },
  panchang: {
    icon: '☼',
    eyebrow: 'PANCHANG',
    tint: '#FCEBB1',
    accent: '#765700',
  },
  remedy: { icon: '❋', eyebrow: 'REMEDY', tint: '#FFF3C7', accent: '#765700' },
  promotion: {
    icon: '✦',
    eyebrow: 'FOR YOU',
    tint: '#FFF1B8',
    accent: '#765700',
  },
};

const fallbackExperience: ExperienceDefinition = {
  icon: '✧',
  eyebrow: 'EXPLORE',
  tint: '#FFF6D7',
  accent: '#8A6500',
};

type Props = {
  recommendation: Recommendation;
  onPress: (recommendation: Recommendation) => void;
};

export function RecommendationCard({ recommendation, onPress }: Props) {
  const definition =
    experienceRegistry[recommendation.type] ?? fallbackExperience;
  const accent = recommendation.accentColor ?? definition.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recommendation.title}, ${definition.eyebrow}`}
      onPress={() => onPress(recommendation)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: definition.tint }]}>
        <Text style={[styles.icon, { color: accent }]}>{definition.icon}</Text>
      </View>
      <Text style={[styles.eyebrow, { color: accent }]} numberOfLines={1}>
        {definition.eyebrow}
      </Text>
      <Text style={styles.title} numberOfLines={2}>
        {recommendation.title}
      </Text>
      {recommendation.subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {recommendation.subtitle}
        </Text>
      ) : null}
      <View style={styles.footer}>
        <Text style={[styles.action, { color: accent }]}>Explore</Text>
        <Text style={[styles.arrow, { color: accent }]}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 174,
    minHeight: 174,
    padding: 14,
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1E8C9',
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 18, fontWeight: '700' },
  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: { fontSize: 14, lineHeight: 19, fontWeight: '700', color: '#29252F' },
  subtitle: { fontSize: 11, lineHeight: 15, color: '#817B88', marginTop: 4 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },
  action: { fontSize: 11, fontWeight: '700' },
  arrow: { fontSize: 18, lineHeight: 18, marginLeft: 4 },
});
