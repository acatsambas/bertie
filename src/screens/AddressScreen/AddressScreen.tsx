import { useRoute } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { format, validatePostalCode } from 'postal-code-checker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUpdateAddressMutation, useUserQuery } from 'api/app/user';
import Button from 'components/Button';
import CountrySelect from 'components/CountrySelect';
import Input from 'components/Input';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import {
  SettingsFormError,
  SettingsFormFields,
  SettingsFormIntro,
} from 'screens/SettingsScreen/SettingsForm';
import { SettingsPageShell } from 'screens/SettingsScreen/SettingsPageShell';
import {
  DEFAULT_COUNTRY_CODE,
  getCountryDisplayName,
  getPostalExample,
  getPostalFieldLabel,
  hasPostalSystem,
  resolveCountryCode,
} from 'utils/addressCountry';

type AddressFields = {
  firstLine: string;
  secondLine: string;
  city: string;
  postcode: string;
  country: string;
};

const emptyAddress = (): AddressFields => ({
  firstLine: '',
  secondLine: '',
  city: '',
  postcode: '',
  country: DEFAULT_COUNTRY_CODE,
});

export const AddressScreen = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { data: user } = useUserQuery();
  const updateAddress = useUpdateAddressMutation();
  const [address, setAddress] = useState<AddressFields>(emptyAddress);
  const [componentMounted, setComponentMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryWarning, setCountryWarning] = useState<string | null>(null);
  const [postcodeWarning, setPostcodeWarning] = useState<string | null>(null);

  const postcodeWarningFor = (country: string, postcode: string) => {
    if (
      !country ||
      !hasPostalSystem(country) ||
      !postcode.trim() ||
      validatePostalCode(country, postcode)
    ) {
      return null;
    }
    return t(translations.settings.address.warningInvalidPostcode, {
      label: getPostalFieldLabel(country).toLowerCase(),
      value: postcode.trim(),
      country: getCountryDisplayName(country) ?? country,
    });
  };

  useEffect(() => {
    if (user && !componentMounted) {
      if (user.address) {
        const storedCountry = user.address.country?.trim() ?? '';
        const resolved = storedCountry
          ? resolveCountryCode(storedCountry)
          : undefined;
        const country = storedCountry ? (resolved ?? '') : DEFAULT_COUNTRY_CODE;
        const postcode = user.address.postcode ?? '';

        setAddress({
          firstLine: user.address.firstLine ?? '',
          secondLine: user.address.secondLine ?? '',
          city: user.address.city ?? '',
          postcode,
          country,
        });

        if (storedCountry && !resolved) {
          setCountryWarning(
            t(translations.settings.address.warningUnrecognizedCountry, {
              value: storedCountry,
            }),
          );
        }

        setPostcodeWarning(postcodeWarningFor(country, postcode));
      }
      setComponentMounted(true);
    }
  }, [componentMounted, t, user]);

  const countryNeedsPostcode = hasPostalSystem(address.country);
  const postalLabel = countryNeedsPostcode
    ? getPostalFieldLabel(address.country)
    : t(translations.settings.address.postcode);
  const postalExample = countryNeedsPostcode
    ? getPostalExample(address.country)
    : undefined;
  const countryName = getCountryDisplayName(address.country) ?? address.country;

  const clearSaveError = () => setError(null);

  const handleCountryChange = (country: string) => {
    clearSaveError();
    setCountryWarning(null);
    setAddress(prev => {
      setPostcodeWarning(postcodeWarningFor(country, prev.postcode));
      return { ...prev, country };
    });
  };

  const handlePostcodeChange = (text: string) => {
    clearSaveError();
    setAddress(prev => ({ ...prev, postcode: text }));
    setPostcodeWarning(postcodeWarningFor(address.country, text));
  };

  const handleSave = async () => {
    if (!user) return;

    const firstLine = address.firstLine.trim();
    const city = address.city.trim();
    const country = address.country.trim();

    if (!country || !getCountryDisplayName(country)) {
      setError(t(translations.settings.address.validationCountry));
      return;
    }

    if (!firstLine || !city) {
      setError(t(translations.settings.address.validationRequired));
      return;
    }

    let postcode = address.postcode.trim();

    if (countryNeedsPostcode) {
      if (!postcode) {
        setError(
          t(translations.settings.address.validationPostcodeRequired, {
            label: postalLabel.toLowerCase(),
          }),
        );
        return;
      }

      if (!validatePostalCode(country, postcode)) {
        setError(
          t(translations.settings.address.validationPostcode, {
            label: postalLabel.toLowerCase(),
            country: countryName,
          }),
        );
        return;
      }

      postcode = format(country, postcode) ?? postcode.toUpperCase();
    } else {
      postcode = '';
    }

    setError(null);
    setCountryWarning(null);
    setPostcodeWarning(null);
    await updateAddress.mutateAsync({
      address: {
        firstLine,
        secondLine: address.secondLine.trim(),
        city,
        postcode,
        country,
      },
    });

    navigation.goBack();
  };

  return (
    <SettingsPageShell
      title={t(translations.settings.address.title)}
      onBack={() => goBackOrFallback(navigation, route.name)}
      footer={
        <Button
          kind="primary"
          text={t(translations.settings.address.button)}
          onPress={handleSave}
        />
      }
    >
      <SettingsFormIntro text={t(translations.settings.address.description)} />
      <SettingsFormFields>
        {countryWarning ? (
          <SettingsFormError text={countryWarning} kind="warning" />
        ) : null}
        {postcodeWarning ? (
          <SettingsFormError text={postcodeWarning} kind="warning" />
        ) : null}
        <CountrySelect value={address.country} onChange={handleCountryChange} />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.addr1)}
          onChangeText={text => {
            clearSaveError();
            setAddress({ ...address, firstLine: text });
          }}
          value={address.firstLine}
          textContentType="streetAddressLine1"
          autoComplete="address-line1"
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.addr2)}
          onChangeText={text => setAddress({ ...address, secondLine: text })}
          value={address.secondLine}
          textContentType="streetAddressLine2"
          autoComplete="address-line2"
        />
        <Input
          marginTop={0}
          placeholder={t(translations.settings.address.city)}
          onChangeText={text => {
            clearSaveError();
            setAddress({ ...address, city: text });
          }}
          value={address.city}
          textContentType="addressCity"
          autoComplete="postal-address"
        />
        {countryNeedsPostcode ? (
          <Input
            marginTop={0}
            placeholder={
              postalExample
                ? t(translations.settings.address.postcodeExample, {
                    label: postalLabel,
                    example: postalExample,
                  })
                : postalLabel
            }
            onChangeText={handlePostcodeChange}
            value={address.postcode}
            textContentType="postalCode"
            autoComplete="postal-code"
            autoCapitalize="characters"
          />
        ) : null}
        {error ? <SettingsFormError text={error} /> : null}
      </SettingsFormFields>
    </SettingsPageShell>
  );
};
