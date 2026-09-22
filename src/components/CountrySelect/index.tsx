import { makeStyles, useTheme } from '@rneui/themed';
import { getAllCountries } from 'postal-code-checker';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Platform, Pressable } from 'react-native';

import Icon from 'components/Icon';
import Input from 'components/Input';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { getCountryDisplayName } from 'utils/addressCountry';

const ALL_COUNTRIES = getAllCountries();

type CountrySelectProps = {
  value: string;
  onChange: (countryCode: string) => void;
  marginTop?: number;
};

const CountrySelect = ({
  value,
  onChange,
  marginTop = 0,
}: CountrySelectProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const displayName =
    getCountryDisplayName(value) ??
    t(translations.settings.address.countryPlaceholder);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(
      country =>
        country.countryName.toLowerCase().includes(q) ||
        country.countryCode.toLowerCase().includes(q),
    );
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const select = (countryCode: string) => {
    onChange(countryCode);
    close();
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityRole="button"
        accessibilityLabel={t(translations.settings.address.country)}
        style={[
          styles.trigger,
          {
            marginTop,
            borderColor: focused ? theme.colors.primary : 'transparent',
          },
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null,
        ]}
      >
        <Text
          kind="paragraph"
          text={displayName}
          color={value ? theme.colors.black : theme.colors.grey2}
          style={styles.triggerText}
        />
        <Icon icon="down" color={theme.colors.grey2} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <Text
              kind="header"
              text={t(translations.settings.address.country)}
            />
            <Input
              marginTop={0}
              kind="search"
              icon="discover"
              placeholder={t(translations.settings.address.countrySearch)}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            <FlatList
              data={filtered}
              keyExtractor={item => item.countryCode}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.countryCode === value;
                return (
                  <Pressable
                    style={[
                      styles.optionRow,
                      isSelected && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => select(item.countryCode)}
                  >
                    <Text
                      kind="paragraph"
                      text={item.countryName}
                      color={isSelected ? theme.colors.white : undefined}
                      style={styles.optionText}
                    />
                    {isSelected ? (
                      <Text
                        kind="paragraph"
                        text="●"
                        color={theme.colors.white}
                      />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  trigger: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.grey0,
    borderRadius: 14,
    borderWidth: 2,
    paddingVertical: 6,
    paddingLeft: 20,
    paddingRight: 10,
    minHeight: 52,
    gap: 10,
  },
  triggerText: {
    flex: 1,
    fontFamily: 'Commissioner_400Regular',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
    maxHeight: '85%',
  },
  list: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.greyOutline,
    marginBottom: 8,
  },
  optionText: {
    flex: 1,
  },
}));

export default CountrySelect;
