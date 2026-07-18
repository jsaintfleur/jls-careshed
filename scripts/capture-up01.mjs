import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const devRoot = path.resolve(here, "../..");
const outDir = path.resolve(devRoot, "jls-careshed/artifacts/screenshots/up01-review");
const requireFromShelterShield = createRequire(path.resolve(devRoot, "jls-sheltershield/package.json"));
const { chromium } = requireFromShelterShield("playwright");

const apps = [
  { repo: "jls-sheltershield", port: 4520 },
  { repo: "jls-careshed", port: 4521 },
  { repo: "jls-pulsecredit", port: 4522 },
  { repo: "jls-transitshield", port: 4523 },
  { repo: "jls-marketplace-compass", port: 4524 },
];

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
      process.stderr.write(chunk);
    });
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`${command} ${args.join(" ")} failed in ${cwd} with exit ${code}\n${output}`));
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited before it was ready for ${url}`);
    }
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {
      // Retry until the production server accepts connections.
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function capturePage(browser, url, file, theme) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  await context.addInitScript((selectedTheme) => {
    window.localStorage.setItem("jls-theme", selectedTheme);
    document.documentElement.classList.toggle("dark", selectedTheme === "dark");
    document.documentElement.classList.toggle("light", selectedTheme !== "dark");
  }, theme);

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate((selectedTheme) => {
    document.documentElement.classList.toggle("dark", selectedTheme === "dark");
    document.documentElement.classList.toggle("light", selectedTheme !== "dark");
  }, theme);
  await page.waitForTimeout(500);
  await page.screenshot({ path: file, fullPage: false });
  await context.close();
}

async function inspectChrome(browser, url, theme = "light") {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  await context.addInitScript((selectedTheme) => {
    window.localStorage.setItem("jls-theme", selectedTheme);
    document.documentElement.classList.toggle("dark", selectedTheme === "dark");
    document.documentElement.classList.toggle("light", selectedTheme !== "dark");
  }, theme);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.waitForTimeout(400);
  const result = await page.evaluate(() => {
    const style = (selector, prop) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element)[prop] : null;
    };
    const cta = Array.from(document.querySelectorAll("a,button")).find((element) => {
      const bg = getComputedStyle(element).backgroundColor;
      return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    });
    return {
      htmlAccent: document.documentElement.getAttribute("data-app-accent"),
      eyebrow: style("main p[class*='uppercase'], .eyebrow", "color"),
      ctaBg: cta ? getComputedStyle(cta).backgroundColor : null,
      logoBg: style("header span[class*='bg-brand']", "backgroundColor"),
      headerBg: style("header", "backgroundColor"),
    };
  });
  await context.close();
  return result;
}

async function captureHub(browser) {
  const hubUrl = `file://${path.resolve(devRoot, "jls-portfolio/index.html")}`;
  await capturePage(browser, hubUrl, path.join(outDir, "jls-portfolio-desktop-light.png"), "light");
  await capturePage(browser, hubUrl, path.join(outDir, "jls-portfolio-desktop-dark.png"), "dark");
  console.log("INSPECT jls-portfolio light", await inspectChrome(browser, hubUrl, "light"));
  console.log("INSPECT jls-portfolio dark", await inspectChrome(browser, hubUrl, "dark"));
}

async function captureApp(browser, app) {
  const cwd = path.resolve(devRoot, app.repo);
  fs.rmSync(path.join(cwd, ".next"), { recursive: true, force: true });
  console.log(`\n=== CLEAN BUILD ${app.repo} ===`);
  await run("npm", ["run", "build"], cwd);

  const child = spawn("npm", ["start", "--", "-p", String(app.port)], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => {
    logs += chunk;
  });
  child.stderr.on("data", (chunk) => {
    logs += chunk;
  });

  try {
    const baseUrl = `http://127.0.0.1:${app.port}`;
    await waitForServer(baseUrl, child);
    await capturePage(browser, `${baseUrl}/`, path.join(outDir, `${app.repo}-desktop-light.png`), "light");
    await capturePage(browser, `${baseUrl}/`, path.join(outDir, `${app.repo}-desktop-dark.png`), "dark");
    console.log(`INSPECT ${app.repo}`, await inspectChrome(browser, `${baseUrl}/`, "light"));
  } catch (error) {
    console.error(logs);
    throw error;
  } finally {
    child.kill("SIGTERM");
    await delay(500);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  await captureHub(browser);
  for (const app of apps) await captureApp(browser, app);
} finally {
  await browser.close();
}

console.log(`\nWrote UP-01 review screenshots to ${outDir}`);
