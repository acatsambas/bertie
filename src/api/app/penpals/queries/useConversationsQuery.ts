import { useQuery } from '@tanstack/react-query';
import {
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { Conversation } from '../mutations/useCreateConversationMutation';

export const useConversationsQuery = () => {
    const userId = auth.currentUser?.uid;

    return useQuery<Conversation[]>({
        queryKey: ['conversations'],
        queryFn: async () => {
            if (!userId) return [];

            const q = query(
                collection(db, 'conversations'),
                where('participants', 'array-contains', userId),
            );
            const snapshot = await getDocs(q);

            const conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Conversation[];

            // Sort by most recent message, client-side
            conversations.sort((a, b) => {
                const aTime = a.lastMessageAt?.seconds ?? 0;
                const bTime = b.lastMessageAt?.seconds ?? 0;
                return bTime - aTime;
            });

            return conversations;
        },
        enabled: !!userId,
        refetchOnMount: 'always',
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
