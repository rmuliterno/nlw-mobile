import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';

import { captureScreen } from 'react-native-view-shot'
import * as FileSystem from 'expo-file-system';

import { styles } from './styles';
import { theme } from '../../theme'
import { feedbackTypes } from '../../utils/feedbackTypes';

import { FeedbackType } from '../Widget';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../Button';
import { api } from '../../libs/api';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [comment, setComment] = useState('')

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  const handleScreenshot = () => {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    })
    .then(uri => {
      console.log(uri)
      setScreenshot(uri)
    })
    .catch(err => console.log(err))
  }

  const handleRemoveScreenshot = () => {
    setScreenshot(null)
  }

  const handleSendFeedback = async () => {
    if (sending) {
      return
    }

    setSending(true)
    const screenshotBase64 = screenshot && 
      await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64'})

      // Tá rolando algum problema aqui

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment
      })

      onFeedbackSent();
    } catch(error) {
      console.log(error)
    } finally {
      setSending(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput 
        multiline
        style={styles.input}
        placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...'
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton 
          onTakeShot={handleScreenshot}
          onRemoveShot={handleRemoveScreenshot}
          screenshot={screenshot}
        />

        <Button
          isLoading={sending}
          onPress={handleSendFeedback}
        />
      </View>
    </View>
  );
}