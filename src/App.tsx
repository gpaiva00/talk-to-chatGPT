import { useEffect, useState } from "react";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Microphone, Stop } from '@phosphor-icons/react'

import { SPEECH_LANGUAGE } from "./constants";

import { MODEL } from "./typings/Model";
import { OpenAIFetchProps } from "./typings/OpenAIFetchProps";


function App() {
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isSupported, setIsSupported] = useState(false);

  const handleListen = () => {
    SpeechRecognition.startListening({ language: SPEECH_LANGUAGE });
  }

  const handleStopListen = () => {
    setTranscription(transcript);
    resetTranscript();
    SpeechRecognition.stopListening();
  }

  const toggleListen = () => {
    setIsListening(!isListening);

    if (!isListening) {
      handleListen();
    } else {
      handleStopListen();
      fetchGPT().then(handleTextToSpeech);
    }
  }

  const fetchGPT = async () => {
    try {
      // https://api.openai.com/v1/chat/completions
      // https://api.openai.com/v1/completions
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL.GPT3_TURBO,
          messages: [{ role: 'user', content: transcription }],
          temperature: 0.7,
        }),
      });

      return response.json();
    } catch (error) {
      console.log(error);
    }
  }

  const handleTextToSpeech = (data: OpenAIFetchProps) => {
    try {
      const utterance = new SpeechSynthesisUtterance(data.choices[0].message.content);

      utterance.lang = SPEECH_LANGUAGE;
      utterance.rate = 1;

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setIsSupported(SpeechRecognition.browserSupportsSpeechRecognition());
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-4">
        {!isSupported &&
          <p>Sorry, your browser does not support speech recognition.</p>
        }

        {isListening
          ? <h1 className="font-sans font-semibold text-2xl animate-pulse duration-700">Listening...</h1>
          : <h1 className="font-sans font-semibold text-2xl">Talk to ChatGPT with your voice.</h1>
        }

        <button
          className="flex gap-2 items-center justify-center p-4 rounded-full bg-slate-900 text-slate-100 focus:outline-none"
          onClick={toggleListen}
        >
          {isListening
            ? < Stop weight="fill" size={24} className="text-purple-600" />
            : <Microphone weight="fill" size={24} className="text-purple-600" />
          }
        </button>

        <p className="text-gray-400 text-center text-sm">{transcription}</p>
      </div>
    </div>
  );
}

export default App;
