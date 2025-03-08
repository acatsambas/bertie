import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

import Input from 'components/Input';

import { useBooksTab } from '../hooks/useBooksTab';

export const BooksTab = () => {
  const [userInput, setUserInput] = useState<string>('');
  const { messages, handleSendMessage } = useBooksTab({
    userInput,
    cleanInput: () => setUserInput(''),
  });

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
      <Input
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Type your response here"
        returnKeyType="send"
        onSubmitEditing={handleSendMessage}
      />
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
