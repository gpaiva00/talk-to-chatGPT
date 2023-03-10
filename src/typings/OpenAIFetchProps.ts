export interface OpenAIFetchProps {
  choices: [
    {
      message: {
        content: string;
        role: string;
      }
      index: number;
    }
  ];
  created: number;
  id: string;
  model: string;
  object: string;
}