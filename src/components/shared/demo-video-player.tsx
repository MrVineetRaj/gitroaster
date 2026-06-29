"use client";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";
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
    <div className="relative mx-auto w-full max-w-4xl rounded-2xl border bg-card/70 p-1.5 shadow-2xl shadow-primary/5 backdrop-blur-sm">
      <div className="relative z-10 overflow-hidden rounded-xl">
        <video
          ref={videoRef}
          src="/demo/gitroaster_walkthrough.mp4"
          controls={false}
          className="h-full w-full rounded-xl object-cover"
          autoPlay
          muted={isVideoMuted}
          loop
        />
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl transition-colors hover:bg-foreground/10"
          onMouseEnter={() => setIsVolumeControlVisible(true)}
          onMouseLeave={() => setIsVolumeControlVisible(false)}
        >
          {isVolumeControlVisible && (
            <button
              className="rounded-full bg-background/70 p-4 text-foreground shadow-lg backdrop-blur-sm transition hover:bg-background/90"
              onClick={toggleMute}
              aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
            >
              {isVideoMuted ? (
                <VolumeOffIcon className="size-12" />
              ) : (
                <Volume2Icon className="size-12" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
