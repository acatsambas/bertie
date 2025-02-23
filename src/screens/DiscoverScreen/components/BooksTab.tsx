import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

import Input from 'components/Input';

import { useUserBooks } from 'api/app/hooks';

import { executeGPT } from 'gpt/discover-books';

export const BooksTab = () => {
  const books = useUserBooks({ withRefs: true });

  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const bookTitles = books.map(book => book.volumeInfo.title);
    async function fetchInitialMessage() {
      const initialMessage = '';
      await executeGPT(null, bookTitles); // Get first AI response
      setMessages([initialMessage]);
    }
    fetchInitialMessage();
  }, [books]);

  const handleSend = async () => {
    if (userInput.trim()) {
      const userMessage = userInput;
      setMessages(prevMessages => [...prevMessages, userMessage]); // Show user message
      setUserInput('');

      const botResponse = '';
      await executeGPT(userMessage); // Get AI response
      setMessages(prevMessages => [...prevMessages, botResponse]); // Update UI
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.booksTab}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              index % 2 === 0 ? styles.botMessage : styles.userMessage,
            ]}
          >
            <Markdown
              style={{
                body: {
                  fontFamily: 'Commissioner_400Regular',
                  fontSize: 16,
                },
              }}
            >
              {message}
            </Markdown>
          </View>
        ))}
      </ScrollView>
      <View style={{ marginBottom: 40 }}>
        <Input
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your response here"
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  booksTab: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#F8E7E7',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#E7E7E7',
    alignSelf: 'flex-end',
  },
});
