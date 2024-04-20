import { Image } from "@rneui/themed";

export interface IllustrationProps {
  size?: "small" | "regular" | "large";
}

const Illustration = ({ size = "regular" }: IllustrationProps) => {
  return <Image />;
};

export default Illustration;
