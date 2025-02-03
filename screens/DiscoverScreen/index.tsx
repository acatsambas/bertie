import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, Tab } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { translations } from '../../locales/translations';
import { AppNavigatorParamList } from '../../navigation/AppStack/params';
import { useUser } from '../../api/app/hooks';
import { executeGPT } from '../../gpt/discover-books';

import Avatar from '../../components/Avatar';
import BookshopsList from '../../components/BookshopsList';
import BottomMenu from '../../components/BottomMenu';
import Text from '../../components/Text';
import Input from '../../components/Input';

export interface DiscoverScreenProps
  extends StackNavigationProp<AppNavigatorParamList, 'DiscoverNavigator'> {}

const DiscoverScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<DiscoverScreenProps>();
  const user = useUser();

  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    async function fetchInitialMessage() {
      const initialMessage = await executeGPT(); // Get first AI response
      setMessages([initialMessage]);
    }
    fetchInitialMessage();
  }, []);

  const handleAvatarClick = () => {
    navigate('SettingsNavigator');
  };

  const handleSend = async () => {
    if (userInput.trim()) {
      const userMessage = userInput;
      setMessages(prevMessages => [...prevMessages, userMessage]); // Show user message
      setUserInput('');

      const botResponse = await executeGPT(userMessage); // Get AI response
      setMessages(prevMessages => [...prevMessages, botResponse]); // Update UI
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.discover.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <Tab
          value={index}
          onChange={setIndex}
          titleStyle={{
            fontFamily: 'GoudyBookletter1911_400Regular',
            fontSize: 24,
          }}
        >
          <Tab.Item>{t(translations.discover.bookshops)}</Tab.Item>
          <Tab.Item>{t(translations.discover.books)}</Tab.Item>
        </Tab>
        {index === 0 ? (
          <View style={styles.bookshopContainer}>
            {!user?.address && (
              <View style={styles.description}>
                <Text
                  text={t(translations.discover.description)}
                  kind="paragraph"
                  onPress={() =>
                    navigate('SettingsNavigator', { screen: 'ChangeAddress' })
                  }
                />
              </View>
            )}
            <BookshopsList />
          </View>
        ) : (
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
                  <Text text={message} kind="paragraph" />
                </View>
              ))}
            </ScrollView>
            <Input
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your response here"
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </KeyboardAvoidingView>
        )}
      </View>
      <BottomMenu />
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bookshopContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  description: {
    backgroundColor: '#F3EAFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
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
}));

export default DiscoverScreen;
