import "dotenv/config";
import express from "express";
import SingerRoutes from "./routes/singer.routes.ts";
import mongoose from "mongoose";
import cors from "cors";
import CountryRoutes from "./routes/country.routes.ts";
import seedCountries from "./seeder/country.seeder.ts";
import UserRoutes from "./routes/user.routes.ts";
import SongRoutes from "./routes/song.routes.ts";
import SongLikeRoutes from "./routes/song-like.routes.ts";

const PORT = process.env.PORT || 4000;

const app = express();

await mongoose.connect(process.env.MONGO_URI ?? "");
// Run seeder
await seedCountries();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", new UserRoutes().router);
app.use("/api/v1/singer", new SingerRoutes().router);
app.use("/api/v1/country", new CountryRoutes().router);
app.use("/api/v1/song", new SongRoutes().router);
app.use("/api/v1/song-like", new SongLikeRoutes().router);

app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
