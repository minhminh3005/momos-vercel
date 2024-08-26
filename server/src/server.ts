import express, { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize a new Notion client
const notion = new Client({ auth: process.env.NOTION_SECRET });

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to set common security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
// Endpoint to fetch data from the Notion database
app.post('/database', async (req: Request, res: Response) => {
  const { command } = req.body;
  try {
       const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
      sorts: command?.sort?.sortBy &&command?.sort?.sortOrder ? [{
        property: command.sort.sortBy,
        direction: command.sort.sortOrder,
      }] : undefined,
    });

    // Extract and structure the data as needed
    const result = response.results.length ? response.results.map((result: any) => {
      const type = result.properties;
      let newValue: any = {};
      Object.entries(type).forEach(([key, value]: any) => {
        switch (value.type) {
          case 'people':
            newValue[key] = value?.people && value.people?.length ? value.people[0].name : '';
            break;
          case 'title':
            newValue[key] = value?.title && value.title?.length ? value.title[0].plain_text : '';
            break;
          case 'number':
            newValue[key] = value?.number ?? null;
            break;
          case 'select':
            newValue[key] = value?.select ? value?.select?.name : '';
            break;
          case 'rich_text':
            newValue[key] = value?.rich_text && value.rich_text?.length ? value.rich_text[0].plain_text : '';
            break;
          default:
            break;
        }

      })
      return newValue
    }) : [];

    res.json(result);
  } catch (error) {
    console.error('Error fetching data from Notion:', error);
    res.status(500).json({ error: 'Failed to fetch data from Notion' });
  }
});

app.get('/', function(req, res, next) {
  res.send(`Server is running on http://localhost:${port}`)
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});