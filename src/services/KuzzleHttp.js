import { Kuzzle, Http } from "kuzzle-sdk";

const httpClient = new Http(process.env.REACT_APP_KUZZLE_URL, {
  port: process.env.REACT_APP_KUZZLE_PORT,
  ssl: process.env.REACT_APP_KUZZLE_SSL,
});
const kuzzle = new Kuzzle(httpClient);

kuzzle.on("networkError", async (err) => {
  console.log("Listening HTTP error", err);
  await kuzzle._reconnect();
});

kuzzle.on("disconnected", async (err) => {
  console.log("Listening HTTP disconnected", err);
  await kuzzle._reconnect();
});

kuzzle.on("reconnected", async (err) => {
  console.log("Listening HTTP reconnected", err);
});

export const kuzzleHttp = kuzzle;
