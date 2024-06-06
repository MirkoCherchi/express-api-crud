const express = require("express");
const app = express();

require("dotenv").config();
const { PORT } = process.env;
const port = PORT || 3306;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
