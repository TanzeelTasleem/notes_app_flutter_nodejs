import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";

// Connect to the database
connectDB();

// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
