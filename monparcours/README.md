<div align="center">
  <h1>📍 Trip Planner - Mon Parcours</h1>
  <p><b>A professional web application to design, manage, and visualize travel itineraries in real-time.</b></p>

  <img width="1462" height="803" alt="Screen Shot 13 05 2026 at 11 42" src="https://github.com/user-attachments/assets/c735191e-918f-449c-92a2-b66b13042916" />



  ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
  ![Leaflet](https://img.shields.io/badge/Leaflet-%23199903.svg?style=for-the-badge&logo=Leaflet&logoColor=white)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![Vitest](https://img.shields.io/badge/Vitest-%23449b45.svg?style=for-the-badge&logo=vitest&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
</div>

---

## 📝 Project Overview

**Trip Planner** is a **Single Page Application (SPA)** developed as part of the **TPI 2026**. It allows users to build custom travel routes, add detailed steps, and visualize their journey on an interactive map. The project focuses on **clean code**, **user experience (UX)**, and **local data persistence**.

---

## 🚀 Key Features

* **Interactive Map Interface:**
    * Add steps by **clicking** on the map or using the **search bar**.
    * Real-time **dynamic routing** (polyline) between all points.
* **Smart Geolocation System:**
    * **High Accuracy:** Uses `enableHighAccuracy` for GPS-level precision.
    * **Conditional UI:** The accuracy value (e.g., "150m") is displayed **only if** the margin of error is **> 150m**.
    * **Smart Fallback:** Detects **low precision (> 500m)** common on Desktop/IP locations and warns the user accordingly.
* **Itinerary Management:**
    * **Reorderable steps** to redefine the travel path.
    * Customize **colors**, **names**, and **comments** for each marker.

---

## 📊 Data Structure (MLD)

Each step object follows this strict technical definition:

| Field | Type | Description |
| :--- | :--- | :--- |
| **id** | `Number` | Unique ID generated via `Date.now()` (Timestamp) |
| **lat/lng** | `Float` | Geographical coordinates for map positioning |
| **name** | `String` | Custom label for the location |
| **comment** | `String` | User notes or descriptions |
| **color** | `String` | Hexadecimal color code for the marker |
| **order** | `Number` | Integer defining the sequence in the itinerary |

---

## 📦 Installation & Setup

### 1️⃣ Install Dependencies
To install all required packages, run:
```bash
# Clone the project
git clone [https://github.com/akrblt/TPI_Trip_Planner/tree/main]

# Enter the directory
cd monparcours

# Install dependencies
npm install
```


### 2️⃣ Run for Development
To start the local development server with **Hot Module Replacement (HMR):**  
```bash
# Run the dev server
npm run dev
[!NOTE]
The app will be available at: http://localhost:5173
```

### 3️⃣ Build for Production  
To generate a highly optimized, production-ready build in the dist/ folder:  
```bash
# Build the project
npm run build
```

## 🧪 Testing Strategy  

The project implements a robust testing strategy to ensure application stability:

**Unit Testing:** Powered by **Vitest**, focusing on core logic such as ID generation and data structure validation.

**Component Testing:** Ensuring the Map and Sidebar components react correctly to data changes.

**Manual Testing:** Full validation of the Geolocation Accuracy logic across different environments (GPS simulation via DevTools vs WiFi/IP).

**To execute the test suite:**  
```bash
npm run test
```

## 👨‍💻 Author & Project Info  
### Ahmet KARABULUT
#### TPI Project - 2026

## 📄 License  
This project is developed for educational purposes as part of the TPI 2026 program.


