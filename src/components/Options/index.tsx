import React from 'react';
import { View, Text } from 'react-native';
import { Copyright } from '../Copyright';
import { Option } from '../Option';

import { feedbackTypes } from '../../utils/feedbackTypes'
import { FeedbackType } from '../Widget';
import { styles } from './styles';

interface Props {
  onFeedbackChanged: (feedbackType: FeedbackType) => void;
}

export function Options({ onFeedbackChanged}: Props ) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deixe seu feedback</Text>
      <View style={styles.options}>
        {
          Object.entries(feedbackTypes).map(([key, value]) => (
            
            <Option 
              onPress={() => onFeedbackChanged(key as FeedbackType)}
              key={key} 
              title={value.title} 
              image={value.image} 
            />
          ))
        }
      </View>

      <Copyright />
    </View>
  );
}