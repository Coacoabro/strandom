import { promises as fs } from "fs";
import { useRouter } from "next/router";
import path from "path";

export default async function handler(req, res) {

    const { board } = req.query

    console.log(req.query)

        
    const filePath = path.join(process.cwd(), "public", "boards", `${board}.json`);
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);

    res.status(200).json(data);


}

// const { genre } = req.query;
// const { timezone } = req.body

// const date = new Intl.DateTimeFormat('en-CA', {
//     timeZone: timezone,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit'
// }).format(new Date()).replace(/-/g, '');

// const url = `https://d35lwzawlg3izy.cloudfront.net/data/${genre}/${date}.json`;

// if (genre == "test") {
//     const filePath = path.join(process.cwd(), "public", "boards", "20250802.json");
//     const fileContents = await fs.readFile(filePath, "utf8");
//     const data = JSON.parse(fileContents);

//     res.status(200).json(data);
        
// }

// else if (genre == "jake") {
//     const response = await fetch(`https://d35lwzawlg3izy.cloudfront.net/data/jake/gay.json`)
//     const data = await response.json();
//     res.status(200).json(data);
// }

// else{
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(404).json({ error: "Puzzle not found." });
//     }
// }