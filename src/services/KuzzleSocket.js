import { Kuzzle, WebSocket } from "kuzzle-sdk";

const kuzzle = new Kuzzle(
  new WebSocket(process.env.REACT_APP_KUZZLE_URL, {
    port: process.env.REACT_APP_KUZZLE_PORT,
    ssl: process.env.REACT_APP_KUZZLE_SSL,
    autoReconnect: true,
  })
);

kuzzle.on("networkError", async (err) => {
  console.log("Listening Socket error", err);
  await kuzzle._reconnect();
});

kuzzle.on("disconnected", async (err) => {
  console.log("Listening Socket disconnected", err);
  await kuzzle._reconnect();
});

kuzzle.on("reconnected", async (err) => {
  console.log("Listening Socket reconnected", err);
});

export const kuzzleSocket = kuzzle;
