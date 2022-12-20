# retail.red Storefront Library
[![retail.red](https://img.shields.io/badge/retail-.red-red)](https://retail.red/)
![GitHub package.json version](https://img.shields.io/github/package-json/v/retail-red/storefront-library)
[![Changelog](https://img.shields.io/github/package-json/v/retail-red/storefront-library?label=changelog)](CHANGELOG.md)
[![Example](https://img.shields.io/badge/example-Demo-brightgreen)](https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/latest/index_v3.html)
![GitHub](https://img.shields.io/github/license/retail-red/storefront-library)

This library enables merchants to easily offer click & reserve functionality to their existing ecommerce website. The script can add a “reserve” button to the product detail page, via which a new reservation can be placed.

## Quick Integration

To include our scripts and all its dependencies you need to add the following snippet to your shops core template. It's recommended to place it next to your other JavaScript dependencies.
```html
<script type='text/javascript' src='https://cdn.retail.red/omni/retailred-storefront-library-v3.js'></script>
```
The next step is to execute the retail.red script with your own config. This needs to be executed after the product page has been completely rendered. For static pages its enough to put the following snippet at the end of your HTML page. If you are unsure when the product page is completely rendered you can use the browser `load` event.
```html
<script type="text/javascript">
  window.addEventListener('load', function () {
    var retailred = window.RetailRedStorefront.create({
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
See `src/dev/index.html` for a basic integration example or visit the [demo page.](https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/latest/index_v3.html)

## Interface

### Instance
After creating your retail.red instance with `window.RetailRedStorefront.create` you have the following available functions.

| Name                   | Parameters              | Description                                                                                                                                                                                                                                                                                                                                                                                |
|------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `updateConfig`         | `config`                | Used to update the config at any time. Everything already rendered by the library won't be affected. See further documentation for the whole config.                                                                                                                                                                                                                                       |
| `addEventListener`     | `eventName`, `callback` | Adds a new event listener for the event named "`eventName`". Right now two events are available. `locationChanged` is dispatched whenever the user switched his location. `orderCreated` is dispatched after a reservation was successfully placed.                                                                                                                                                                                                            |
| `openReservationModal` | -                       | Immediately opens the reservation modal with the loaded settings. This can be used when a custom reservation button is used which is not rendered using the template system.                                                                                                                                                                                                               |
| `renderReserveButton`  | `target`                | Renders the `reserveButton` template (which is by default a simple button that triggers `openReservationModal` on press) in `target`. `target` can be both a selector as a string or a `HTMLElement`                                                                                                                                                                                      |
| `renderLiveInventory`  | `target`, `options`     | Renders the `liveInventory` template (which is by default a block that displays the products inventory directly in the PDP and lets the user start the reservation flow).                                                                                                                                                                                                                  |
|                        | `options.variant`       | When set to `"modal"` (default behavior) the user can choose a store using the retail.red store list modal. This is recommended if you have many stores in different locations.<br /> When set to `"list"` the user can choose a store using simple dropdown without the overhead of going through the store list modal. This is recommended if you have less than 10 locations available. |


### Custom Styling
All of the rendered UI are using CSS classes that can be used to override **any** styling like colors, spacings and fonts. To avoid the need of `!important` statements you can simply override all of the styling using the prefix `"#rr-omni #rr-omni-custom"`. This will ensure that your custom styling outweighs the defaults. For a button for example simply use
```css
#rr-omni #rr-omni-custom .rr-button {
  margin: 8px;
  ...
}
```
For colors we provided CSS variables that can be overridden once for all usages.
```css
#rr-omni #rr-omni-custom, #rr-omni-reserve-button, #rr-inventory-custom {
  /* Color for common text. If not set, the primary page color will be used */
  --rr-color-text: inherit;
  /* Color for text with a medium emphasis */
  --rr-color-text-medium-emphasis: #666666;
  /* Primary color used for form elements and reserve buttons */
  --rr-color-primary: #000;
  /* Contrast color for the primary color - used as button text color  */
  --rr-color-primary-contrast: #fff;
  /* Secondary color used for search buttons, variant selection and form elements. Falls back to --rr-color-primary when not set */
  --rr-color-secondary: var(--rr-color-primary);
  /* Contrast color for the secondary color - used as button text color. Falls back to --rr-color-primary-contrast when not set.  */
  --rr-color-secondary-contrast: var(--rr-color-primary-contrast);
  /* Color used for links */
  --rr-color-link: #3c9bb5;
  /* Text color for disabled buttons */
  --rr-color-button-disabled: #7f7f7f;
  /* Background color for disabled buttons */
  --rr-color-button-background-disabled: #E0E0E0;
  /* Color used for alerting texts like errors */
  --rr-color-status-alarm : #b00020;
  /* Color used for highlighting problems like low stock */
  --rr-color-status-warning: #f19c45;
  /* Color used for positive highlighting like successful reservation text */
  --rr-color-status-success: #32ac5c;
  /* Font family for the modal */
  --rr-font-family: inherit
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

| Property                    | Default      | Required | Description                                                                                                                                                                                                                                                   |
|-----------------------------|--------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `apiKey`                    |              | YES      | Storefront API Key for your retail.red account                                                                                                                                                                                                                |
| `apiStage`                  | `production` | NO       | Use `staging` to use our `staging` environment when testing.                                                                                                                                                                                                  |
| `unitSystem`                | `metric`     | NO       | Either `metric` or `imperial`                                                                                                                                                                                                                                 |
| `locationCode`              | `null`       | NO       | Preselect a location to bring the user directly to reservation form.                                                                                                                                                                                          |
| `browserHistory`            | `true`       | NO       | If enabled the browsers history will be used within the reservation modal allowing the users to navigate with the native controls. Can be disabled when your store is already using the browsers history internally and the modals history conflicts with it. |
| `useGeolocationImmediately` | `true`       | NO       | If enabled, whenever the user opens the store list the browsers geolocation will be requested immediately instead of only after pressing the locate me button.                                                                                                |
| `testMode`                  | `false`      | NO       | When set to `true` no buttons will be rendered within the users browser, till the page was once opened with a query parameter like `rrTesting=start`. A testing session can be stopped by opening the page with `rrTesting=end`                               |
| `platform`                  | `null`       | NO       | The platform from which the order came. Can be one of `engage`, `desktop`, `mobile`, `checkoutPage` or `other`                                                                                                                                                |
| `saveCustomerData`          | `on` | NO     | Controls how user data is persisted within the `localStorage`. Can be one of `off` (data will not be saved), `on` (data will be saved in any case), `checkbox` (users can decide via a checkbox on the reservation page). The label of the checkbox can be changed via the localization configuration by changing the value of `localization.[lang].saveCustomerData`.                                                                                                                                                                                 |
| `useApiProduct`                  | `false` | NO       |  When set to `true`, product data is fetched from the Storefront API. In that case the product configuration only needs to contain `code` and `quantity` as parameters                          |


### Product Configuration

| Property                  | Default | Required        | Description                                     |
|---------------------------|---------|-----------------|-------------------------------------------------|
| `product.code`            |         | *before render* | The unique identifier for the active product     |
| `product.quantity`        |         | *before render* | The amount of products that should be reserved  |
| `product.name`            |         | *before render* | Name - Visible to the user                      |
| `product.imageUrl`        |         | *before render* | Url to an image of the product.                 |
| `product.price`           |         | *before render* | Price as a float, ex. `12.5`                    |
| `product.currencyCode`    |         | *before render* | ISO 4217 code for the currency, ex. `"EUR"`     |
| `product.options`         | `[]`    | NO              | Array of options for product                    |
| `product.options[].code`        |   | YES             | The unique identifier of the option             |
| `product.options[].name`        |   | YES             | Visible name of the option, ex. `"Color"`       |
| `product.options[].value`       | `{}`    | YES       | Object for the option value                     |
| `product.options[].value.code`  |   | YES             | The unique identifier of the option value       |
| `product.options[].value.name`  |   | YES             | Visible value of the option, ex. `"Red"`        |
| `product.identifiers`     | `{}`    | NO              | Object with various identifiers                 |
| `product.identifiers.ean` |         | NO              | An European Article Number (EAN)                |
| `product.identifiers.isbn`|         | NO              | An International Standard Book Number (ISBN)    |
| `product.identifiers.sku` |         | NO              | A Stock-Keeping Unit (SKU)                      |
| `product.identifiers.upc` |         | NO              | A Universal Product Code (UPC)                  |
| `product.identifiers.distiPartNum`  |           | NO  | A Distributor Part Number                       |
| `product.identifiers.mfgPartNum`    |           | NO  | A Manufacturing Part Number                     |

### Customer Configuration
These will be used to prefill the reservation form with the currently logged in user.

| Property                | Default | Required | Description                                                                                                  |
|-------------------------|---------|----------|--------------------------------------------------------------------------------------------------------------|
| `customer.code`         | `null`  | NO       | Add a unique identifier to the customer, inside the order this will be stored as the `externalCustomerNumber` |
| `customer.firstName`    | `""`    | NO       | First name                                                                                                   |
| `customer.lastName`     | `""`    | NO       | Last name                                                                                                    |
| `customer.emailAddress` | `""`    | NO       | Email address                                                                                                |
| `customer.phone`        | `""`    | NO       | Phone number, ex. `"+49123456"` or `"0123456"`                                                               |
| `customer.country`      | `"DE"`  | NO       | The customers country (ISO 3166-1 alpha-2). Also used for correct phone number formatting.                   |

### Inventory Configuration

| Property                   | Default | Required | Description                                                                                              |
|----------------------------|---------|----------|----------------------------------------------------------------------------------------------------------|
| `inventory.hideNumber`     | `false` | NO       | Hides the stock number and therefore display only if the product is available or not.                    |
| `inventory.showExactUntil` | `null`  | NO       | If inventory is higher than the given number the inventory will be displayed as `X+ Available`           |
| `inventory.showLowUntil`   | `5`     | NO       | If inventory is lower than the given number the inventory will be displayed in the `status-warning` color |

### Localization Configuration

| Property                    | Default             | Required | Description                                              |
|-----------------------------|---------------------|----------|----------------------------------------------------------|
| `localization.localeCode`   | The browsers locale | NO       | Overrides the users locale which will affect UI language. Examples: `de-de`, `en-us`|
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
#### Special Strings
Besides the strings which are available via the locale files, there are some where the storefront library doesn't provide default translations.

| Locale Key | Purpose |
|-----|----|
|`liveInventory.footerText`| A text rendered within the `liveInventory` template that is shown between the availability and the reserve button. |
|`reserve.footerText`| A text rendered within the `reservationModal` right before the reservation button. |
|`liveInventory.noProductText`| A text rendered within the `liveInventory` template that indicates that the script configuration doesn't contain a product. |



### Legal Configuration

| Property        | Default | Required | Description                                                                                                      |
|-----------------|---------|----------|------------------------------------------------------------------------------------------------------------------|
| `legal.terms`   | `null`  | NO       | Add an url to the terms and condition page, also enforces the user to accept them before placing an reservation |
| `legal.privacy` | `null`  | NO       | Add an url to the privacy page, also enforces the user to accept them before placing an reservation             |

### Newsletter Opt-In Configuration
| Property        | Default | Required | Description                                                                                                      |
|-----------------|---------|----------|------------------------------------------------------------------------------------------------------------------|
| `newsletterOptIn`     | `disabled`  | NO       | Add a checkbox to the reservation page, which allows customers to opt-in to a newsletter.<br/>Use `enabled` to activate the checkbox. Use `enabledAndPreselected` to activate the checkbox in a preselected state.|

### UI Configuration
```js
{
  ...,
  ui: {
    reserveButtonClasses: 'my-custom-button button-primary'
  }
}
```

| Property                    | Default                  | Required | Description                                              |
|-----------------------------|--------------------------|----------|----------------------------------------------------------|
| `ui.reserveButtonClasses`   | `button btn btn-primary` | NO       | Applies classes to the reserve button. This setting can be used to style the button according to your CI.  |

### Hooks Configuration
The Storefront Library provides hooks that can be used to intercept default logic and modify existing, or inject custom data.
Hooks are `async` functions that should return a `Promise` that resolves with the result.

#### afterCreateStoreListLocations

This hook can be used to modify the location data before it's rendered inside the store list template.

| Parameters                    | Type | Description      |
|---------------------------|------|-------------------|
| `locations` | `Object[]`| Array of location data that's used to render the location list. |
| `product` | `Object`| The product entity that's used to display current product information within the modal. |
| `tools`| `Object`| The tools object contains additional tools that can be used within the hook. |
| `tools.sdk` | `Object`| The SDK property is a reference to the current [API Client SDK](#api-client-sdk) instance. |
| `tools.t` |`Function`| Helper function to create strings via the translation system. It accepts translation keys and optional replacement parameters for the translated string. Example: `t("some.key", { replacement: "42" })`.|

```js
{
  ...,
  hooks: {
    afterCreateStoreListLocations: function (locations, product, { t, sdk }) {
      return new Promise(function (resolve) {
        // Dispatch additional requests... modify locations data... resolve with the updated location data
        resolve(locations);
      })
    }
  }
}
```

### Custom Templates

If styling and configuration is not enough for your needs you can always completely override the default templates.
Following templates can be overridden:

| Name          | Default                           | Description                                                          |
|---------------|-----------------------------------|----------------------------------------------------------------------|
| storeList     | `src/templates/storeList.hbs`     | The store list that includes searching for nearby stores.            |
| reserve       | `src/templates/reserve.hbs`       | Reserve form that asks the user for name, email and phone.           |
| success       | `src/templates/success.hbs`       | Success page that is displayed after an reservation has been placed. |
| reserveButton | `src/templates/reserveButton.hbs` | The reserve button that triggers the reservation modal.              |
| liveInventory | `src/templates/liveInventory.hbs` | The live inventory block that shows inventory directly on the pdp.   |

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

If your template needs further helpers you can also add those:
```js
window.RetailRedStorefront.registerTemplateHelper('my-helper', function (name) { return 'Hello ' + name });
```
and use them like any other helper
```html
<div>
  {{my-helper "World"}}
</div>
```

## API Client SDK

Additionally to the enablement UI script we also provide a client sdk for the storefront api. The methods are all `async` and therefore return a `Promise` that holds the result.

```js
var sdk = new window.RetailRedStorefrontSdk('my-api-key');
sdk.getLocations({ countryCode: 'de', postalCode: '35510' }).then(function(result) {
  console.log("Result:", result);
});
```

| Function                         | Parameters                    | Description                                                                                                 |
|----------------------------------|-------------------------------|-------------------------------------------------------------------------------------------------------------|
| **createOrders**                 |                               | Creates multiple orders at once - the created order numbers are returned once completed                     |
|                                  | `orders`                      | Array of orders - refer to the API docs for a full look at the object structure                             |
| **createOrder**                  |                               | Creates a single new order - the created order number is returned once completed                            |
|                                  | `order`                       | Order object - refer to the API docs for a full look at the object structure                                |
| **getInventories**               |                               | Fetches the inventory for products at a given location                                                      |
|                                  | `codePairs`                   | Array of multiple location/product code pairs                                                               |
|                                  | `codePairs[].locationCode`    | The location code                                                                                           |
|                                  | `codePairs[].productCode`     | The product code                                                                                            |
| **getProductInventories**        |                               | Fetches the inventory for a product at multiple locations                                                   |
|                                  | `productCode`                 | The product code                                                                                            |
|                                  | `locationCodes`               | Array of location codes / or single location code                                                           |
|                                  | `catalogCode`                 | Optional: Specifies a specific catalog                                                                      |
| **getLocations**                 |                               | Fetches a list of locations                                                                                 |
|                                  | `productCode`                 | Optional: Will only fetch locations that have this product available                                        |
|                                  | `postalCode`                  | Optional: Postal code to filter and sort by distance.                                                       |
|                                  | `countryCode`                 | Optional: Country code                                                                                      |
|                                  | `longitude`                   | Optional: Longitude of the user to filter and sort by distance (Must be combined with `latitude`)           |
|                                  | `latitude`                    | Optional: Longitude of the user to filter and sort by distance (Must be combined with `longitude`)          |
|                                  | ...                           | Optional: Refer to the API docs for a full look at all available options                                    |
| **getProduct**                   |                               | Fetches the data of a given product.                                                                        |
|                                  | `productCode`                 | The target product code                                                                                     |
|                                  | `fields`                      | An array of fields that should be fetched for example: `['code', 'parentProductCode']`                      |
|                                  | `localeCode`                  | Optional locale code to change the language of the product (only use when ensured that products are available in multiple languages).  Example: `de-de`                 |
| **validateProductConfiguration** |                               | Validates the given product configuration and returns all further available configurations from this point. |
|                                  | `productCode`                 | The target product code                                                                                     |
|                                  | `selectedOptions[].code`      | The code of a selected option                                                                               |
|                                  | `selectedOptions[].valueCode` | The code of the value                                                                                       |
|                                  | `locationCode`                | The location code. Only needed if the locations inventory should be checked                                 |

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

## Support
If you have any questions or feedback, please contact us at [mail@retail.red](mailto:mail@retail.red)

## License
This product is available under the Apache License, Version 2.0.
See the LICENSE.md file for more information.
