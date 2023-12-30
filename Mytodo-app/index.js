/* eslint-disable */
const app = require("./app");
const express = require("express");

app.listen(3000, () => {
  try {
    console.log("server is running on port 3000");
  } catch (err) {
    console.log("error while running server");
  }
});
