import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View } from 'react-native';

import { translations } from 'locales/translations';

import Button from '../Button';
import Text from '../Text';

interface AuthGateModalProps {
    visible: boolean;
    message: string;
    onDismiss: () => void;
    onSignUp: () => void;
}

const AuthGateModal = ({
    visible,
    message,
    onDismiss,
    onSignUp,
}: AuthGateModalProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text kind="header" text={t(translations.authGate.title)} />
                    <Text kind="paragraph" text={message} />
                    <View style={styles.buttons}>
                        <Button
                            kind="primary"
                            text={t(translations.authGate.signUp)}
                            onPress={onSignUp}
                        />
                        <Button
                            kind="tertiary"
                            text={t(translations.authGate.cancel)}
                            onPress={onDismiss}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const useStyles = makeStyles(theme => ({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        gap: 16,
    },
    buttons: {
        gap: 10,
        marginTop: 8,
    },
}));

export default AuthGateModal;
