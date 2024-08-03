export function throttle(fn: (...args: any[]) => void, limit: number): (...args: any[]) => void {
    let inThrottle = false;
  
    return function(this: any, ...args: any[]): void {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  