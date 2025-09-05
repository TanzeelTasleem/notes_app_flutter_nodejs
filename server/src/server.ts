import app from "./app";
import config from "./config/config";
import connectDB from "./config/db";

// Connect to the database
connectDB();

// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
