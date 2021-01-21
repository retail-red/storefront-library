/* Configs */
(() => {
  const url = 'https://cdn.retail.red/omni-enablement/retailred-quickreserve-0.1.1-6.js';
  const target = '#product-offer > div.col.product-info.col-lg-6.col-12 > div > div.product-offer > div > div.col.col-12 > div';
  const config = {
    apiKey: 'ARotRbXpalxVcmMNz9Yd',
    apiStage: 'development',
    //  locationCode: '1',
    unitSystem: 'metric',
    localization: {
      countries: ['de', 'us'],
      de: { 'reserve.footerText': 'Hello World' },
      en: { 'reserve.footerText': 'Hello World' },
    },
    inventory: {
      hideNumber: false,
      showExactUntil: 80,
      showLowUntil: 65,
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
      code: '24-MB01',
      name: 'My Awesome product',
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
      quantity: 2,
      imageUrl: 'https://loremflickr.com/320/240/cute_cat',
      price: 34.0,
      currencyCode: 'USD',
    },
  };
  const css = `
    #rr-omni #rr-omni-custom {
      --color-primary: 1, 121, 200;
    }
  `;

  /* DO NOT CHANGE */
  const injectedDiv = document.createElement('div');
  injectedDiv.id = 'rd-demo';
  document.querySelector(target).appendChild(injectedDiv);
  const script = document.createElement('script');
  script.onerror = (err) => console.error('Upps', err);
  script.onload = () => {
    const retailred = window.RetailRedEnablement.create(config);
    retailred.renderReserveButton('#rd-demo');
  };
  script.src = url;
  document.head.appendChild(script);
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
})();
