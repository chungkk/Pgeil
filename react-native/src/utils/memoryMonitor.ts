/**
 * Memory Monitor Utility
 * Helps detect and prevent memory leaks in React Native
 */

type CleanupFunction = () => void;

class MemoryMonitor {
  private cleanupFunctions: Map<string, CleanupFunction[]> = new Map();
  private warningThreshold = 50; // Max number of cleanup functions per component

  /**
   * Register a cleanup function for a component
   */
  registerCleanup(componentName: string, cleanup: CleanupFunction): void {
    if (!this.cleanupFunctions.has(componentName)) {
      this.cleanupFunctions.set(componentName, []);
    }

    const cleanups = this.cleanupFunctions.get(componentName)!;
    cleanups.push(cleanup);

    // Warn if too many cleanup functions registered (potential leak)
    if (cleanups.length > this.warningThreshold) {
      console.warn(
        `[MemoryMonitor] ${componentName} has ${cleanups.length} cleanup functions. Possible memory leak.`
      );
    }
  }

  /**
   * Execute and clear all cleanup functions for a component
   */
  cleanup(componentName: string): void {
    const cleanups = this.cleanupFunctions.get(componentName);
    if (!cleanups) return;

    cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error(`[MemoryMonitor] Error in cleanup for ${componentName}:`, error);
      }
    });

    this.cleanupFunctions.delete(componentName);
  }

  /**
   * Get memory usage stats (for debugging)
   */
  getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.cleanupFunctions.forEach((cleanups, componentName) => {
      stats[componentName] = cleanups.length;
    });
    return stats;
  }

  /**
   * Clear all cleanup functions (for testing)
   */
  reset(): void {
    this.cleanupFunctions.clear();
  }
}

export const memoryMonitor = new MemoryMonitor();

/**
 * Hook to help manage cleanup in functional components
 * Returns a function to register cleanup callbacks
 */
export function useCleanup(componentName: string) {
  return (cleanup: CleanupFunction) => {
    memoryMonitor.registerCleanup(componentName, cleanup);
  };
}
