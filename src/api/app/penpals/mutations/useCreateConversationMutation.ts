import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addDoc,
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';

import { auth, db } from 'api/firebase';

export interface Conversation {
    id: string;
    participants: string[];
    lastMessage: string;
    lastMessageAt: Timestamp;
    createdAt: Timestamp;
}

export const useCreateConversationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            // Get existing conversations for current user
            const convoQuery = query(
                collection(db, 'conversations'),
                where('participants', 'array-contains', userId),
            );
            const convoSnapshot = await getDocs(convoQuery);
            const existingPartnerIds = new Set<string>();
            convoSnapshot.docs.forEach(doc => {
                const data = doc.data() as Conversation;
                data.participants.forEach(p => {
                    if (p !== userId) existingPartnerIds.add(p);
                });
            });

            // Get all users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const availableUsers = usersSnapshot.docs.filter(
                doc => doc.id !== userId && !existingPartnerIds.has(doc.id),
            );

            if (availableUsers.length === 0) {
                throw new Error('NO_AVAILABLE_USERS');
            }

            // Pick random user
            const randomIndex = Math.floor(Math.random() * availableUsers.length);
            const recipientDoc = availableUsers[randomIndex];
            const recipientId = recipientDoc.id;
            const recipientData = recipientDoc.data();
            const recipientName = recipientData.nickname || 'Mystery penpal';

            // Create conversation
            const participants = [userId, recipientId].sort();
            const now = Timestamp.now();
            const convoRef = await addDoc(collection(db, 'conversations'), {
                participants,
                lastMessage: '',
                lastMessageAt: now,
                createdAt: now,
            });

            return {
                conversationId: convoRef.id,
                recipientName,
            };
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};
