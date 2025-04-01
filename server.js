const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const dotenv = require("dotenv");
const routes = require("./src/routes/itemsRouter");
const database = require("./src/config/database");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);


const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
	swaggerDocument.host = "cse341week3-gtfy.onrender.com";
	swaggerDocument.schemes = ["https"];
} else {
	swaggerDocument.host = `localhost:${PORT}`;
	swaggerDocument.schemes = ["http"];
}

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", routes);


async function startServer() {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(
        `Documentación de Swagger disponible en http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Error al iniciar el servidor", error);
  }
}

process.on("SIGINT", async () => {
  await database.close();
  process.exit(0);
});

startServer();
