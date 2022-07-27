module.exports = {
  apps: [
    {
      name: "yp-bot",
      script: "./bot/dist/index.js",
    },
    {
      name: "yp-backend",
      script: "./server/dist/index.js",
    },
  ],
}
