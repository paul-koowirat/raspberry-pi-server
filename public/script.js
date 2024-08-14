// Function to toggle device status
function toggleDevice(deviceId, isEnabled) {
  const action = isEnabled ? "disable" : "enable";
  fetch(`/${action}?deviceId=${deviceId}`)
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      loadData();
    });
}

// Function to load and display data
function loadData() {
  fetch("/devices")
    .then((response) => response.json())
    .then((devicesData) => {
      const temperatureHumidityTable = document
        .getElementById("temperatureHumidityTable")
        .getElementsByTagName("tbody")[0];
      const waterLevelTable = document
        .getElementById("waterLevelTable")
        .getElementsByTagName("tbody")[0];

      // Clear existing table data
      temperatureHumidityTable.innerHTML = "";
      waterLevelTable.innerHTML = "";

      Object.keys(devicesData).forEach((deviceId) => {
        const device = devicesData[deviceId];

        if (device.deviceName === "H_T_Sensor") {
          const row = temperatureHumidityTable.insertRow();
          row.className = device.enabled ? "" : "disabled";
          row.innerHTML = `
              <td>${deviceId}</td>
              <td>${device.deviceName}</td>
              <td>${device.deviceLocation}</td>
              <td>${device.temperature ?? "N/A"}</td>
              <td>${device.humidity ?? "N/A"}</td>
              <td>${device.enabled ? "Enabled" : "Disabled"}</td>
              <td><button onclick="toggleDevice('${deviceId}', ${
            device.enabled
          })">${device.enabled ? "Disable" : "Enable"}</button></td>
              <td>${device.timestamp}</td>
            `;
        } else if (device.deviceName === "Level_Sensor") {
          const row = waterLevelTable.insertRow();
          row.className = device.enabled ? "" : "disabled";
          row.innerHTML = `
              <td>${deviceId}</td>
              <td>${device.deviceName}</td>
              <td>${device.deviceLocation}</td>
              <td>${device.waterLevel ?? "N/A"}</td>
              <td>${device.enabled ? "Enabled" : "Disabled"}</td>
              <td><button onclick="toggleDevice('${deviceId}', ${
            device.enabled
          })">${device.enabled ? "Disable" : "Enable"}</button></td>
              <td>${device.timestamp}</td>
            `;
        }
      });
    });
}

// Refresh data every 5 seconds
setInterval(loadData, 5000);

// Load data initially
loadData();
