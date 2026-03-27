import { useQuery } from '@tanstack/react-query';
import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore';

import { db } from 'api/firebase';
import { decrypt } from '../encryption';

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: Timestamp;
}

export const useMessagesQuery = (conversationId: string) => {
    return useQuery<Message[]>({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            const q = query(
                collection(db, 'conversations', conversationId, 'messages'),
                orderBy('createdAt', 'asc'),
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    senderId: data.senderId,
                    text: decrypt(data.text),
                    createdAt: data.createdAt,
                } as Message;
            });
        },
        enabled: !!conversationId,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
    });
};
