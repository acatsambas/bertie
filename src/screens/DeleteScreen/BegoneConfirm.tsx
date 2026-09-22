import { makeStyles, useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, View } from 'react-native';

import Input from 'components/Input';

type BegoneConfirmProps = {
  phrase: string;
  value: string;
  placeholder: string;
  matched: boolean;
  onChangeText: (value: string) => void;
};

export const BegoneConfirm = ({
  phrase,
  value,
  placeholder,
  matched,
  onChangeText,
}: BegoneConfirmProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const ink = useRef(new Animated.Value(matched ? 1 : 0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    Animated.timing(ink, {
      toValue: matched ? 1 : 0,
      duration: reduceMotion ? 0 : 280,
      useNativeDriver: false,
    }).start();
  }, [ink, matched, reduceMotion]);

  const phraseColor = ink.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.secondary, theme.colors.primary],
  });

  const ruleColor = ink.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.grey0, theme.colors.primary],
  });

  return (
    <View style={styles.panel} accessibilityLabel={phrase}>
      <Animated.View style={[styles.rule, { backgroundColor: ruleColor }]} />
      <Animated.Text style={[styles.phrase, { color: phraseColor }]}>
        {phrase}
      </Animated.Text>
      <Animated.View style={[styles.rule, { backgroundColor: ruleColor }]} />
      <Input
        marginTop={0}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        accessibilityLabel={placeholder}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  panel: {
    gap: 18,
    paddingVertical: 8,
  },
  rule: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.grey0,
  },
  phrase: {
    fontFamily: 'GoudyBookletter1911_400Regular',
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
}));
