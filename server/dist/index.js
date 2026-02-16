import app from './app.js';
import { connectDatabase } from './config/database.js';
async function bootstrap() {
    await connectDatabase();
    // app.listen(env.PORT, () => {
    //   console.log(`Server running on port ${env.PORT}`);
    // });
}
bootstrap().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
});
export default app;
