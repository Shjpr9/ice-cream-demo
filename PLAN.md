# Codex Master Prompt: Ice Cream Shop Digital Menu — Three UI/UX Prototypes

## 1. Your Role

You are a senior frontend engineer, creative director, and UI/UX designer specializing in premium, mobile-first food ordering experiences.

Your task is to create **three visually distinct, fully interactive frontend prototypes** for a Persian ice cream shop's digital menu and online ordering website.

This project is intended as a reusable demonstration that will be presented in person to potential ice cream shop owners in Iran.

We are not developing for a particular business yet. Create a fictional ice cream shop brand with realistic products, attractive photography, and a professional visual identity.

**Our main objective is to experiment with three substantially different layouts and user experiences before choosing one for backend development.**

Do not implement a backend.

---

## 2. Technology and Architecture

Use:

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Static JSON or JavaScript objects for mock data

Do not use React, Next.js, Vue, or other frontend frameworks.

Organize the project into three independent prototypes with a shared mock-data layer.

Suggested structure:

```text
ice-cream-demo/
├── index.html
├── shared/
│   ├── data/
│   │   ├── products.js
│   │   ├── flavors.js
│   │   └── toppings.js
│   └── utils/
│       ├── pricing.js
│       └── cart.js
├── prototype-a/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── prototype-b/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── prototype-c/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

The root page should provide a simple way to open and compare all three prototypes.

Keep code reusable where appropriate, but do not force the prototypes to share the same visual components or layouts.

Each prototype must have its own design system.

## 3. Language and Regional Requirements

The website targets customers in Iran.

Requirements:

- All user-facing text must be in Persian.
- Fully RTL layout.
- Use `lang="fa"` and `dir="rtl"`.
- Prices displayed in تومان.
- Persian numerals where appropriate.
- Natural Persian product names and descriptions.
- Correct RTL handling for forms, buttons, navigation, and icons.
- Mobile-first responsive layouts.

Use realistic Iranian ice cream shop products.

Avoid English placeholder text, lorem ipsum, and generic AI-generated marketing copy.

## 4. Visual Design Philosophy

The website should feel like a real, professionally designed ice cream shop digital menu.

It should not look like a generic AI-generated website.

### Required

- Light mode only.
- Bright, fresh, inviting atmosphere.
- Clean white, off-white, and subtle pastel backgrounds.
- Beautiful food photography.
- Strong visual hierarchy.
- Thoughtful spacing.
- Distinctive layouts.
- Tasteful animations and microinteractions.
- Clear and intuitive navigation.
- Consistent visual language within each prototype.

### Avoid

- Dark mode.
- Excessive gradients.
- Generic SaaS layouts.
- Glassmorphism everywhere.
- Excessive floating cards.
- Unnecessary shadows.
- Overly rounded components.
- Generic landing-page templates.
- Huge promotional hero sections.
- Decorative elements that do not improve usability.
- Emoji as substitutes for professional UI icons.
- Identical layouts with different colors.

Use a relatively consistent light color palette across the three prototypes so that layout differences remain the primary focus.

## 5. Typography — Three Different Persian Fonts

**This requirement is mandatory.**

Each prototype must use a different Persian font family.

Codex should independently select the most appropriate font for each design.

### Prototype A

Choose a clean, highly readable Persian font suitable for fast menu browsing.

### Prototype B

Choose an elegant, expressive Persian font suitable for an editorial, photography-focused experience.

### Prototype C

Choose a modern, friendly Persian font suitable for an interactive ice cream builder.

Rules:

- Exactly one primary Persian font family per prototype.
- Do not reuse the same font family between prototypes.
- Use different weights and sizes of that font to establish hierarchy.
- Choose fonts with excellent Persian support.
- Prefer fonts with licenses permitting commercial use.
- Load fonts efficiently.
- Include appropriate fallbacks.
- Document the chosen fonts in the README.

You may consider Vazirmatn, Estedad, Shabnam, or other suitable fonts, but the final selection is your responsibility.

## 6. Main User Scenario

The primary customer is physically visiting an ice cream shop.

They scan a QR code and open the website on their phone.

They should immediately be able to explore the menu without registration.

The website should solve a specific real-world problem:

Customers often feel rushed when ordering at an ice cream counter. They may not know what different flavors contain, how they taste, or which ingredients might cause allergies.

The digital menu should allow customers to explore products comfortably and make informed decisions without pressure.

The experience should be:

1. Open the digital menu.
2. Browse product categories.
3. Explore products and flavors.
4. Read descriptions and ingredient information.
5. Customize scooped ice cream if desired.
6. Add products to the cart.
7. Review and edit the order.
8. Select the order method.
9. Enter a phone number.
10. Complete a simulated SMS verification.
11. Select payment method.
12. Place a simulated order.
13. View order confirmation.

Customers must be able to browse without creating an account.

Do not require login or SMS verification before checkout.

## 7. Product Catalog

Include the following categories from the original requirements:

- بستنی سنتی
- بستنی اسکوپی
- بستنی ایتالیایی
- شیک
- آبمیوه
- کیک
- کوکی و دسر

Each category should have multiple realistic products or flavors.

Each product should include:

- Name
- High-quality image
- Price
- Description
- Category
- Available variants or flavors
- Ingredients
- Allergen information
- Availability status

Use realistic Persian product names and meaningful descriptions.

Include a variety of flavors such as:

- وانیلی
- شکلاتی
- پسته‌ای
- زعفرانی
- توت‌فرنگی
- انبه
- موزی
- کاراملی
- کوکی و خامه

Provide sample products across every category so the menu looks like a real operating ice cream shop.

Use centrally managed mock data.

## 8. Product Discovery Experience

This is one of the most important UX requirements.

Customers should be able to understand products without asking employees questions.

Provide:

- Clear product photography.
- Taste descriptions.
- Ingredient lists.
- Allergen information.
- Price visibility.
- Available flavor options.
- Easy comparison between products.

Use small, understandable visual indicators for allergens and relevant ingredients.

For example:

- Contains nuts
- Contains dairy
- Contains gluten

Allergen information must be derived from the sample product data rather than guessed from the product name.

Make this information accessible and easy to understand.

Do not overwhelm the menu with technical details.

## 9. Custom Scooped Ice Cream Builder — Highest Priority

The custom ice cream builder is the signature interactive feature.

Customers should be able to create their own ice cream by choosing the container, scoops, flavors, and toppings.

### Step 1 — Container

Options:

- لیوان
- قیف
- کاسه

### Step 2 — Number of Scoops

Allow the customer to select the number of scoops.

Support at least:

- One scoop
- Two scoops
- Three scoops
- Four scoops

### Step 3 — Flavors

Allow customers to choose the flavor of each scoop independently.

For example:

- Scoop 1: Chocolate
- Scoop 2: Pistachio
- Scoop 3: Strawberry

Customers should also be able to select multiple scoops of the same flavor.

Include a few special flavors available exclusively through the custom builder, as requested in the original PDF.

### Step 4 — Toppings and Decorations

Include options such as:

- Chocolate sauce
- Caramel sauce
- Whipped cream
- Pistachios
- Almonds
- Chocolate chips
- Other suitable decorations

### Step 5 — Review

Show:

- Container
- Scoop count
- Selected flavors
- Selected toppings
- Final price
- Visual preview

### Interactive Behavior

The builder must:

- Update prices immediately.
- Reflect changes in the selection summary.
- Allow users to return to previous steps.
- Support editing selections.
- Prevent invalid configurations.
- Respect mock availability.
- Show ingredient and allergen information.
- Add the completed configuration to the shopping cart.

### Visual Preview

Create a visual representation of the selected ice cream.

The preview should react to changes in:

- Container type
- Scoop count
- Flavor colors
- Toppings

You may use SVG, CSS illustrations, or layered graphical assets.

The preview does not need to be photorealistic, but it should be polished and visually meaningful.

Do not use an unrelated static image and pretend it represents the customer's actual selection.

## 10. Three Distinct Prototype Concepts

Build three different user experiences using the same underlying products and features.

Do not create three copies of the same layout.

### Prototype A — Menu-First

**Concept: Fast and practical digital menu**

The customer should immediately see the available products.

Design characteristics:

- Category navigation prominently displayed.
- Efficient product browsing.
- Compact but attractive product presentation.
- Minimal navigation steps.
- Easy access to cart.
- Quick customization.
- Optimized for customers who already know what they want.

Experiment with sticky categories, compact product cards, and efficient navigation.

The custom builder should integrate naturally into the menu experience.

### Prototype B — Discovery-First

**Concept: Explore flavors without pressure**

This prototype should focus on discovering products and understanding their ingredients.

Design characteristics:

- Larger product photography.
- More expressive typography.
- Rich flavor descriptions.
- Ingredient and allergen visibility.
- More spacious layouts.
- An editorial approach to presenting products.
- Comfortable exploration without feeling rushed.

Experiment with immersive product details, visual flavor exploration, and alternative navigation patterns.

The custom builder should feel like a natural continuation of flavor discovery.

### Prototype C — Builder-First

**Concept: Interactive ice cream creation**

This prototype should emphasize the custom ice cream builder.

Design characteristics:

- The builder is immediately accessible.
- Strong visual feedback.
- Interactive scoop and topping selection.
- Live pricing.
- Clear customization progress.
- A visually engaging final result.

The rest of the menu must still be fully accessible.

Do not sacrifice usability for animation or visual novelty.

### Important Comparison Rule

All three prototypes must support the same core tasks.

The differences should primarily involve:

- Navigation
- Layout
- Information hierarchy
- Product browsing
- Product details
- Builder interaction
- Visual composition
- Typography

Do not merely change colors, fonts, and border radii.

## 11. Shopping Cart

Implement a functional mock shopping cart.

Features:

- Add products.
- Add customized ice cream configurations.
- Remove products.
- Change quantities.
- Edit customized items.
- Display individual prices.
- Display total price.
- Show order summary.

Cart contents should persist during navigation within a prototype, preferably using localStorage.

Keep the cart experience simple and mobile-friendly.

## 12. Ordering and Checkout

Support three order methods:

- داخل مجموعه
- بیرون‌بر
- ارسال با پیک

Prioritize the in-shop ordering experience.

Allow customers to provide additional order notes.

Examples:

- Extra sauce
- Special preparation instructions
- Allergy-related requests

Provide mock payment methods:

- Online payment
- Cash payment

### Phone Verification

Do not require account registration.

At checkout:

1. Ask for the customer's phone number.
2. Display an SMS verification code entry interface.
3. Simulate sending and verifying the code.
4. Continue to order placement.

Use a clearly labeled demo verification code.

Do not connect to an actual SMS provider.

The customer should not be required to create a password or profile.

### Order Confirmation

After checkout, display:

- Order number
- Ordered items
- Total amount
- Order method
- Simulated payment status
- Confirmation message

## 13. Availability and Inventory

The original requirements include product availability management.

For this prototype:

- Use mock inventory and availability data.
- Display unavailable products or flavors clearly.
- Prevent unavailable flavors from being selected.
- Allow availability changes through the mock data.
- Do not implement real inventory accounting.

The real inventory system will be discussed with the eventual client.

## 14. Admin Panel — Demo Scope

The original requirements include an administrative interface.

For this phase, do not build a production admin system.

Instead, create a small optional mock admin demonstration that can:

- Display sample orders.
- Show a newly placed demo order.
- Change a product's availability.
- Edit a sample product price.

If implementing this would significantly reduce the quality of the three customer-facing prototypes, prioritize the customer experience instead.

## 15. Additional Features From the Original Requirements

The original PDF also proposes:

- Customer reviews and questions.
- Personalized recommendations based on previous purchases.
- Popular flavors of the day or week.
- Recommendations from other customers.
- First-order discounts.
- Birthday discounts for returning customers.

These are secondary features.

Do not implement complex recommendation algorithms, loyalty systems, or customer accounts.

You may demonstrate these features using static sample data and small UI sections where appropriate.

Keep the interfaces focused on the menu and ordering experience.

## 16. Responsive Design

Mobile is the primary target.

Test layouts for:

- Small mobile screens
- Standard smartphones
- Tablets
- Desktop browsers

Requirements:

- Comfortable touch targets.
- Readable Persian text.
- No horizontal overflow.
- Accessible navigation.
- Usable sticky elements.
- Responsive images.
- Functional forms.
- Clear cart access.

The website should feel like a well-designed mobile web application rather than a desktop website squeezed onto a phone.

## 17. Images and Assets

Use attractive, relevant ice cream and dessert imagery.

Prioritize authentic-looking product photography.

Avoid:

- Unrelated stock imagery.
- Broken image URLs.
- Repeated generic placeholders.
- Low-quality stretched images.

If suitable images are unavailable, use carefully designed placeholders rather than pretending they are real product photos.

Ensure the website remains usable when images fail to load.

## 18. Functionality Requirements

These must be working interactions, not decorative buttons:

- Category switching.
- Product detail opening.
- Flavor selection.
- Scoop count selection.
- Container selection.
- Topping selection.
- Live price calculation.
- Cart addition.
- Cart editing.
- Order method selection.
- Phone number input.
- Mock SMS verification.
- Mock checkout.
- Order confirmation.

Do not build nonfunctional UI elements that appear interactive.

## 19. Quality Expectations

The three prototypes should feel like three genuinely different design concepts created by an experienced design team.

They must not look like generic AI-generated templates.

Pay attention to:

- Persian typography.
- Realistic product content.
- Consistent spacing.
- Alignment.
- Navigation.
- Mobile usability.
- Visual hierarchy.
- Interaction feedback.
- Component consistency.
- Loading and empty states.
- Accessibility.

Avoid unnecessary complexity.

The objective is to discover the strongest user experience, not to demonstrate as many frontend effects as possible.

## 20. Deliverables

Produce:

1. Three independent interactive prototypes.
2. A shared mock product catalog.
3. A functional ice cream builder in each prototype.
4. Working shopping cart and simulated checkout.
5. Three different Persian font families, one per prototype.
6. A root comparison page.
7. A README describing the project.

The README should explain:

- How to run the project locally.
- The purpose of each prototype.
- The selected Persian font for each prototype.
- The major UX differences.
- Which features are simulated.
- What would require backend integration later.

## 21. Implementation Strategy

Follow this sequence:

**Phase 1 — Project setup**

Create the directory structure, shared mock data, and basic utilities.

**Phase 2 — Prototype A**

Implement the complete menu-first experience.

**Phase 3 — Prototype B**

Implement the discovery-first experience with a substantially different layout and navigation.

**Phase 4 — Prototype C**

Implement the builder-first experience with its own distinct interaction model.

**Phase 5 — Comparison and refinement**

Review all three prototypes for consistency of features, mobile usability, Persian typography, and interaction quality.

**Phase 6 — Functional verification**

Verify the core interactions in each prototype.

Fix broken layouts, buttons, cart behavior, and builder calculations.

Do not implement the production backend.

## 22. Final Instructions

Make reasonable design decisions independently without asking for approval on minor visual details.

Prioritize quality over unnecessary features.

All three prototypes should be polished enough to demonstrate to a real ice cream shop owner.

## GitHub Pages Deployment & Prototype Switching

All three prototypes will be hosted together in a single GitHub repository using GitHub Pages.

### 1. GitHub Pages Compatibility

- The entire project must work as a static website.
- No backend, server-side rendering, or server-side routing.
- Use relative URLs for navigation, scripts, stylesheets, fonts, and images.
- Do not assume the website is hosted at the domain root (`/`).
- Ensure the project works under a GitHub Pages repository path such as `https://username.github.io/ice-cream-demo/`.
- Use directory-based navigation with `index.html` files.
- Do not rely on SPA history routing or server-side URL rewrites.
- Make sure every prototype works when opened directly or refreshed.
- Provide instructions for deploying from the repository's main branch using GitHub Pages.

