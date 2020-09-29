// const express = require("express");
// const epsagon = require("../../../src/index");
const BunnyBus = require("@tenna-llc/bunnybus");
var axios = require("axios");
require("log-timestamp");

// const yargs = require("yargs");

var myArgs = process.argv.slice(2);

const bunnyBus = new BunnyBus({
  // hostname: "localhost",
  hostname: "fat-coral.rmq.cloudamqp.com",
  port: 5672,
  password: "6GpPOPXCjVVLlgcnA_nmuYm2DNj3U57c",
  username: "ehqhhctv",
  vhost: "ehqhhctv",
  prefetch: 100,
});

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

async function publishMessage() {
  try {
    bunnyBus.publish({
      message: {
        event: "create-event",
        options: { routeKey: "queue1" },
        message: "Test message",
      },
    });
    console.log("published message");
  } catch (err) {
    console.log("failed to publish", err);
  }
}

const operation = myArgs[0];
const rate = myArgs[1];
const period = myArgs[2];
const epsagon = myArgs[3];

if (operation == "publish" && rate && period) {
  // const promises = Array.apply(null, Array(rate)).map(function () {
  //   return publishMessage();
  // });
  setInterval(async () => {
    await Promise.all([
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
      publishMessage(),
    ]);

    console.log("batch published");
  }, period);
} else if (operation === "subscribe") {
  if (epsagon) {
    const epsagon = require("epsagon-frameworks");
    epsagon.init({
      token: process.env.EPSAGON_TOKEN,
      appName: "itay-bunnybus-test",
      metadataOnly: false,
    });
  }

  try {
    bunnyBus.subscribe({
      queue: "queue1",
      handlers: {
        "create-event": async ({ message, ack, epsagon }) => {
          // await sleep(200);
          if (epsagon) {
            epsagon.label("testKey", "testValue");
          }
          console.log("message consumed");
          await axios.get("http://www.google.com");
          await axios.get("http://www.google.com");

          await ack();
        },
      },
    });
  } catch (err) {
    console.log("failed to subscribe", err);
  }
}