import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'react-native';
import { View, Text } from 'directions-components';
import { Message } from './Message';
import * as signalR from '@microsoft/signalr';

export interface TextExperimentQuestionnaireProps {
  callback(): void;
}

export const TextExperimentQuestionnaire = ({
  callback,
}: TextExperimentQuestionnaireProps) => {
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
      <Text type="header">Hur hittar man hit?</Text>

      <Text type="onGrayBackground" margin="bottom+horizontal">
        Beskriv så att en person som är i närområdet hittar fram till huset.
        Tänk på att beskrivningen ska kunna användas året om och av personer som
        inte hittar i närområdet.
      </Text>

      <Message type="listening" text={connected ? 'Lyssnar' : 'Ansluter'} />

      {messages &&
        messages.map((message, index: number) => (
          <Message key={index} text={message} />
        ))}

      <Button title="Slutför" onPress={handleSubmitButtonPress} />
    </View>
  );
};
