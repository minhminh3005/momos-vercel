import {Client} from "@notionhq/client";
import {HttpsProxyAgent} from "https-proxy-agent";
import {Response, Request} from "express";
require("dotenv").config();
const cors = require('cors');
const express = require("express");
const proxyUrl = 'http://LUM5HC:FreakyZ3005!997!!@rb-proxy-unix-apac.bosch.com:8080/';
const agent = new HttpsProxyAgent(proxyUrl);
const app = express();
app.use(cors());

// app.use('/proxy', proxy('http://localhost:8000/database', {
//     proxyReqPathResolver: function(req: any) {
//         const requestedUrl = `${req.protocol}://${req.get('Host')}${req.url}`
//         const modifiedURL = (requestedUrl)
//         return require('url').parse(modifiedURL).path;
//     }
// }))
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

// Notion SDK for JavaScript
const notion = new Client({auth: process.env.NOTION_SECRET, agent});

// <http://expressjs.com/en/starter/static-files.html>
app.use(express.static("public"));
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// <http://expressjs.com/en/starter/basic-routing.html>
app.post("/database", async function (request: any, response: any) {

    try {
// Notion API request!
        const newDb = await notion.databases.query({
            database_id: notionDatabaseId ?? '',
        });
        response.writeHead(200);
        response.json({message: "success!", data: newDb});
    } catch (error) {
        response.json({message: "error", error});
    }
});

// listen for requests
const listener = app.listen(8000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});


// // Will provide an error to users who forget to create the .env file
// // with their Notion data in it
// if (!notionDatabaseId || !notionSecret) {
//     throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
// }
//
// // Initializing the Notion client with your secret
// const notion = new Client({
//     auth: notionSecret,
// });
//
// const host = "localhost";
// const port = 8000;
//
// // Require an async function here to support await with the DB query
// const server = http.createServer(async (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//
//     switch (req.url) {
//         case "/":
//             // Query the database and wait for the result
//             const query = await notion.databases.query({
//                 database_id: notionDatabaseId,
//             });
//
//             // We map over the complex shape of the results and return a nice clean array of
//             // objects in the shape of our `ThingToLearn` interface
//             const list: ThingToLearn[] = query.results.map((row) => {
//                 // row represents a row in our database and the name of the column is the
//                 // way to reference the data in that column
//                 const labelCell = row.properties.label;
//                 const urlCell = row.properties.url;
//
//                 // Depending on the column "type" we selected in Notion there will be different
//                 // data available to us (URL vs Date vs text for example) so in order for Typescript
//                 // to safely infer we have to check the `type` value.  We had one text and one url column.
//                 const isLabel = labelCell.type === "rich_text";
//                 const isUrl = urlCell.type === "url";
//
//                 // Verify the types are correct
//                 if (isLabel && isUrl) {
//                     // Pull the string values of the cells off the column data
//                     const label = labelCell.rich_text?.[0].plain_text;
//                     const url = urlCell.url ?? "";
//
//                     // Return it in our `ThingToLearn` shape
//                     return { label, url };
//                 }
//
//                 // If a row is found that does not match the rules we checked it will still return in the
//                 // the expected shape but with a NOT_FOUND label
//                 return { label: "NOT_FOUND", url: "" };
//             });
//
//             res.setHeader("Content-Type", "application/json");
//             res.writeHead(200);
//             res.end(JSON.stringify(list));
//             break;
//
//         default:
//             res.setHeader("Content-Type", "application/json");
//             res.writeHead(404);
//             res.end(JSON.stringify({ error: "Resource not found" }));
//     }
// });
//
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });
