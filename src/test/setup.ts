import { AppDataSource } from '../config/database';

beforeAll(async () => {
    // If there's an existing connection, close it first
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    
    // Initialize fresh connection
    await AppDataSource.initialize();
    
    // Drop and recreate schema
    await AppDataSource.synchronize(true);

});

beforeEach(async () => {
  // Clear tables in correct order (children first, then parents)
  const entities = AppDataSource.entityMetadatas;
  const tableNames = entities.map(entity => `"${entity.tableName}"`).join(', ');
  await AppDataSource.query(`TRUNCATE ${tableNames} CASCADE`);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  }
}); 