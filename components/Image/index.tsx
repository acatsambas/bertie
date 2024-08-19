import React, { useEffect, useState } from "react";
import { Image as RNEImage } from "@rneui/themed";
import DefaultImage from "./assets/default.png";
import Text from "../Text";

//TODO: Adapt to data coming from API

const Image = ({ imgSource }) => {
  return (
    <RNEImage
      defaultSource={DefaultImage}
      source={{
        uri: imgSource ? imgSource : undefined,
      }}
      style={{ height: 127, width: 350 }}
      resizeMode="cover"
      placeholderStyle={{ backgroundColor: "transparent" }}
    />
  );
};

export default Image;
