import React, { useState, useEffect } from 'react';
import { View, Text } from 'directions-components';
import { templates } from './templates';
import { StyleSheet } from 'react-native';

export interface MessageProps {
  text: string;
  type?: 'default' | 'listening';
}

export const Message = ({ text, type = 'default' }: MessageProps) => {
  const [dots, setDots] = useState<number>(0);

  useEffect(() => {
    if (type === 'listening') {
      const timerId = setInterval(
        () => setDots(dots === 3 ? 0 : dots + 1),
        200,
      );
      return function cleanup() {
        clearInterval(timerId);
      };
    }
  }, [type, dots]);

  const textFlattenedStyle = StyleSheet.flatten([
    {},
    type === 'listening' && templates.messageTextListening,
  ]);

  const computedText = type === 'listening' ? text + '.'.repeat(dots) : text;

  return (
    <View style={templates.messageView}>
      <Text style={textFlattenedStyle}>{computedText}</Text>
    </View>
  );
};
