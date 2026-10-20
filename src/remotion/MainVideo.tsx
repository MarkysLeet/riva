import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-riva-base text-riva-dark">
      <Sequence from={0} durationInFrames={180}>
        <Scene1 />
      </Sequence>
      <Sequence from={180} durationInFrames={270}>
        <Scene2 />
      </Sequence>
    </AbsoluteFill>
  );
};
