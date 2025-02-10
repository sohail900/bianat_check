import { useMemo, useState, useEffect, useContext } from "react";
import { KuzzleContext } from "../App";

const credentials = {
  username: process.env.REACT_APP_KUZZLE_USERNAME,
  password: process.env.REACT_APP_KUZZLE_PASSWORD,
};

/**
 * @name kuzzleConnected
 * @description: Check if kuzzle is connected
 * @returns {boolean} true if kuzzle is connected
 *
 */
export const kuzzleConnected = () => {
  const { kuzzleHttp, kuzzleSocket } = useContext(KuzzleContext);
  const [socketConnected, setSocketConnected] = useState(false);

  const [httpConnected, setHttpConnected] = useState(false);

  useEffect(() => {
    const connectingSocket = async () => {
      await kuzzleSocket.connect();
      const auth = await kuzzleSocket.auth.login("local", credentials, -1);
      if (auth) {
        // console.log("KUZZEL SOCKET CONNECTED")
        setSocketConnected(kuzzleSocket.connected);
      }
    };

    const connectingHttp = async () => {
      await kuzzleHttp.connect();
      const auth = await kuzzleHttp.auth.login("local", credentials, -1);
      if (auth) {
        // console.log("KUZZEL HTTP CONNECTED")
        setHttpConnected(kuzzleHttp.connected);
      }
    };

    connectingHttp();
    connectingSocket();

    return () => {
      setHttpConnected(false);
      setSocketConnected(false);
    };
  }, []);

  return useMemo(
    () => socketConnected && httpConnected,
    [socketConnected, httpConnected]
  );
};
