import http from "http";    
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log("PORT", process.env.PORT);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT;

console.log(__dirname);

const app = express();
const filePath = "earthquake.json";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const readEarthquakeData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return { earthquake: [] };
  }
};


const writeEarthquakeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};



app.get("/api/v1/earthquake", (req, res) => {
  const data = readEarthquakeData();
  res.status(200).json({
    statusCode: 200,
    data,
    message: "Earthquake data fetched successfully",
  });
});


app.get("/api/v1/earthquake/search", (req, res) => {
  const query = req.query.q;
  const data = readEarthquakeData();
  
  const filteredEarthquakes = data.earthquake.filter((eq) =>
    eq.location.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredEarthquakes.length > 0) {
    res.status(200).json({
      statusCode: 200,
      data: { earthquake: filteredEarthquakes },
      message: "Earthquake data fetched successfully",
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      message: "No earthquake data found",
    });
  }
});



app.post("/api/v1/earthquake", (req, res) => {
  const newEarthquake = req.body;
  const data = readEarthquakeData();
  
  newEarthquake.id = Date.now(); 
  data.earthquake.push(newEarthquake);
  
  writeEarthquakeData(data);

  console.log("New earthquake added:", data);

  res.status(201).json({
    statusCode: 201,
    data: newEarthquake,
    message: "Earthquake data added successfully",
  });
});

// PATCH - Edit
app.patch("/api/v1/earthquake/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const data = readEarthquakeData();
  
  const index = data.earthquake.findIndex((eq) => eq.id == id);
  if (index === -1) {
    return res.status(404).json({
      statusCode: 404,
      message: "Earthquake not found",
    });
  }

  data.earthquake[index] = { ...data.earthquake[index], ...updates };
  writeEarthquakeData(data);

  res.status(200).json({
    statusCode: 200,
    data: data.earthquake[index],
    message: "Earthquake data updated successfully",
  });
});

// DELETE - Remove
app.delete("/api/v1/earthquake/:id", (req, res) => {
  const { id } = req.params;
  const data = readEarthquakeData();
  
  const filteredEarthquakes = data.earthquake.filter((eq) => eq.id != id);
  if (filteredEarthquakes.length === data.earthquake.length) {
    return res.status(404).json({
      statusCode: 404,
      message: "Earthquake not found",
    });
  }

  data.earthquake = filteredEarthquakes;
  writeEarthquakeData(data);

  res.status(200).json({
    statusCode: 200,
    message: "Earthquake data deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
