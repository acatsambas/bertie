import { useQuery } from '@tanstack/react-query';
import {
    collection,
    getDocs,
    orderBy,
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
                orderBy('lastMessageAt', 'desc'),
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Conversation[];
        },
        enabled: !!userId,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
