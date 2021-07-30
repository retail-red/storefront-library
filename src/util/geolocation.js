/* eslint-disable import/prefer-default-export */
export const getImmediateGeolocation = (timeout = 8000) => new Promise(
  (resolve, reject) => {
    let timedOut = false;
    const timeoutIndex = setTimeout(() => {
      timedOut = true;
      reject(new Error('Timeout'));
    }, timeout);
    const safeReject = (err) => {
      if (timedOut) return;
      reject(err);
    };

    try {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!timedOut) {
          resolve(position);
        }
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
