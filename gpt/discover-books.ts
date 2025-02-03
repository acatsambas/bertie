import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  project: process.env.EXPO_PUBLIC_OPENAI_PROJECT_ID,
  organization: process.env.EXPO_PUBLIC_OPENAI_ORG_ID,
});

//Function for subsequent recommendations - this should be call when a user responds to the first suggestion
async function getRecommendation() {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messageHistory,
      max_tokens: 1000,
    });

    const botMessage = response.choices[0].message.content;
    messageHistory.push({ role: 'assistant', content: botMessage });

    return botMessage;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return 'Oops! Something went wrong.';
  }
}

let userList = [
  'Infinite Jest',
  'The Lottery and Other Stories',
  'Death on the Nile',
]; //holds the user's list (current + past) - here showing it with dummy data
let messageHistory = []; // this holds the messages from and to GPT, so it has the history and context

//initialisation
messageHistory.push(
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content: `Here is a list of books I like: ${userList.join(', ')}. Given these preferences, what other books might I like?`,
  },
);

export async function executeGPT(userMessage: string | null = null) {
  let tempMessage = '';

  if (userMessage) {
    messageHistory.push({ role: 'user', content: userMessage });
    tempMessage = await getRecommendation();
  } else {
    tempMessage =
      userList.length === 0
        ? 'Your reading list is empty. Add books to get personalized recommendations!'
        : await getRecommendation();
  }

  return tempMessage;
}

executeGPT();
