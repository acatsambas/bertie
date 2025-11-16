import OpenAI from 'openai';

// Initialize OpenAI client for native platforms
const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  project: process.env.EXPO_PUBLIC_OPENAI_PROJECT_ID,
  organization: process.env.EXPO_PUBLIC_OPENAI_ORG_ID,
});

// Function for subsequent recommendations - called when a user responds
async function getRecommendation() {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messageHistory,
      max_tokens: 1000,
    });

    const botMessage = response.choices[0]?.message?.content;
    if (botMessage) {
      messageHistory.push({ role: 'assistant', content: botMessage });
    }

    return botMessage || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return 'Oops! Something went wrong.';
  }
}

// Holds the messages from and to GPT, so it has history and context
let messageHistory = [];

// Function to initialize conversation with books
export async function executeGPT(
  userMessage: string | null = null,
  books: string[] | null = null,
) {
  let tempMessage = '';

  // If first-time execution (no userMessage), initialize messageHistory
  if (messageHistory.length === 0 && books && books.length > 0) {
    console.log(books);
    messageHistory.push(
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `Here is a list of books I like: ${books.join(', ')}. Given these preferences, what other books might I like?`,
      },
    );
  }

  if (userMessage) {
    messageHistory.push({ role: 'user', content: userMessage });
    tempMessage = await getRecommendation();
  } else {
    tempMessage =
      books && books.length === 0
        ? 'Your reading list is empty. Add books to get personalized recommendations!'
        : await getRecommendation();
  }

  return tempMessage;
}
