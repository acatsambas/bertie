import React from "react";
import { Image as RNEImage } from "@rneui/themed";
import DefaultImage from "./assets/default.png";

//TODO: Adapt to data coming from API

const Image = ({ imgSource }) => {
  return (
    <RNEImage
      source={{ uri: imgSource ? imgSource : DefaultImage }}
      containerStyle={{ height: 127, width: 350 }}
    />
  );
};

export default Image;
