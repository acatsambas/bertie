import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addDoc,
    collection,
    doc,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { encrypt } from '../encryption';

export const useSendMessageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            conversationId,
            text,
        }: {
            conversationId: string;
            text: string;
        }) => {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const encryptedText = encrypt(text);
            const now = Timestamp.now();

            // Add message to subcollection
            await addDoc(
                collection(db, 'conversations', conversationId, 'messages'),
                {
                    senderId: userId,
                    text: encryptedText,
                    createdAt: now,
                },
            );

            // Update conversation's last message
            await updateDoc(doc(db, 'conversations', conversationId), {
                lastMessage: encryptedText,
                lastMessageAt: now,
            });
        },
        onSuccess: (_, { conversationId }) => {
            void queryClient.invalidateQueries({
                queryKey: ['messages', conversationId],
            });
            void queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};
