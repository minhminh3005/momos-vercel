require("dotenv").config();
import http from "http";
import { Client } from "@notionhq/client";

// This is Typescript  interface for the shape of the object we will
// create based on our database to send to the React app
// When the data is queried it will come back in a much more complicated shape, so our goal is to
// simplify it to make it easy to work with on the front end
interface ThingToLearn {
  label: string;
  url: string;
}

// The dotenv library will read from your .env file into these values on `process.env`
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initializing the Notion client with your secret
const notion = new Client({
  auth: notionSecret,
});

const host = "localhost";
const port = 8000;


// Require an async function here to support await with the DB query
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (req.url) {
    case "/database":
      // Query the database and wait for the result
      const query = await notion.databases.query({
        database_id: notionDatabaseId,
      });

      // We map over the complex shape of the results and return a nice clean array of
      // objects in the shape of our `ThingToLearn` interface


      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      const result = query.results.length ? query.results.map((result: any) => {
        const type = result.properties;
        let newValue: any = {};
        Object.entries(type).forEach(([key , value]: any) => {
            switch(value.type) {
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
                default :
                break;
            }
         
        })
        return newValue
}) : [];

      res.end(JSON.stringify(result));
      break;
      case "/": 
      res.end(`Server is running on http://${host}:${port}`)
      break;

    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});