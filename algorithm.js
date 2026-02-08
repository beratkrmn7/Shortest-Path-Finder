// Dijkstra's Algorithm
function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const unvisited = Object.keys(graphData.nodes);
    
    // Initialize distances
    unvisited.forEach(node => distances[node] = Infinity);
    distances[start] = 0;

    while (unvisited.length > 0) {
        // Find node with minimum distance
        const current = unvisited.reduce((min, node) => 
            distances[node] < distances[min] ? node : min, unvisited[0]);
        
        // If we reached the end or can't proceed further
        if (current === end || distances[current] === Infinity) break;
        
        // Remove current from unvisited
        unvisited.splice(unvisited.indexOf(current), 1);
        
        // Check neighbors
        const neighbors = graphData.edges[current];
        if (neighbors) {
            for (let neighbor in neighbors) {
                const newDist = distances[current] + neighbors[neighbor];
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = current;
                }
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }
    
    // Check if path was found
    if (distances[end] === Infinity) return null;
    return { distance: distances[end], path: path };
}

// A* Algorithm with Heuristic Function
function astar(start, end) {
    // Heuristic function: Euclidean distance
    function heuristic(node1, node2) {
        const [lat1, lng1] = graphData.nodes[node1];
        const [lat2, lng2] = graphData.nodes[node2];
        // Convert to km (approximate)
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) * 111;
    }

    const openSet = [start];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    
    // Initialize scores
    Object.keys(graphData.nodes).forEach(node => {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    });
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);

    while (openSet.length > 0) {
        // Get node with lowest fScore
        const current = openSet.reduce((min, node) => 
            fScore[node] < fScore[min] ? node : min, openSet[0]);
        
        // If we reached the goal
        if (current === end) {
            const path = [];
            let temp = current;
            while (temp) {
                path.unshift(temp);
                temp = cameFrom[temp];
            }
            return { distance: gScore[end], path: path };
        }
        
        // Remove current from openSet
        openSet.splice(openSet.indexOf(current), 1);
        
        // Check neighbors
        const neighbors = graphData.edges[current];
        if (neighbors) {
            for (let neighbor in neighbors) {
                const tentativeGScore = gScore[current] + neighbors[neighbor];
                
                if (tentativeGScore < gScore[neighbor]) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
                    
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
    }
    
    return null;
}

// BFS Algorithm (Breadth-First Search)
function bfs(start, end) {
    const queue = [start];
    const visited = new Set([start]);
    const previous = {};
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // If we found the end
        if (current === end) {
            const path = [];
            let temp = current;
            let distance = 0;
            
            // Reconstruct path and calculate distance
            while (temp) {
                path.unshift(temp);
                if (previous[temp]) {
                    distance += graphData.edges[previous[temp]][temp];
                }
                temp = previous[temp];
            }
            
            return { distance: distance, path: path };
        }
        
        // Check neighbors
        const neighbors = graphData.edges[current];
        if (neighbors) {
            for (let neighbor in neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    previous[neighbor] = current;
                    queue.push(neighbor);
                }
            }
        }
    }
    
    return null;
}
