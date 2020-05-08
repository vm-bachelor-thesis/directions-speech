import React, { useState, useEffect } from 'react';
import {
  CharacteristicsQuestionnaire,
  SUSQuestionnaire,
  CompletedMessage,
} from 'directions-components';
import { SpeechExperimentQuestionnaire } from './components';

export const App = () => {
  const [characteristicsResponse, setCharacteristicsResponse] = useState<
    CharacteristicsResponse
  >();
  const [experimentDone, setExperimentDone] = useState<boolean>(false);
  const [susResponse, setSUSResponse] = useState<SUSResponse>();

  const [dataSaved, setDataSaved] = useState<boolean | undefined>(undefined);
  const [rejectedPayload, setRejectedPayload] = useState<object | undefined>(
    undefined,
  );

  useEffect(() => {
    if (dataSaved) {
      return;
    }

    if (characteristicsResponse && experimentDone && susResponse) {
      const payload = {
        response: {
          experimentDone,
          characteristics: characteristicsResponse,
          sus: susResponse,
        },
      };

      const url =
        'https://directions-service.azurewebsites.net/api/uploadSpeechResponse?code=Iw0bz6gWTmGHE1gfjHqQYA7hbaeAPdLcJJSuoAj00Jhr6qIQbmT/Vw==';

      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            setDataSaved(true);
            setRejectedPayload(undefined);
          } else {
            setDataSaved(false);
            setRejectedPayload(payload);
          }
        })
        .catch(console.warn);
    }
  }, [characteristicsResponse, experimentDone, susResponse, dataSaved]);

  if (!experimentDone) {
    return (
      <SpeechExperimentQuestionnaire callback={() => setExperimentDone(true)} />
    );
  }

  if (!susResponse) {
    return <SUSQuestionnaire callback={setSUSResponse} />;
  }

  if (!characteristicsResponse) {
    return (
      <CharacteristicsQuestionnaire callback={setCharacteristicsResponse} />
    );
  }

  return <CompletedMessage message={rejectedPayload} />;
};
