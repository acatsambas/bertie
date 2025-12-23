import { makeStyles } from '@rneui/themed';
import React from 'react';
import { Linking, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from 'components/Text';

export const DataRequestScreen = () => {
  const styles = useStyles();

  const handleEmailLink = async () => {
    await Linking.openURL(
      'mailto:help@bertieapp.com?subject=Request Account Deletion',
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text kind="bigHeader" text="Bertie Data Request" />

          <View style={styles.poem}>
            <Text
              kind="paragraph"
              text="Nothing beside remains. Round the decay"
            />
            <Text
              kind="paragraph"
              text="Of that colossal Wreck, boundless and bare"
            />
            <Text
              kind="paragraph"
              text="The lone and level sands stretch far away."
            />
          </View>

          <View style={styles.content}>
            <Text
              kind="paragraph"
              text="If you wish to delete your account data, please follow these steps:"
            />

            <View style={styles.steps}>
              <Text kind="paragraph" text="1. Log into the app" />
              <Text
                kind="paragraph"
                text="2. Tap on your profile icon at the top right"
              />
              <Text kind="paragraph" text="3. Tap 'Delete Account'" />
              <Text kind="paragraph" text="4. Type begone! in the text box" />
              <Text kind="paragraph" text="5. Tap Delete account" />
            </View>

            <Text
              kind="paragraph"
              text="Please note that this will delete all the data we hold for you, including your reading list. We won't be able to retrieve this data for you if you wish to reinstate your account."
            />

            <View style={styles.emailSection}>
              <Text
                kind="paragraph"
                text="You can also delete your account by emailing us here:"
              />
              <Text
                kind="button"
                text="Request Account Deletion via Email"
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
  poem: {
    gap: 8,
    fontStyle: 'italic',
  },
  content: {
    gap: 20,
  },
  steps: {
    gap: 8,
    paddingLeft: 20,
  },
  emailSection: {
    gap: 10,
  },
}));
