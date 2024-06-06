const express = require("express");
const postRouter = require("./routers/posts.js");
const app = express();

require("dotenv").config();
const { PORT } = process.env;
const port = PORT || 3000;

app.use(express.json());
app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
