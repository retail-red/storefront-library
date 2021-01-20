# Retail Red JS

## Quick Integration

To include our scripts and all its dependencies you need to add the following snippet to your shops core template. It's recommended to place it next to your other JavaScript dependencies.
```html
<script type='text/javascript' src='https://cdn.retail.red/v1/enablement.js'></script>
```
The next step is to execute the retail.red script with your own config. This needs to be executed after the product page has been completely rendered. For static pages its enough to put the following snippet at the end of your HTML page. If you are unsure when the product page is completely rendered you can use the browser `load` event.
```html
<script type="text/javascript">
  window.addEventListener('load', function () {
    const retailred = window.RetailRedEnablement.create({
      apiKey: "your_api_key",
      product: {
        code: 'TEST-01',
        name: 'My test product',
        quantity: 1,
        imageUrl: 'https://url.to.product/img.png',
        price: 12.0,
        currencyCode: 'EUR',
      },
    });
    retailred.renderReserveButton('#rr-dropin');
  });
</script>
```
As a last step you need to define the place where the reservation button should be rendered at. For this all you need to do is place the following snippet in your product page HTML. It's recommended to place this right next to the original add to cart button.
```html
<div id="rr-dropin" />
```

### Example Integration
See `src/dev/index.html` for a basic integration example.

### Custom Styling
All of the rendered UI are using CSS classes that can be used to override **any** styling like colors, spacings and fonts. To avoid the need of `!important` statements you can simply override all of the styling using the prefix `"#rr-omni #rr-omni-custom"`. This will ensure that your custom styling outweighs the defaults. For a button for example simply use
```css
#rr-omni #rr-omni-custom .rr-button {
  margin: 8px;
  ...
}
```
For colors we provided CSS variables that can be overridden once for all usages. Please stick to RGB style color definitions. These allow automatically generated sub colors.
```css
#rr-omni #rr-omni-custom {
  /* Primary color used for form elements and buttons */
  --color-primary: 0, 0, 0;
  /* Color used for alerting texts like errors */
  --color-state-alarm : 176, 0, 32;
  /* Color used for highlighting problems like low stock */
  --color-state-warning: 241, 156, 69;
  /* Color used for positve highlighting like successful reservation text. */
  --color-state-success: 50, 172, 92;
}
```

### Configuration

The following configurations can be specified during initialization in the `RetailRedEnablement.create` method. Or at any time later before the reserve button is rendered using:
```js
retailred.updateConfig({
  customer: {
    firstName: 'Max',
  },
});
```

### Core Configuration

| Property       | Default      | Required | Description                                                          |
|----------------|--------------|----------|----------------------------------------------------------------------|
| `apiKey`       |              | YES      | Storefront API Key for your retail.red account                       |
| `apiStage`     | `production` | NO       | Use `staging` to use our `staging` environment when testing.         |
| `unitSystem`   | `metric`     | NO       | Either `metric` or `imperial`                                        |
| `locationCode` | `null`       | NO       | Preselect a location to bring the user directly to reservation form. |

### Product Configuration

| Property                  | Default | Required        | Description                                    |
|---------------------------|---------|-----------------|------------------------------------------------|
| `product.code`            |         | *before render* | The unique identifer for the active product    |
| `product.quantity`        |         | *before render* | The amount of products that should be reserved |
| `product.name`            |         | *before render* | Name - Visible to the user                     |
| `product.imageUrl`        |         | *before render* | Url to an image of the product.                |
| `product.price`           |         | *before render* | Price as a float, ex. `12.5`                   |
| `product.currencyCode`    |         | *before render* | ISO 4217 code for the currency, ex. `"EUR"`    |
| `product.options`         | `[]`    | NO              | Array of options for product                   |
| `product.options[].name`  | `null`  | YES             | Visible name of the option, ex. `"Color"`      |
| `product.options[].value` | `null`  | YES             | Visible value of the option, ex. `"Red"`       |

### Customer Configuration
These will be used to prefill the reservation form with the currently logged in user.

| Property                | Default | Required | Description                                                                                                   |
|-------------------------|---------|----------|---------------------------------------------------------------------------------------------------------------|
| `customer.code`         | `null`  | NO       | Add a unique identifier to the customer, inside the order this will be stored as the `externalCustomerNumer` |
| `customer.firstName`    | `""`    | NO       | First name                                                                                                    |
| `customer.lastName`     | `""`    | NO       | Last name                                                                                                     |
| `customer.emailAddress` | `""`    | NO       | Email address                                                                                                 |
| `customer.phone`        | `""`    | NO       | Phone number, ex. `"+49123456"`                                                                               |


### Inventory Configuration

| Property                   | Default | Required | Description                                                                                              |
|----------------------------|---------|----------|----------------------------------------------------------------------------------------------------------|
| `inventory.hideNumber`     | `false` | NO       | Hides the stock number and therefore display only if the product is available or not.                    |
| `inventory.showExactUntil` | `null`  | NO       | If inventory is higher than the given number the inventory will be displayed as `X+ Available`           |
| `inventory.showLowUntil`   | `5`     | NO       | If inventory is lower than the given number the inventory will be displayed in the `state-warning` color |

### Localization Configuration

