import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

import { Avatar as RNEAvatar } from "@rneui/themed";

import { AuthContext } from "../../api/auth/AuthProvider";

interface AvatarProps {
  onPress?(): void;
}

const Avatar = ({ onPress }: AvatarProps) => {
  const [userInitials, setUserInitials] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const json = await firestore().collection("users").doc(user.uid).get();
    setUserInitials(
      json.data().givenName.charAt(0) + json.data().familyName.charAt(0)
    );
  };

  const avatarURL = user.photoURL && user.photoURL;

  return (
    <RNEAvatar
      title={!avatarURL && userInitials}
      source={avatarURL && { uri: avatarURL }}
      rounded
      size={44}
      containerStyle={{ backgroundColor: "#6E78D7" }}
      onPress={onPress}
    />
  );
};

export default Avatar;
