import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Recommendation} from '../types/conversation';
import {RecommendationCard} from './RecommendationCard';

type Props = {
  recommendations: Recommendation[];
  onRecommendationPress: (recommendation: Recommendation) => void;
};

export function RecommendationRail({recommendations, onRecommendationPress}: Props) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.label}>A FEW THINGS TO EXPLORE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
        keyboardShouldPersistTaps="handled">
        {recommendations.map(recommendation => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onPress={onRecommendationPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {marginTop: 15, marginLeft: -39},
  label: {
    fontSize: 9,
    letterSpacing: 1.1,
    fontWeight: '800',
    color: '#968D9C',
    marginLeft: 1,
    marginBottom: 9,
  },
  cards: {flexDirection: 'row'},
});
