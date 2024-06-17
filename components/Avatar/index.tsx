import React from "react";
import { Avatar as RNEAvatar } from "@rneui/themed";

interface AvatarProps {
  onPress?(): void;
}

//TODO: LOGIC if user have photo setup then it will show it else will show First Letters from first and last name

const Avatar = ({ onPress }: AvatarProps) => {
  return (
    <RNEAvatar
      title="CM"
      rounded
      size={44}
      containerStyle={{ backgroundColor: "blue" }}
      onPress={onPress}
    />
  );
};

export default Avatar;