### 2. Global Prototype Switcher

Implement a persistent, accessible prototype switcher across all three designs.

The reviewer must be able to switch between prototypes at any time.

Requirements:

- Clearly distinguish Prototype A, B, and C.
- Indicate which prototype is currently active.
- Allow switching with a single click or tap.
- Preserve the current prototype's state when navigating away and returning, where practical.
- Work on mobile and desktop.
- Do not interfere with the ordering experience.
- Use a compact floating control or another unobtrusive navigation pattern.
- On mobile, ensure it does not cover the shopping cart, checkout buttons, or other important controls.
- On desktop, it may appear as a small fixed navigation element.

The switcher should be recognizable as a **demo review tool**, not a customer-facing feature.

Use labels such as:

- A — منومحور
- B — کشف طعم‌ها
- C — بستنی‌ساز

### 3. Context-Aware Switching

When possible, preserve the reviewer's current location within the user journey.

For example:

- If reviewing the menu in Prototype A, switching to B should open B's menu.
- If reviewing the ice cream builder in Prototype B, switching to C should open C's builder.
- If reviewing the cart, switching should open the corresponding cart view.

Use a shared URL parameter or another simple static-compatible approach to represent the current section.

If a corresponding section is unavailable, navigate to the target prototype's default view.

Keep each prototype's cart and builder state independent so reviewers can compare experiences without accidentally mixing selections.

