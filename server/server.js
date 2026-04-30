import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;
connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port : http://localhost:${PORT}`);
});


