

export default async function handler(req, res) {

    const { genre } = req.query;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const date = `${yyyy}${mm}${dd}`;

    const url = `https://d35lwzawlg3izy.cloudfront.net/data/${genre}/${date}.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ error: "Puzzle not found." });
    }
}
