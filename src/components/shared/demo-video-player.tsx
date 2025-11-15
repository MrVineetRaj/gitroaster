"use client";
import {
  Volume1Icon,
  Volume2Icon,
  VolumeIcon,
  VolumeOffIcon,
} from "lucide-react";
import React from "react";

export const DemoVideoPlayer = () => {
  const [isVideoMuted, setIsVideoMuted] = React.useState(true);
  const [isVolumeControlVisible, setIsVolumeControlVisible] =
    React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isVideoMuted;
      setIsVideoMuted(newMutedState);

      if (!newMutedState) {
        // When unmuting, set volume to 60%
        videoRef.current.volume = 0.4;
      }
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto border-primary border-2 rounded-md">
      <div className="relative z-10 flex flex-col items-center gap-4 text-white">
        <video
          ref={videoRef}
          src="/demo/gitroaster_walkthrough.mp4"
          controls={false}
          className="w-full h-full object-cover rounded-xl"
          autoPlay
          muted={isVideoMuted}
          loop
        />
        <div
          className="absolute top-0 left-0 w-full h-full rounded-xl  flex items-center justify-center "
          onMouseEnter={() => setIsVolumeControlVisible(true)}
          onMouseLeave={() => setIsVolumeControlVisible(false)}
        >
          {isVolumeControlVisible && (
            <button
              className=" bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75 transition "
              onClick={toggleMute}
            >
              {isVideoMuted ? (
                <VolumeOffIcon className="w-20 h-20" />
              ) : (
                <Volume2Icon className="w-20 h-20" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
