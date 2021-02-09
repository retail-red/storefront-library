/* eslint-disable import/prefer-default-export */
export const getImmediateGeolocation = (fallback, timeout = 1500) => new Promise(
  (resolve, reject) => {
    let timeouted = false;
    const timeoutIndex = setTimeout(() => {
      timeouted = true;
      reject(new Error('Timeout'));
    }, timeout);
    const safeReject = (err) => {
      if (timeouted) return;
      reject(err);
    };

    try {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!timeouted) {
          resolve(position);
          return;
        }
        fallback(position);
      }, (err) => {
        clearTimeout(timeoutIndex);
        safeReject(err);
      });
    } catch (err) {
      clearTimeout(timeoutIndex);
      safeReject(err);
    }
  },
);
