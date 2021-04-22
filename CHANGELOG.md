# retail.red Storefront Library Changelog

## v1.2.0
- Added new SDK method `getProduct` to receive product data.
- Added new SDK method `validateProductConfiguration` for product option validations.
- Improved internal extensibility for further usages like the retail.red Checkout Page.

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
