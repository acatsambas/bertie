import React, { useContext, useState } from "react";
import { Avatar as RNEAvatar } from "@rneui/themed";
import { AuthContext } from "../../api/auth/AuthProvider";

interface AvatarProps {
  onPress?(): void;
}

//TODO: LOGIC if user have photo setup then it will show it else will show First Letters from first and last name

const Avatar = ({ onPress }: AvatarProps) => {
  const { user } = useContext(AuthContext);

  const initials =
    user.displayName &&
    user.displayName
      .match(/(\b\S)?/g)
      .join("")
      .toUpperCase();

  const avatarURL = user.photoURL && user.photoURL;

  return (
    <RNEAvatar
      title={!avatarURL && initials}
      source={avatarURL && { uri: avatarURL }}
      rounded
      size={44}
      containerStyle={{ backgroundColor: "blue" }}
      onPress={onPress}
    />
  );
};

export default Avatar;
