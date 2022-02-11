# retail.red Storefront Library Changelog
## v2.0.2
### Changes
- Library styling is now inserted at top of the document head to improve possibilities to overwrite styling
- Moved styling for quick reserve button from ID to class to improve customization

## v2.0.1
### Fixed
- CSS issues

## v2.0.0
https://cdn.retail.red/omni/retailred-storefront-library-2.0.0.js
### Breaking Changes
- Prefixed custom properties with to avoid conflicts with global CSS
- Revised custom properties for color customization. Instead of RGB values, they now accept regular CSS colors as values.

### Added
- Custom property `--rr-color-text-medium-emphasis` to change the color of text with a lower emphasis, than the main text color
- Custom property `--rr-color-button-disabled` text color for disabled buttons
- Custom property `--rr-color-button-background-disabled` background color for disabled buttons
- Custom property `--rr-font-family` to apply a custom font-family to the modal content
- `saveCustomerData` config to control how user data form the reservation form is handled
- `ui.reserveButtonClasses` config to set custom classes for the reserve button

### Fixed
- Minor UI tweaks

## v1.3.7
https://cdn.retail.red/omni/retailred-storefront-library-1.3.7.js
- Introduced `newsletterOptIn` config to display an additional checkbox in reserve modal for newsletter subscription.
- Terms & Privacy Policy checkboxes are now combined to a single one when both links are set.
- Styling improvements in reserve modal.
- Handled situations where customer numbers where set as numeric values instead of strings.

## v1.3.6
https://cdn.retail.red/omni/retailred-storefront-library-1.3.6.js
- Fixed an issue causing the reserve modal to stay closed when a custom template was used.

## v1.3.5
https://cdn.retail.red/omni/retailred-storefront-library-1.3.5.js
- `config.product` is now allowed to be `null` but will lead to an disabled reserve button.

## v1.3.4
https://cdn.retail.red/omni/retailred-storefront-library-1.3.4.js
- Improved behavior with geolocation and no longer displays geolocation result if browser takes too long.
- Added `locationCode` to `validateProductConfiguration` sdk function.
- Fixed a bug that caused the reservation form to be rendered more than once.
- The config `inventory.showExactUntil` now allows `null` as a value.

## v1.3.3
https://cdn.retail.red/omni/retailred-storefront-library-1.3.3.js
- Text improvements. 

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
