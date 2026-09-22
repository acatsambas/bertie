import { Avatar as RNEAvatar } from '@rneui/themed';
import React, { useContext } from 'react';

import { useUserQuery } from 'api/app/user';
import { AuthContext } from 'api/auth/AuthProvider';

interface AvatarProps {
  onPress?(): void;
  size?: number;
}

const Avatar = ({ onPress, size = 44 }: AvatarProps) => {
  const { user } = useContext(AuthContext);
  const { data: userData } = useUserQuery();

  const photoURL = user?.photoURL;
  const initials = [userData?.givenName?.[0], userData?.familyName?.[0]]
    .filter(Boolean)
    .join('');

  const showPhoto = Boolean(photoURL);
  const showInitials = !showPhoto && initials.length > 0;
  const showPlaceholder = !showPhoto && !showInitials;

  return (
    <RNEAvatar
      title={showInitials ? initials : undefined}
      icon={
        showPlaceholder
          ? { name: 'account', type: 'material-design', color: '#fff' }
          : undefined
      }
      source={showPhoto && photoURL ? { uri: photoURL } : undefined}
      rounded
      size={size}
      containerStyle={{ backgroundColor: '#6E78D7' }}
      onPress={onPress}
    />
  );
};

export default Avatar;