| Property                    | Default             | Required | Description                                              |
|-----------------------------|---------------------|----------|----------------------------------------------------------|
| `localization.localeCode`   | The browsers locale | NO       | Overrides the users locale which will affect UI language |
| `localization.countries`    | `['de']`            | NO       | Set the available countries for the store list search    |
| `localization.[lang].[key]` | `null`              | NO       | Add or overrides a translation key. See example below    |

```js
{
  ...
  localization: {
    de: { 'reserve.submit': 'Reserve JETZT' },
    en: { 'reserve.submit': 'Reserve NOW' },
  }
}
```

### Legal Configuration

| Property        | Default | Required | Description                                                                                                      |
|-----------------|---------|----------|------------------------------------------------------------------------------------------------------------------|
| `legal.terms`   | `null`  | NO       | Add an url to the terms and condition page, also enforces the user to accept them before placing an reservation |
| `legal.privacy` | `null`  | NO       | Add an url to the privacy page, also enforces the user to accept them before placing an reservation             |

### Custom Templates

If styling and configuration is not enough for your needs you can always completely override the default templates.
Following templates can be overridden:

| Name          | Default                           | Description                                                         |
|---------------|-----------------------------------|---------------------------------------------------------------------|
| storeList     | `src/templates/storeList.hbs`     | The store list that includes searching for nearby stores            |
| reserve       | `src/templates/reserve.hbs`       | Reserve form that asks the user for name, email and phone           |
| success       | `src/templates/success.hbs`       | Success page that is displayed after an reservation has been placed |
| reserveButton | `src/templates/reserveButton.hbs` | The reserve button that triggers the reservation modal              |

A custom template can be added directly to your html

```html
<template id="custom-template">
  This is my custom template
  <script>
    console.warn("Hello World")
  </script>
</template>

<script type="text/javascript">
  retailred.updateConfig({
    templates: {
      customTemplates: {
        success: document.querySelector('#custom-template').innerHTML,
      }
    },
  })
</script>
```

or by loading it from an external file. Be aware that CORS rules apply.

```html
<script type="text/javascript">
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open("GET", "/my-template.hbs", true);
  xhr.send();

  function handleStateChange() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      retailred.updateConfig({
        templates: {
          customTemplates: {
            success: xhr.responseText,
          },
        },
      })
    }
  }
</script>
```

If your template needs access to custom variables:
```js
retailred.updateConfig({
  templates: {
    customVariables: {
      myVariable: '1234',
    },
  },
});
```

## API Client SDK

Additionally to the enablement UI script we also provide a client sdk for the storefront api. The methods are all `async` and therefore return a `Promise` that holds the result.

```js
var sdk = window.RetailRedClientSdk('my-api-key');
sdk.getLocations({ countryCode: 'de', postalCode: '35510' }).then(function(result) {
  console.log("Result:", result);
});
```

| Function                  | Parameters                 | Description                                                                                        |
|---------------------------|----------------------------|----------------------------------------------------------------------------------------------------|
| **createOrders**          |                            | Creates multiple orders at once - the created order numbers are returned once completed            |
|                           | `orders`                   | Array of orders - refer to the API docs for a full look at the object structure                    |
| **createOrder**           |                            | Creates a single new order - the created order number is returned once completed                   |
|                           | `order`                    | Order object - refer to the API docs for a full look at the object structure                       |
| **getInventories**        |                            | Fetches the inventory for products at a given location                                             |
|                           | `codePairs`                | Array of multiple location/product code pairs                                                      |
|                           | `codePairs[].locationCode` | The location code                                                                                  |
|                           | `codePairs[].productCode`  | The product code                                                                                   |
| **getProductInventories** |                            | Fetches the inventory for a product at multiple locations                                          |
|                           | `productCode`              | The product code                                                                                   |
|                           | `locationCodes`            | Array of location codes / or single location code                                                  |
|                           | `catalogCode`              | Optional: Specifies a specific catalog                                                             |
| **getLocations**          |                            | Fetches a list of locations                                                                        |
|                           | `productCode`              | Optional: Will only fetch locations that have this product available                               |
|                           | `postalCode`               | Optional: Postal code to filter and sort by distance.                                              |
|                           | `countryCode`              | Optional: Country code                                                                             |
|                           | `longitude`                | Optional: Longitude of the user to filter and sort by distance (Must be combined with `latitude`)  |
|                           | `latitude`                 | Optional: Longitude of the user to filter and sort by distance (Must be combined with `longitude`) |
|                           | ...                        | Optional: Refer to the API docs for a full look at all available options                           |


## Development

**Requirements**
- NPM >= LTS
- Node.js >= LTS


To execute the project in development mode simply execute the following lines in the terminal.
```bash
npm i
npm start
```
This wil by default host the test site at http://localhost:8080

## License
This product is available under the Apache License, Version 2.0.
See the LICENSE.md file for more information.


## Distribution

Gitlab CI publishes a new version to a publicly available S3 bucket on dev and production behind a Cloudfront.

### Development

Versioned:

`https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/<version>/index.html`

`https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/<version>/main.js`

Latest:

https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/latest/index.html

https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/latest/main.js


### Production

https://cdn.retail.red/omni-enablement/retailred-quickreserve-1.0.0.js

