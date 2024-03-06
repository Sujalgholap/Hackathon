import React, { useEffect, useLayoutEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div className="w-1/2 h-[400px]">
      Uid: {user.uid}
      <div ref={ref} className="w-full h-full"></div>
    </div>
  );
};
