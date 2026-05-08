// Optimization Algorithms for Drill Paths

class OptimizationAlgorithms {
    /**
     * Sort points by X coordinate (bubble sort - matches Delphi implementation)
     */
    static sortByX(points) {
        const result = [...points];
        const n = result.length;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (result[j].x > result[j + 1].x) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                }
            }
        }
        
        return result;
    }
    
    /**
     * Sort points by Y coordinate (bubble sort - matches Delphi implementation)
     */
    static sortByY(points) {
        const result = [...points];
        const n = result.length;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (result[j].y > result[j + 1].y) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                }
            }
        }
        
        return result;
    }
    
    /**
     * OPTICS-like clustering for path optimization
     * Uses nearest neighbor approach (matches Delphi SortByPath implementation)
     */
    static opticsOptimization(points, startPos = null) {
        if (!points || points.length === 0) {
            return [];
        }
        
        const result = [];
        const remaining = [...points];
        let current = startPos || remaining[0];
        
        while (remaining.length > 0) {
            // Find nearest point to current position
            let nearestIdx = 0;
            let nearestDist = Infinity;
            
            for (let i = 0; i < remaining.length; i++) {
                const dist = current.distanceTo(remaining[i]);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestIdx = i;
                }
            }
            
            // Move to nearest point
            current = remaining.splice(nearestIdx, 1)[0];
            result.push(current);
        }
        
        return result;
    }
    
    /**
     * Calculate total path length
     */
    static calculatePathLength(points, startPos = null) {
        if (!points || points.length === 0) {
            return 0;
        }
        
        let total = 0;
        let current = startPos || points[0];
        
        for (const point of points) {
            total += current.distanceTo(point);
            current = point;
        }
        
        return total;
    }
    
    /**
     * Apply optimization based on algorithm name
     */
    static optimize(points, algorithm, startPos = null) {
        switch (algorithm) {
            case 'x':
                return this.sortByX(points);
            case 'y':
                return this.sortByY(points);
            case 'path':
                return this.opticsOptimization(points, startPos);
            case 'none':
            default:
                return [...points];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OptimizationAlgorithms };
}