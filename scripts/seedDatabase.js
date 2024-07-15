import 'dotenv/config'; // Ensure dotenv is configured to load .env
import upperFirst from 'lodash/upperFirst.js';
import cliTable from 'cli-table3';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import Spinner from './utils/Spinner.js'; // Correct import statement

// Import your models
import Quotes from '../src/models/Quotes.js';
import Authors from '../src/models/Authors.js';
import Tags from '../src/models/Tags.js';

/** Parses and validates CLI arguments */
function parseArgs() {
  const args = process.argv.slice(2);
  const DIR = args[0] && path.join(process.cwd(), args[0]);
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  if (!DIR) {
    throw new Error('Missing argument `<dir>`');
  }
  // Make sure the directory exists
  if (!fs.existsSync(DIR)) {
    throw new Error(`Data directory does not exist:\n${DIR}`);
  }
  // Make sure the directory contains JSON files
  if (!fs.readdirSync(DIR).filter(file => file.endsWith('.json')).length) {
    throw new Error(`Data directory does not contain JSON files\n${DIR}`);
  }
  return { DIR, MONGODB_URI };
}

async function seedDatabase(DIR, MONGODB_URI) {
  const spinner = new Spinner();
  spinner.start('Seeding database...');

  const client = new MongoClient(MONGODB_URI); // No options

  try {
    await client.connect();
    const database = client.db('Quotable'); // Use the correct database name

    const files = fs.readdirSync(DIR).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const collectionName = path.basename(file, '.json').toLowerCase();
      const collection = database.collection(collectionName);

      console.log(`Inserting data into collection: ${collectionName}`);
      
      await collection.insertMany(data);
    }

    spinner.succeed('Database seeding completed successfully.');
  } catch (error) {
    spinner.fail('Error seeding database:');
    console.error(error);
  } finally {
    await client.close();
  }
}

// Parse arguments and seed the database
const { DIR, MONGODB_URI } = parseArgs();
seedDatabase(DIR, MONGODB_URI);