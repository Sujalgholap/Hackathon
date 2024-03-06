import React, { useEffect, useState } from "react";
import AgoraRTC, { createClient } from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { videoconfig } from "../utils/videoconfig";

export const VideoRoom = () => {

  const APP_ID = videoconfig.APP_ID;
  const TOKEN = videoconfig.TOKEN;
  const CHANNEL = videoconfig.CHANNEL;

  console.log(APP_ID, TOKEN, CHANNEL);
  AgoraRTC.setLogLevel(4);

  let agoraCommandQueue = Promise.resolve();

  const createAgoraClient = ({ onVideoTrack, onUserDisconnected }) => {
    const client = createClient({
      mode: "rtc",
      codec: "vp8",
    });

    let tracks;

    const waitForConnectionState = (connectionState) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (client.connectionState === connectionState) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
    };

    const connect = async () => {
      await waitForConnectionState("DISCONNECTED");

      const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

      client.on("user-published", (user, mediaType) => {
        client.subscribe(user, mediaType).then(() => {
          if (mediaType === "video") {
            onVideoTrack(user);
          }
        });
      });

      client.on("user-left", (user) => {
        onUserDisconnected(user);
      });

      tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

      await client.publish(tracks);

      return {
        tracks,
        uid,
      };
    };

    const disconnect = async () => {
      await waitForConnectionState("CONNECTED");
      client.removeAllListeners();
      for (let track of tracks) {
        track.stop();
        track.close();
      }
      await client.unpublish(tracks);
      await client.leave();
    };

    return {
      disconnect,
      connect,
    };
  };

  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const onVideoTrack = (user) => {
      setUsers((previousUsers) => [...previousUsers, user]);
    };

    const onUserDisconnected = (user) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    };

    const { connect, disconnect } = createAgoraClient({
      onVideoTrack,
      onUserDisconnected,
    });

    const setup = async () => {
      const { tracks, uid } = await connect();
      setUid(uid);
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        },
      ]);
    };

    const cleanup = async () => {
      await disconnect();
      setUid(null);
      setUsers([]);
    };

    agoraCommandQueue = agoraCommandQueue.then(setup);

    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);

  return (
    <div className="h-full">
      <p>User Id: {uid}</p>

      <div className="flex flex-col items-center justify-center">
        <div className="w-full flex flex-1 gap-2 mt-16">
          {users.map((user) => (
            <VideoPlayer key={user.uid} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};