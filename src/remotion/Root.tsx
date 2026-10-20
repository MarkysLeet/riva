import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={MainVideo}
        durationInFrames={450} // 15 seconds * 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
