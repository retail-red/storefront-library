# retail.red Storefront Library Changelog

## v1.3.2
https://cdn.retail.red/omni/retailred-storefront-library-1.3.2.js
- Added localization support for russian. 

## v1.3.1
https://cdn.retail.red/omni/retailred-storefront-library-1.3.1.js
- Fixed a bug that caused the product to be not updated in the live inventory view.

## v1.3.0
https://cdn.retail.red/omni/retailred-storefront-library-1.3.0.js
- Deprecated product options format and introduced new format that fits with the API. 

## v1.2.0
https://cdn.retail.red/omni/retailred-storefront-library-1.2.0.js
- Added new SDK method `getProduct` to receive product data.
- Added new SDK method `validateProductConfiguration` for product option validations.
- Improved internal extensibility for further usages like the retail.red Checkout Page.
- Introduced new config `testMode` which allows integration without affecting all customers.
- Introduced event `orderCreated` which is fired after an order has been placed.
- Additional but optional product data `identifiers` is now supported.
- Introduced new config `platform` to set the orders platform.

## v1.1.0
https://cdn.retail.red/omni/retailred-storefront-library-1.1.0.js
- Added multiple demo pages.
- Improved UI  and UX of the default store list template.
- Introduced method `renderLiveInventory`. Will inject a block that shows live inventory for current location and product.
- Introduced event `locationChanged` that is triggered whenever the customer changed the location.
- Introduced `browserHistory` config to enable/disable the use of the browser history.
- Fixed a bug that caused the modal to be removed after reaching the success page.
- Introduced `customer.remember` config to remember the users form data.
- Introduced `useGeolocationImmediately` config to open store list search based on geolocation by default.

## v1.0.0
https://cdn.retail.red/omni/retailred-storefront-library-1.0.0.js
- Initial release