### 4. Comparison Landing Page

Create a root `index.html` that introduces the three prototypes.

Include:

- A short description of the project.
- Three visually distinct preview cards.
- A brief explanation of each UX approach.
- The Persian font selected for each prototype.
- A link to open each prototype.

This page should be designed for reviewers, not customers.

### 5. Review Mode

Add a small, dismissible label indicating that the website is a demonstration.

For example:

`نسخه آزمایشی — اطلاعات و سفارش‌ها واقعی نیستند`

All SMS verification, payment, inventory, and order submission functionality must be simulated.

Do not collect or transmit real phone numbers.

For the demo checkout, provide a clearly labeled fictional test number and verification code.

### 6. Deployment Verification

Before completion:

- Verify navigation between all three prototypes.
- Verify direct URLs and page refreshes.
- Check that fonts and images load correctly under a repository subdirectory.
- Check that the prototype switcher works on mobile.
- Ensure there are no broken absolute paths.
- Verify that no backend or API keys are required.
- Include the final GitHub Pages URL structure in the README.

Remember:

**We are not choosing the final design yet. We are building three distinct experiences to discover which approach works best.**

The most important elements are:

1. A beautiful, intuitive Persian digital menu.
2. Comfortable flavor discovery.
3. An engaging custom ice cream builder.
4. Simple ordering without mandatory registration.
5. Three genuinely different layouts and three different Persian fonts.

Start implementing the project.


