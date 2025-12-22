# Shortest Path Finder Project

## CENG 3511 – Artificial Intelligence Final Project

**Student:** Berat Karaman  
**Student ID:** 220709034  

---

## Project Description

In this project, a web-based application is developed to find the shortest path
between two selected points using Dijkstra’s algorithm. The application shows the
result on an interactive map and helps to understand how the algorithm works on a
real example.

---

## Technologies Used

- HTML  
- CSS  
- JavaScript  
- Leaflet.js  

---

## Project Files

- `index.html` – Main page  
- `style.css` – Page styling  
- `script.js` – Map and user interactions  
- `dijkstra.js` – Dijkstra algorithm implementation  
- `graph-data.json` – Nodes, roads and distances  

---

## How the Application Works

When the page is opened, map data is loaded from the `graph-data.json` file. This
file contains locations in Izmir city, their coordinates and the distances between
them. The user can select start and destination points either by clicking on the
map or by using the dropdown menus.

After two different points are selected, Dijkstra’s algorithm is executed. The
shortest path is drawn on the map and the total distance and route are displayed
on the screen.

---

## Dijkstra Algorithm

Dijkstra’s algorithm is used to find the shortest path in a weighted graph. In this
project, it is assumed that there are no negative edge weights. The time complexity
of the algorithm is approximately O(V²), which is enough for the small graph used
in this project.

---

## Running the Project
LİVE DEMO: https://beratkrmn7.github.io/Shortest-Path-Finder/

Since the JSON file is loaded using `fetch`, the project cannot be opened directly
by double clicking the HTML file.

To run the project, open a terminal in the project folder and run:

python -m http.server

Then open the following address in a browser:

http://localhost:8000


---

## Notes

- Distances are approximate values  
- The project is created for educational purposes  
- A* algorithm can be added as a future improvement  
