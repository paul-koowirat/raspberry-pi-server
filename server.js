const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

const dataFilePath = path.join(__dirname, "devicesData.json");

let devicesData = {};

// Load devices data from file on startup
if (fs.existsSync(dataFilePath)) {
  const data = fs.readFileSync(dataFilePath, "utf8");
  devicesData = JSON.parse(data);
}

// Function to save devices data to a file
function saveDataToFile() {
  fs.writeFileSync(dataFilePath, JSON.stringify(devicesData, null, 2), "utf8");
}

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Route to handle data from ESP32 devices
app.get("/data", (req, res) => {
  const {
    deviceId,
    deviceName,
    deviceLocation,
    temperature,
    humidity,
    waterLevel,
  } = req.query;

  // Initialize device data if not already present
  if (!devicesData[deviceId]) {
    devicesData[deviceId] = {
      deviceName,
      deviceLocation,
      temperature: null,
      humidity: null,
      waterLevel: null,
      enabled: true,
      timestamp: new Date(),
    };
  }

  // Update only the provided data fields
  if (temperature) devicesData[deviceId].temperature = parseFloat(temperature);
  if (humidity) devicesData[deviceId].humidity = parseFloat(humidity);
  if (waterLevel) devicesData[deviceId].waterLevel = parseFloat(waterLevel);

  devicesData[deviceId].timestamp = new Date();

  console.log(
    `Received data from ${deviceId}: ${JSON.stringify(devicesData[deviceId])}`
  );

  // Save the updated data to file
  saveDataToFile();

  res.send("Data received");
});

// Route to enable a device
app.get("/enable", (req, res) => {
  const { deviceId } = req.query;
  if (devicesData[deviceId]) {
    devicesData[deviceId].enabled = true;
    saveDataToFile();
    res.send({ message: `Device ${deviceId} enabled`, enabled: true });
  } else {
    res.status(404).send("Device not found");
  }
});

// Route to disable a device
app.get("/disable", (req, res) => {
  const { deviceId } = req.query;
  if (devicesData[deviceId]) {
    devicesData[deviceId].enabled = false;
    saveDataToFile();
    res.send({ message: `Device ${deviceId} disabled`, enabled: false });
  } else {
    res.status(404).send("Device not found");
  }
});

// Route to serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to check the status of a device
app.get("/status", (req, res) => {
  const { deviceId } = req.query;
  if (devicesData[deviceId]) {
    res.send(devicesData[deviceId].enabled ? "enabled" : "disabled");
  } else {
    res.status(404).send("Device not found");
  }
});

// Route to get devices data
app.get("/devices", (req, res) => {
  res.json(devicesData);
});

// Start the server and listen on the specified port
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
