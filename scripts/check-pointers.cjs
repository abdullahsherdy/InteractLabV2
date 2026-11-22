/* Optional browser check against the production static export.
 * Requires Playwright in the environment; no runtime site dependency.
 * PLAYWRIGHT_MODULE can identify an externally installed Playwright package.
 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.POINTERS_URL || "http://127.0.0.1:4173";
const fs = require("node:fs");
const AxeBuilder = process.env.AXE_PLAYWRIGHT_MODULE
  ? require(process.env.AXE_PLAYWRIGHT_MODULE).default
  : null;
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(base + "/pointers/");
    await page.getByRole("heading", { name: "Your learning path" }).waitFor();
    assert.equal(await page.locator(".ptr-ladder > li").count(), 9);
    assert.equal(
      await page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "Pointers" })
        .getAttribute("aria-current"),
      "page",
    );
    const links = await page
      .locator(".ptr-ladder a")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    let lessons = 0;
    for (const href of links) {
      await page.goto(base + href);
      const choices = page
        .getByRole("navigation", { name: "Lessons in this level" })
        .getByRole("button");
      await choices.first().waitFor();
      const count = await choices.count();
      for (let i = 0; i < count; i++) {
        await choices.nth(i).click();
        const player = page.getByRole("group", {
          name: /Pointer lesson player/,
        });
        await player.focus();
        await player.press("ArrowRight");
        await player.press("ArrowLeft");
        const timeline = page.getByRole("slider", { name: "Lesson timeline" });
        await timeline.focus();
        await timeline.press("End");
        const reveal = page.getByRole("button", { name: "Reveal & compare" });
        await reveal.waitFor();
        assert.equal(
          await page
            .getByRole("button", { name: "Next step", exact: true })
            .isDisabled(),
          true,
        );
        await reveal.click();
        await timeline.focus();
        await timeline.press("End");
        await page.getByRole("heading", { name: "Keep this idea" }).waitFor();
        const final = await page.locator("svg desc").last().textContent();
        await page
          .getByRole("button", { name: "Previous step", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Next step", exact: true })
          .click();
        assert.equal(
          await page.locator("svg desc").last().textContent(),
          final,
        );
        assert.equal(await page.locator(".ptr-checks details").count(), 3);
        await page.locator(".ptr-checks summary").first().click();
        await page
          .getByRole("button", { name: "Mark as reviewed", exact: true })
          .click();
        await page.setViewportSize({ width: 360, height: 1000 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `Mobile overflow: ${href} lesson ${i}`,
        );
        await page.setViewportSize({ width: 1440, height: 1000 });
        if (AxeBuilder && i === count - 1) {
          const report = await new AxeBuilder({ page })
            .include(".ptr-page")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          assert.deepEqual(
            report.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            [],
            href,
          );
        }
        lessons++;
      }
      console.log(`Checked ${href}: ${count} lessons`);
    }
    // Autoplay must stop at a prediction, even when the clock advances far ahead.
    await page.clock.install();
    await page.goto(base + links[0]);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.clock.runFor(60000);
    await page.getByRole("button", { name: "Reveal & compare" }).waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Play", exact: true })
        .isDisabled(),
      true,
    );
    await page.clock.resume();
    // Exercise both themes, reduced motion, mobile overflow, persistence, and native keyboard controls.
    fs.mkdirSync("scratchpad", { recursive: true });
    await page.getByRole("button", { name: "Reveal & compare" }).click();
    await page.getByRole("slider", { name: "Lesson timeline" }).focus();
    await page.getByRole("slider", { name: "Lesson timeline" }).press("End");
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["light", "dark"]) {
        await page.evaluate(
          (theme) => document.documentElement.setAttribute("data-theme", theme),
          theme,
        );
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `Page overflows at ${width} ${theme}`,
        );
        if (AxeBuilder) {
          const report = await new AxeBuilder({ page })
            .include(".ptr-page")
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          assert.deepEqual(
            report.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            [],
            `${theme} ${width}`,
          );
        }
        await page.screenshot({
          path: `scratchpad/pointers-${width}-${theme}.png`,
          fullPage: true,
        });
      }
    }
    await page.goto(base + "/pointers/");
    await page.waitForFunction(() =>
      document
        .querySelector(".ptr-progress")
        ?.getAttribute("aria-label")
        ?.startsWith("2 of 2"),
    );
    console.log(
      JSON.stringify({
        reviewed: await page.evaluate(
          () =>
            JSON.parse(
              localStorage.getItem("interactlab-pointer-progress-v1") || "[]",
            ).length,
        ),
        lessons,
      }),
    );
    assert.match(
      await page.locator(".ptr-progress").first().getAttribute("aria-label"),
      /^2 of 2/,
    );
    await page.goto(base + "/");
    await page.getByRole("link", { name: /C\+\+ Pointers/ }).waitFor();
    const limited = await browser.newPage();
    await limited.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error("Storage disabled");
      };
      Storage.prototype.setItem = () => {
        throw new Error("Storage disabled");
      };
      Object.defineProperty(window, "speechSynthesis", {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(window, "SpeechSynthesisUtterance", {
        value: undefined,
        configurable: true,
      });
    });
    await limited.goto(base + links[0]);
    const limitedTimeline = limited.getByRole("slider", {
      name: "Lesson timeline",
    });
    await limitedTimeline.focus();
    await limitedTimeline.press("End");
    await limited.getByRole("button", { name: "Reveal & compare" }).click();
    await limitedTimeline.focus();
    await limitedTimeline.press("End");
    await limited
      .getByRole("button", { name: "Mark as reviewed", exact: true })
      .click();
    await limited
      .getByText("Reviewed for this visit. Browser storage is unavailable.")
      .waitFor();
    assert.equal(
      await limited
        .getByRole("checkbox", { name: "Voice", exact: true })
        .count(),
      0,
    );
    await limited.close();
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        levels: links.length,
        lessons,
        predictions: "pass",
        replay: "pass",
        autoplay: "pass",
        themes: "pass",
        mobileOverflow: "pass",
        progress: "pass",
        accessibility: AxeBuilder ? "axe passed" : "not run",
        pageErrors: errors.length,
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
