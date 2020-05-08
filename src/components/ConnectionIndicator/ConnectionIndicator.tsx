import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { templates } from './templates';

export interface ConnectionIndicatorProps extends ViewProps {
  state: 'connected' | 'disconnected';
  margin?: 'right';
}

export const ConnectionIndicator = ({
  state,
  margin,
  style,
}: ConnectionIndicatorProps) => {
  const flattenedStyle = StyleSheet.flatten([
    templates.default,
    state === 'connected' && templates.connected,
    state === 'disconnected' && templates.disconnected,
    margin === 'right' && templates.marginRight,
    style,
  ]);

  return <View style={flattenedStyle} />;
};
