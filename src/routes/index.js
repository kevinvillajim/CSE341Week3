const express = require("express");
const router = express.Router();
const itemsRouter = require("./itemsRouter");
const usersRouter = require("./usersRouter");

// Forward all requests to the appropriate router
router.use("/", itemsRouter);
router.use("/", usersRouter);

module.exports = router;
