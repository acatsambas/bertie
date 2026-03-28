import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addDoc,
    collection,
    doc,
    getDoc,
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

            // Send email notification to recipient
            try {
                const convoDoc = await getDoc(doc(db, 'conversations', conversationId));
                const convoData = convoDoc.data();
                if (convoData) {
                    const recipientId = convoData.participants.find(
                        (p: string) => p !== userId,
                    );
                    if (recipientId) {
                        const [senderDoc, recipientDoc] = await Promise.all([
                            getDoc(doc(db, 'users', userId)),
                            getDoc(doc(db, 'users', recipientId)),
                        ]);
                        const senderData = senderDoc.data();
                        const recipientData = recipientDoc.data();
                        const senderNickname = senderData?.nickname || 'A mystery penpal';
                        const recipientEmail = recipientData?.contactEmail || recipientData?.email;

                        if (recipientEmail) {
                            await addDoc(collection(db, 'mail'), {
                                from: {
                                    name: 'Bertie',
                                    address: 'acatsambas@bertieapp.com',
                                },
                                to: [recipientEmail],
                                message: {
                                    subject: 'You have a new DM!',
                                    text: `${senderNickname} has sent you a message on Bertie. Head to the Discovery tab in www.bertieapp.com to see it.`,
                                },
                            });
                        }
                    }
                }
            } catch {
                // Email notification is best-effort; don't fail the message send
            }
        },
        onSuccess: (_, { conversationId }) => {
            void queryClient.invalidateQueries({
                queryKey: ['messages', conversationId],
            });
            void queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};
