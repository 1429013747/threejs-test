//节流改造
export function throttle(func, wait) {
  let timeout;
  let firstDebounce = false;

  return function (...args) {
    if (!firstDebounce) {
      firstDebounce = true;
      func.apply(this, args);
      return;
    }
    console.log(timeout);
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, wait);
  };
}
