import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  project: process.env.EXPO_PUBLIC_OPENAI_PROJECT_ID,
  organization: process.env.EXPO_PUBLIC_OPENAI_ORG_ID,
});

// helper function to format text better
function replaceLastComma(str: string) {
  const lastCommaIndex = str.lastIndexOf(',');

  // If a comma is found, replace it with 'and'
  if (lastCommaIndex !== -1) {
    return (
      str.substring(0, lastCommaIndex) +
      ', and' +
      str.substring(lastCommaIndex + 1)
    );
  }
  // Return the original string if there's no comma
  return str;
}

}

//Function for subsequent recommendations - this should be call when a user responds to the first suggestion
async function getRecommendation() {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messageHistory,
      max_tokens: 1000,
    });

    messageHistory.push({
      role: 'assistant',
      content: response.choices[0].message.content,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return 'ERROR';
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

async function startExecution() {
  let tempMessage = '';

  if (userList.length === 0) {
    tempMessage = `Your reading list is empty. If you add books to it, we can give you recommendations based on your interests. \n 
        In the meantime, some books we enjoyed recently are the works of Shirley Jackson, Tom Wolfe's essays, and the Rules of Civility. \n
        Let us know if you're after anything particular!`;
  } else {
    tempMessage = (await getFirstRecommendation())
  }

  console.log(tempMessage);

  messageHistory.push({
    role: 'assistant',
    content: tempMessage,
  });

  //this is dummy data - we should be storing here the user's response
  messageHistory.push({
    role: 'user',
    content: `Actually I'm looking for mystery novels or murder mysteries - but they must be literary, not just vacuous Entertainment.`, //user response goes here
  });
  tempMessage = await getRecommendation();
  console.log(tempMessage);
}

startExecution();
