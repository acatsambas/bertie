import { Avatar as RNEAvatar } from '@rneui/themed';
import React, { useContext } from 'react';

import { useUser } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';

interface AvatarProps {
  onPress?(): void;
}

const Avatar = ({ onPress }: AvatarProps) => {
  const { user } = useContext(AuthContext);
  const userData = useUser();

  return (
    <RNEAvatar
      title={
        !user.photoURL &&
        `${userData?.givenName?.charAt(0) || ''}${userData?.familyName?.charAt(0) || ''}`
      }
      source={user.photoURL && { uri: user.photoURL }}
      rounded
      size={44}
      containerStyle={{ backgroundColor: '#6E78D7' }}
      onPress={onPress}
    />
  );
};

export default Avatar;
