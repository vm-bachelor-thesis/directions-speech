import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'directions-components';
import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';
import { templates } from './templates';

export interface MessageProps {
  text: string;
  type?: 'default' | 'status';
  connected?: boolean;
}

export const Message = ({
  text,
  type = 'default',
  connected = false,
}: MessageProps) => {
  const [dots, setDots] = useState<number>(0);

  useEffect(() => {
    if (type === 'status') {
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
    type === 'status' && templates.messageTextStatus,
  ]);

  const computedText = type === 'status' ? text + '.'.repeat(dots) : text;

  return (
    <View style={templates.messageView}>
      {type === 'status' && (
        <ConnectionIndicator
          state={connected ? 'connected' : 'disconnected'}
          margin="right"
        />
      )}
      <Text style={textFlattenedStyle}>{computedText}</Text>
    </View>
  );
};
