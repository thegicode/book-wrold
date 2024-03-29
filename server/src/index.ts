import express from "express";
import { isProduction, finalBuildPath, PORT } from "./config";
import watchAndCopyAssets from "./scripts/watchAndCopyAssets";
import apiRoutes from "./routes/apiRoutes";
import staticRoutes from "./routes/staticRoutes";

const app = express();

app.use(express.static(finalBuildPath));

apiRoutes(app);
staticRoutes(app);

watchAndCopyAssets();

console.log("***[Server]*** isProduction: ", isProduction);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
