import "dotenv/config";
import App from ".";
const app = new App();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

app.start(PORT);
