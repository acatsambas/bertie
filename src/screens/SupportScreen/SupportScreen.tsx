import { makeStyles } from '@rneui/themed';
import React from 'react';
import { Linking, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from 'components/Text';

export const SupportScreen = () => {
  const styles = useStyles();

  const handleEmailLink = async () => {
    await Linking.openURL('mailto:help@bertieapp.com');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text kind="bigHeader" text="Bertie Support" />

          <View style={styles.content}>
            <Text
              kind="paragraph"
              text="To use Bertie, start by downloading the app and signing up. You can then use the bottom sheet to:"
            />

            <View style={styles.bulletList}>
              <Text
                kind="paragraph"
                text="• View and update your reading list"
              />
              <Text
                kind="paragraph"
                text="• Discover bookshops and new books to read"
              />
              <Text kind="paragraph" text="• Place an order" />
            </View>

            <Text
              kind="paragraph"
              text="To add books to your list, go to My list, and tap at the bar at the top of the page (the one that says + Search for a book). You can add books to your list by tapping the plus button next to the results, or by opening a book and then tapping Add to list."
            />

            <Text
              kind="paragraph"
              text="To order a book, tap Order in the bottom sheet. Note that you will need to add your address and have saved at least one bookstore in your favourites to place an order."
            />

            <View style={styles.emailSection}>
              <Text
                kind="paragraph"
                text="If you require more help, you can email us at help@bertieapp.com, or click on the button below."
              />
              <Text
                kind="button"
                text="Contact Support"
                onPress={handleEmailLink}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    gap: 20,
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
    width: '100%',
  },
  content: {
    gap: 20,
  },
  bulletList: {
    gap: 8,
    paddingLeft: 20,
  },
  emailSection: {
    gap: 10,
  },
}));
