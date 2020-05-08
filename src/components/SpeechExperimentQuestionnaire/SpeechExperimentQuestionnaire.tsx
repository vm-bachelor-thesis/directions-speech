import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, StyleSheet } from 'react-native';
import { View, Text } from 'directions-components';
import { Message } from '../Message/Message';
import * as signalR from '@microsoft/signalr';

export interface SpeechExperimentQuestionnaireProps {
  callback(): void;
}

export const SpeechExperimentQuestionnaire = ({
  callback,
}: SpeechExperimentQuestionnaireProps) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  const hubConnection = useRef(
    new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('https://directions-service.azurewebsites.net/api', {
        //skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build(),
  );

  hubConnection.current.on('close', () => setConnected(false));
  hubConnection.current.onreconnecting(() => setConnected(false));
  hubConnection.current.onreconnected(() => setConnected(true));

  hubConnection.current.on('newMessage', (message) => {
    addMessage(message.text);
  });

  const addMessage = (message: string) => {
    setMessages([message, ...messages]);
  };

  const connect = useCallback(() => {
    hubConnection.current
      .start()
      .then(() => {
        setConnected(true);
      })
      .catch(console.warn);

    return hubConnection.current;
  }, [hubConnection]);

  useEffect(() => {
    const connection = connect();

    return () => {
      connection.stop();
    };
  }, [hubConnection, connect]);

  const handleSubmitButtonPress = () => {
    callback();
  };

  return (
    <View type="container">
      <View background="gray" style={style.headerFlex}>
        <Text type="header">Hur hittar man hit?</Text>
        <Button title="Slutför" onPress={handleSubmitButtonPress} />
      </View>

      <Text type="onGrayBackground" margin="bottom+horizontal">
        Beskriv så att en person som är i närområdet hittar fram till huset.
        Tänk på att beskrivningen ska kunna användas året om och av personer som
        inte varit här tidigare.
      </Text>

      <Message
        type="status"
        text={connected ? 'Lyssnar' : 'Ansluter'}
        connected={connected}
      />

      {messages &&
        messages.map((message, index: number) => (
          <Message key={index} text={message} />
        ))}
    </View>
  );
};

const style = StyleSheet.create({
  headerFlex: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
