declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";

  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  import { ImageRequireSource } from "react-native";
  const source: ImageRequireSource;
  export default source;
}

declare module "@env" {
  export const REACT_APP_GOOGLE_PLACES_API_KEY: string;
}
