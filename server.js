import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();

app.get("/ipo-gmp.json", async (req, res) => {
  try {
    const response = await fetch("https://www.ipowatch.in/p/ipo-grey-market-premium-latest.html");
    const html = await response.text();
    const $ = cheerio.load(html);

    let data = [];

    $("table").first().find("tbody tr").each((_, row) => {
      const cols = $(row).find("td").map((_, td) => $(td).text().trim()).get();
      if (cols.length >= 5) {
        data.push({
          name: cols[0],
          issuePrice: cols[1],
          gmp: cols[2],
          expectedPrice: cols[3],
          gain: cols[4]
        });
      }
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch GMP data" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
