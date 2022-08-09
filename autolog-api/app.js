/**
 * Main component of express pipeline
 */

/**
 * Imports
 */

//libraries
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { NotFoundError } = require("./utils/errors");
const security = require("./middleware/security");
const authRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
const categoryRoutes = require("./routes/category");
const inventoryRoutes = require("./routes/inventory");
const memberRoutes = require("./routes/member");
const rolesRoutes = require("./routes/role")
const performanceRoutes = require("./routes/performance");
const dashboardRoutes = require("./routes/dashboard");
const logRoutes = require("./routes/log");
const confirmationRoutes = require('./routes/confirmation');
const invoiceRoutes = require('./routes/invoice');

/**
 * End of imports
 */

// initialize express app
const app = express();

// display minimal output
app.use(morgan("tiny"));

// parse JSON bodies
app.use(express.json());

// Use Cross Origin Requests
app.use(cors());

// extract token to obtain payload information of user
app.use(security.extractUserFromJwt);

/**
 * Application routes
 */

app.use("/auth", authRoutes);
app.use("/confirmation", confirmationRoutes);
app.use("/item", itemRoutes);
app.use("/category", categoryRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/inventory/member", memberRoutes);
app.use("/inventory/roles", rolesRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/performance", performanceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/logs", logRoutes);


// health check
app.get("/", (req, res, next) => {
  try {
    res.status(200).json({ ping: "pong" });
  } catch (error) {
    next(error);
  }
});

/**
 * End of application routes
 */

// 404 error handling
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// generic error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
