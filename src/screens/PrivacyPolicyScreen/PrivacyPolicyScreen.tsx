import { makeStyles } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from 'components/Text';

const PRIVACY_POLICY_URL = '/privacypolicy.html';

export const PrivacyPolicyScreen = () => {
  const styles = useStyles();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRIVACY_POLICY_URL);
        if (!response.ok) {
          throw new Error(`Failed to load privacy policy: ${response.status}`);
        }
        const html = await response.text();
        setHtmlContent(html);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load privacy policy',
        );
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeAreaView, styles.centerContent]}>
        <ActivityIndicator size="large" color="#565EAF" />
        <Text kind="paragraph" text="Loading privacy policy..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeAreaView, styles.centerContent]}>
        <View style={styles.errorContainer}>
          <Text kind="paragraph" text={`Error: ${error}`} color="red" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <RenderHtml
            contentWidth={Platform.OS === 'web' ? 800 : 300}
            source={{ html: htmlContent }}
            baseStyle={styles.htmlBase}
          />
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
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
    width: '100%',
  },
  htmlBase: {
    color: theme.colors.secondary,
    fontFamily: 'Commissioner_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  errorContainer: {
    padding: 20,
  },
}));
