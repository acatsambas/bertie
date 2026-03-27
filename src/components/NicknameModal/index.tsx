import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';
import Button from 'components/Button';
import Input from 'components/Input';

import { translations } from 'locales/translations';

interface NicknameModalProps {
    visible: boolean;
    onSubmit: (nickname: string) => void;
    onClose: () => void;
}

const NicknameModal = ({ visible, onSubmit, onClose }: NicknameModalProps) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleContinue = () => {
        const trimmed = nickname.trim();
        if (trimmed.length < 2) {
            setError(t(translations.penpals.nickname.tooShort));
            return;
        }
        if (trimmed.length > 30) {
            setError(t(translations.penpals.nickname.tooLong));
            return;
        }
        setError('');
        onSubmit(trimmed);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
                    <Text kind="header" text={t(translations.penpals.nickname.title)} />
                    <Input
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder={t(translations.penpals.nickname.placeholder)}
                        marginTop={0}
                    />
                    <Text
                        kind="description"
                        text={t(translations.penpals.nickname.helper)}
                        style={{ fontStyle: 'italic' }}
                    />
                    {error ? <Text kind="description" text={error} color="red" /> : null}
                    <Button
                        kind="primary"
                        text={t(translations.penpals.nickname.continue)}
                        onPress={handleContinue}
                        disabled={nickname.trim().length === 0}
                    />
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
        gap: 16,
    },
}));

export default NicknameModal;
