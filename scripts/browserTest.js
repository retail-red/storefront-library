/* Configs */
const url = 'https://cdn.retail.red/omni-enablement/retailred-quickreserve-0.1.1-12.js';
// const url = 'http://localhost:8080/main.js';
const target = '#add-to-cart > div';
const config = {
  apiKey: '8v4SLSyxR7xq0BSkbOSscO1y',
  apiStage: 'staging',
  unitSystem: 'metric',
  localization: {
    countries: ['de'],
  },
  inventory: {
    hideNumber: false,
    showExactUntil: 10,
    showLowUntil: 5,
  },
  legal: {
    terms: 'https://google.de',
    privacy: 'https://google.de',
  },
  customer: {
    code: null,
    firstName: 'Rene',
    lastName: 'Eichhorn',
    phone: '',
    emailAddress: 'rene.eichhorn@shopgate.com',
  },
  product: {
    code: 'acai-bowl',
    name: 'retail.red PRODUKT',
    options: [
      {
        name: 'Color',
        value: 'Red',
      },
      {
        name: 'Size',
        value: 'M',
      },
    ],
    quantity: 1,
    imageUrl: 'https://picsum.photos/id/237/580/435',
    price: 34.0,
    currencyCode: 'EUR',
  },
};
const css = `
  #rr-omni #rr-omni-custom, #rr-omni-reserve-button {
    --color-primary: 199, 0, 57;
  }
`;

/* DO NOT CHANGE */
const interval = setInterval(() => {
  if (!document.querySelector(target)) {
    return;
  }
  clearInterval(interval);
  const injectedDiv = document.createElement('div');
  injectedDiv.id = 'rd-demo';
  document.querySelector(target).appendChild(injectedDiv);
  const script = document.createElement('script');
  script.src = url;
  script.onerror = (err) => console.error('Upps', err);
  script.onload = () => {
    const evalJs = `
        const retailred = window.RetailRedEnablement.create(${JSON.stringify(config)});
        retailred.renderReserveButton('#rd-demo');
      `;
    const scriptJs = document.createElement('script');
    const code = document.createTextNode(`(function() {${evalJs}})();`);
    scriptJs.appendChild(code);
    (document.body || document.head).appendChild(scriptJs);
  };
  document.head.appendChild(script);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}, 100);
