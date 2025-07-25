import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {

    const { genre } = req.query;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // const date = `${yyyy}${mm}${dd}`;
    const date = `20250721`

    const url = `https://d35lwzawlg3izy.cloudfront.net/data/${genre}/${date}.json`;

    if (genre == "test") {
        const filePath = path.join(process.cwd(), "public", "boards", "killers.json");
        const fileContents = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(fileContents);

        res.status(200).json(data);
            
    }

    else if (genre == "jake") {
        const response = await fetch(`https://d35lwzawlg3izy.cloudfront.net/data/jake/gay.json`)
        const data = await response.json();
        res.status(200).json(data);
    }

    else{
        try {
            const response = await fetch(url);
            const data = await response.json();
            res.status(200).json(data);
        } catch (err) {
            res.status(404).json({ error: "Puzzle not found." });
        }
    }


}
