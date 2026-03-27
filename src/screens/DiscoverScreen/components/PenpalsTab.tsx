import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';
import PenpalsInfoModal from 'components/PenpalsInfoModal';
import NicknameModal from 'components/NicknameModal';

import { useUserQuery } from 'api/app/user';
import {
    useConversationsQuery,
    useCreateConversationMutation,
    useSetNicknameMutation,
} from 'api/app/penpals';
import { decrypt } from 'api/app/penpals/encryption';
import { auth } from 'api/firebase';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export const PenpalsTab = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const { navigate } =
        useNavigation<
            StackNavigationProp<NavigationType, typeof Routes.DISCOVER_01_DISCOVER>
        >();
    const { data: user } = useUserQuery();
    const { data: conversations = [], isLoading } = useConversationsQuery();
    const { mutateAsync: createConversation, isPending: isCreating } =
        useCreateConversationMutation();
    const { mutateAsync: setNickname } = useSetNicknameMutation();

    const [infoVisible, setInfoVisible] = useState(false);
    const [nicknameVisible, setNicknameVisible] = useState(false);
    const [error, setError] = useState('');

    const userId = auth.currentUser?.uid;

    const handleSendDM = async () => {
        setError('');
        // First check if user has a nickname
        if (!user?.nickname) {
            setNicknameVisible(true);
            return;
        }
        await createConversationAndNavigate();
    };

    const handleNicknameSubmit = async (nickname: string) => {
        try {
            await setNickname({ nickname });
            setNicknameVisible(false);
            await createConversationAndNavigate();
        } catch {
            setError(t(translations.penpals.sendError));
        }
    };

    const createConversationAndNavigate = async () => {
        try {
            const result = await createConversation();
            navigate(Routes.DISCOVER_04_CHAT, {
                conversationId: result.conversationId,
                recipientName: result.recipientName,
            });
        } catch (err) {
            if (err instanceof Error && err.message === 'NO_AVAILABLE_USERS') {
                setError(t(translations.penpals.noUsers));
            } else {
                setError(t(translations.penpals.sendError));
            }
        }
    };

    const getRecipientName = (participants: string[]) => {
        const recipientId = participants.find(p => p !== userId);
        // We don't have nickname data in conversation docs, so show Mystery penpal
        // The actual name resolution happens when the conversation is opened
        return recipientId ? t(translations.penpals.mysteryPenpal) : '';
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.ctaRow}>
                <View style={styles.ctaButton}>
                    <Button
                        kind="primary"
                        text={t(translations.penpals.sendDM)}
                        onPress={handleSendDM}
                        disabled={isCreating}
                    />
                </View>
                <Pressable onPress={() => setInfoVisible(true)} style={styles.infoIcon}>
                    <Icon icon="info" />
                </Pressable>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text kind="description" text={error} color="red" />
                </View>
            ) : null}

            {conversations.length === 0 && !isLoading ? (
                <View style={styles.emptyState}>
                    <Text kind="description" text={t(translations.penpals.noConversations)} />
                </View>
            ) : (
                conversations.map(conversation => {
                    const recipientName = getRecipientName(conversation.participants);
                    const preview = conversation.lastMessage
                        ? decrypt(conversation.lastMessage)
                        : '';

                    return (
                        <Pressable
                            key={conversation.id}
                            style={styles.conversationRow}
                            onPress={() =>
                                navigate(Routes.DISCOVER_04_CHAT, {
                                    conversationId: conversation.id,
                                    recipientName,
                                })
                            }
                        >
                            <View style={styles.conversationContent}>
                                <Text kind="paragraph" text={recipientName} />
                                {preview ? (
                                    <Text
                                        kind="description"
                                        text={preview.length > 50 ? `${preview.slice(0, 50)}...` : preview}
                                    />
                                ) : null}
                            </View>
                            <Icon icon="right" />
                        </Pressable>
                    );
                })
            )}

            <PenpalsInfoModal
                visible={infoVisible}
                onClose={() => setInfoVisible(false)}
            />
            <NicknameModal
                visible={nicknameVisible}
                onSubmit={handleNicknameSubmit}
                onClose={() => setNicknameVisible(false)}
            />
        </ScrollView>
    );
};

const useStyles = makeStyles(theme => ({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    content: {
        paddingVertical: 20,
        gap: 16,
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ctaButton: {
        flex: 1,
    },
    infoIcon: {
        padding: 8,
    },
    errorContainer: {
        paddingHorizontal: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 20,
    },
    conversationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey0,
    },
    conversationContent: {
        flex: 1,
        gap: 4,
    },
}));
