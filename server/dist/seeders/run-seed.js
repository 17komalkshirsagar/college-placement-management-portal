import mongoose from 'mongoose';
import { seedComprehensiveData } from './comprehensive.seeder.js';
seedComprehensiveData()
    .then(async () => {
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log('Seed process finished');
    process.exit(0);
})
    .catch(async () => {
    await mongoose.connection.close();
    process.exit(1);
});
