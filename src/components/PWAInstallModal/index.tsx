import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Platform, View } from 'react-native';

import Button from 'components/Button';
import Text from 'components/Text';
import { translations } from 'locales/translations';

// @ts-ignore
import icon from '../../assets/icon.png';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS?: boolean;
  hasDeferredPrompt?: boolean;
}

const PWAInstallModal = ({
  isVisible,
  onClose,
  onInstall,
  isIOS,
  hasDeferredPrompt,
}: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();

  if (Platform.OS !== 'web') {
    return null;
  }

  const showManualInstructions = isIOS || !hasDeferredPrompt;
  const instructionText = isIOS
    ? t(translations.pwa.iosInstructions)
    : hasDeferredPrompt
      ? t(translations.pwa.installBody)
      : t(translations.pwa.androidInstructions);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image source={icon} style={styles.icon} />
          <Text kind="header" text={t(translations.pwa.installTitle)} />
          <Text kind="paragraph" text={instructionText} style={styles.text} />

          <View style={styles.buttonContainer}>
            {showManualInstructions ? (
              <Button
                kind="primary"
                text={t(translations.common.gotIt)}
                onPress={onClose}
              />
            ) : (
              <>
                <Button
                  kind="primary"
                  text={t(translations.pwa.installButton)}
                  onPress={onInstall}
                />
                <Button
                  kind="tertiary"
                  text={t(translations.common.maybeLater)}
                  onPress={onClose}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    maxWidth: 500,
    width: '100%',
    gap: 20,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 10,
    width: '100%',
    gap: 10,
  },
}));

export default PWAInstallModal;
