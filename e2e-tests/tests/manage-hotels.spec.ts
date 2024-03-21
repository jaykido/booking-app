import { test, expect } from "@playwright/test";
import exp from "constants";
import path from "path";

const UI_URL = "http://localhost:5173";
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // Get the sign in button

  await page.getByRole("link", { name: "Sign-In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("mercymbu@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("should allow user to add a new hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);
  await page.locator(`[name="name"]`).fill("Test Hotel");
  await page.locator(`[name="city"]`).fill("Test City");
  await page.locator(`[name="country"]`).fill("Test country");
  await page
    .locator(`[name="description"]`)
    .fill(
      "This is the Test description Text provided by yours Faithfully, Mjay Muriu. Playwright is actually fun!"
    );
  await page.locator(`[name="pricePerNight"]`).fill("2500");
  await page.selectOption(`select[name="starRating"]`, "3");
  await page.getByText("Budget").click();
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();
  await page.locator(`[name="adultCount"]`).fill("2");
  await page.locator(`[name="childCount"]`).fill("1");

  await page.setInputFiles(`[name="imageFiles"]`, [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "2.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved")).toBeVisible();
});

test("should display hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  await expect(page.getByText("Test Hotel")).toBeVisible();
  await expect(page.getByText("This is the Test description")).toBeVisible();
  await expect(page.getByText(`Test City,Test country`)).toBeVisible();
  await expect(page.getByText(`Budget`)).toBeVisible();
  await expect(page.getByText(`2500 per night`)).toBeVisible();
  await expect(page.getByText(`2 adults, 1 children`)).toBeVisible();
  await expect(page.getByText(`3 Star Rating`)).toBeVisible();

  await expect(page.getByRole("link", { name: "Edit Details" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Add a Hotel" })).toBeVisible();
});
