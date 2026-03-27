import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';
import Button from 'components/Button';

import { translations } from 'locales/translations';

interface PenpalsInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

const PenpalsInfoModal = ({ visible, onClose }: PenpalsInfoModalProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
                    <Text kind="header" text={t(translations.penpals.info.title)} />
                    <View style={styles.lines}>
                        <Text kind="paragraph" text={t(translations.penpals.info.line1)} />
                        <Text kind="paragraph" text={t(translations.penpals.info.line2)} />
                        <Text kind="paragraph" text={t(translations.penpals.info.line3)} />
                        <Text kind="description" text={t(translations.penpals.info.line4)} style={{ fontStyle: 'italic' }} />
                    </View>
                    <Button kind="primary" text={t(translations.penpals.info.close)} onPress={onClose} />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const useStyles = makeStyles(theme => ({
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
        gap: 20,
    },
    lines: {
        gap: 12,
    },
}));

export default PenpalsInfoModal;
