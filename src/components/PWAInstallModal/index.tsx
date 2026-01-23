import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Platform, View } from 'react-native';

import Button from 'components/Button';
import Text from 'components/Text';

// @ts-ignore
import icon from '../../assets/icon.png';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onInstall: () => void;
}

const PWAInstallModal = ({ isVisible, onClose, onInstall }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();

  if (Platform.OS !== 'web') {
    return null;
  }

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
          <Text kind="header" text={t('pwa.installTitle', 'Install Bertie')} />
          <Text
            kind="paragraph"
            text={t(
              'pwa.installBody',
              'Install Bertie on your home screen for quick and easy access when you need it.',
            )}
            style={styles.text}
          />

          <View style={styles.buttonContainer}>
            <Button
              kind="primary"
              text={t('pwa.installButton', 'Install')}
              onPress={onInstall}
            />
            <Button
              kind="tertiary"
              text={t('common.maybeLater', 'Maybe later')}
              onPress={onClose}
            />
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
