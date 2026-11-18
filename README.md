# بستنی نون

Five interactive Persian, RTL ordering demos for a fictional Iranian ice cream shop. All five use the same mock products, ingredients, allergens, pricing, and order rules.

## Run locally

Run from the project directory, then open [http://localhost:8000/](http://localhost:8000/).

```sh
python3 -m http.server 8000
```

The site uses HTML, CSS, and browser-native JavaScript modules. It needs a static HTTP server, with no build, backend, API keys, or runtime package installation.

| Prototype | Entry point | Ordering experience | Persian font |
| --- | --- | --- | --- |
| A · Menu-first | `prototype-a/` | Sticky categories, compact product grid, and a single-page builder | Vazirmatn |
| B · Discovery-first | `prototype-b/` | Photo-led flavor guide, visible allergens, and expandable builder sections | Noto Naskh Arabic |
| C · Builder-first | `prototype-c/` | Opens in a five-step builder with a live illustration and price. The full catalog is one tap away. | Noto Kufi Arabic |
| D · Menu-first with Dastkhat | `prototype-d/` | Same layout and ordering flow as A for a typography comparison | [Dastkhat](https://github.com/dastyar-io/dastkhat-font) |
| E · Floating navigation | `prototype-e/` | Floating dock for the menu, builder, and cart with quick transitions | Dastkhat |

Fonts and product images are served locally. The product image set is AI-generated for the fictional menu. Font license copies are in [shared/assets/fonts](shared/assets/fonts/). The product catalog and availability are in [shared/data/catalog.js](shared/data/catalog.js).

## Demo orders

Browse without signing in. To check out, use the fictional phone number `09001234567` and code `1234`, or use the fill buttons beside each field. The site accepts the demo values in ASCII, Persian, or Arabic digits. It does not transmit or persist phone values. Each prototype keeps its own cart, builder selections, and latest receipt in the current browser. Demo notes are stored in that receipt.

The review switcher carries the current section between prototypes. Each target opens with its own cart or selection. Checkout requires an item in that prototype’s cart.

SMS, payment, stock, and order placement are simulated. Production would require server-side pricing and inventory, an order and fulfillment backend, SMS verification, and a payment provider.

## Verification

Run the ordering tests with Node.js 22 or later.

```sh
node tests/ordering.test.mjs
```

The browser smoke test uses Playwright with Chromium. If Playwright is installed outside the project, set `PLAYWRIGHT_MODULE` to its absolute module path.

```sh
node tests/browser.cjs
```

## GitHub Pages

Upload the project to the repository’s `main` branch. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then save. [GitHub Pages publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

The expected URLs for this repository are:

- Comparison — `https://shjpr9.github.io/ice-cream-demo/`
- A — `https://shjpr9.github.io/ice-cream-demo/prototype-a/`
- B — `https://shjpr9.github.io/ice-cream-demo/prototype-b/`
- C — `https://shjpr9.github.io/ice-cream-demo/prototype-c/`
- D — `https://shjpr9.github.io/ice-cream-demo/prototype-d/`
- E — `https://shjpr9.github.io/ice-cream-demo/prototype-e/`

Direct links such as `prototype-c/?view=menu` work under the same repository path. Each prototype has its own `index.html`.
