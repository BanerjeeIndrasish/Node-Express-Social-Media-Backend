import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected");

        // Auto-create tables (not for production, use migrations there)
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to DB:", error);
    }
})();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
