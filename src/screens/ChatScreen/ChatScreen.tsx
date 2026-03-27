import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    View,
} from 'react-native';
import { makeStyles } from '@rneui/themed';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'components/Icon';
import Input from 'components/Input';
import Text from 'components/Text';

import { useMessagesQuery, useSendMessageMutation } from 'api/app/penpals';
import { Message } from 'api/app/penpals/queries/useMessagesQuery';
import { auth } from 'api/firebase';

import { DISCOVER_ROUTES } from 'navigation/routes';
import type { DiscoverNavigatorParamList } from 'navigation/types';

import { translations } from 'locales/translations';

type ChatScreenRouteProp = RouteProp<
    DiscoverNavigatorParamList,
    typeof DISCOVER_ROUTES.DISCOVER_04_CHAT
>;

export const ChatScreen = () => {
    const styles = useStyles();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { params } = useRoute<ChatScreenRouteProp>();
    const { conversationId, recipientName } = params;

    const { data: messages = [], isLoading } = useMessagesQuery(conversationId);
    const { mutate: sendMessage, isPending } = useSendMessageMutation();

    const [text, setText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        // Auto-scroll when new messages arrive
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || isPending) return;

        sendMessage({ conversationId, text: trimmed });
        setText('');
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.senderId === userId;
        return (
            <View
                style={[
                    styles.messageBubble,
                    isMine ? styles.myMessage : styles.theirMessage,
                ]}
            >
                <Text kind="paragraph" text={item.text} color={isMine ? 'white' : undefined} />
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={insets.top}
        >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon icon="left" />
                </Pressable>
                <Text kind="header" text={recipientName} />
                <View style={styles.backButton} />
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: false })
                }
            />

            {/* Input */}
            <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.inputWrapper}>
                    <Input
                        value={text}
                        onChangeText={setText}
                        placeholder={t(translations.penpals.chat.placeholder)}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                        marginTop={0}
                    />
                </View>
                <Pressable
                    onPress={handleSend}
                    disabled={!text.trim() || isPending}
                    style={[styles.sendButton, (!text.trim() || isPending) && styles.sendDisabled]}
                >
                    <Icon icon="right" color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const useStyles = makeStyles(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey0,
    },
    backButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    messagesContent: {
        padding: 20,
        gap: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.grey0,
        borderBottomLeftRadius: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.grey0,
        gap: 8,
    },
    inputWrapper: {
        flex: 1,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendDisabled: {
        opacity: 0.4,
    },
}));
