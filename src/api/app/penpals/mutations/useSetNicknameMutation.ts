import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';

export const useSetNicknameMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ nickname }: { nickname: string }) => {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            await updateDoc(doc(db, 'users', userId), { nickname });
            return { nickname };
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};
