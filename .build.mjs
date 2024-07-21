import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { execa } from "execa";
import { execSync } from "child_process";
import prompts from "prompts";
import brotliSize from "brotli-size";
import prettyBytes from "pretty-bytes";

const info = (m) => console.log("► " + chalk.blue(m));
const error = (m) => console.log("⚠️ " + chalk.red(m));
const success = (m) => console.log("✅ " + chalk.green(m));
const details = (m) => console.log(chalk.pink(m));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname);
const isPublishing = process.argv[2] === "--publish";

async function clean() {
  if (!fs.existsSync(`${rootDir}/dist`)) return;
  await execa("shx", ["rm", "-rf", `${rootDir}/dist`]);
}

async function baseBuild() {
  info("Building primary package");
  await execa("npx", ["rollup", "-c", "rollup.config.js"]);
}

async function vueBuild() {
  info("Building Vue package");
  await execa("npx", [
    "rollup",
    "-c",
    "rollup.config.js",
    "--environment",
    "FRAMEWORK:vue",
  ]);

  let raw = await readFile(resolve(rootDir, "dist/vue/index.mjs"), "utf8");
  raw = raw.replace("from '../index'", "from '../index.mjs'");
  await writeFile(resolve(rootDir, "dist/vue/index.mjs"), raw);
}

async function reactBuild() {
  info("Building React package");
  await execa("npx", [
    "rollup",
    "-c",
    "rollup.config.js",
    "--environment",
    "FRAMEWORK:react",
  ]);
  let raw = await readFile(resolve(rootDir, "dist/react/index.mjs"), "utf8");
  raw = raw.replace("from '../index'", "from '../index.mjs'");
  await writeFile(resolve(rootDir, "dist/react/index.mjs"), raw);
}

async function declarationsBuild() {
  info("Building declarations");
  await execa("npx", [
    "rollup",
    "-c",
    "rollup.config.js",
    "--environment",
    "DECLARATIONS:true",
  ]);
}

async function bundleDeclarations() {
  info("Organizing declarations");
  await execa("shx", [
    "mv",
    `${rootDir}/dist/src/core/*`,
    `${rootDir}/dist/core/`,
  ]);
  await execa("shx", [
    "mv",
    `${rootDir}/dist/src/react/*`,
    `${rootDir}/dist/react/`,
  ]);
  await execa("shx", [
    "cp",
    `${rootDir}/dist/react/index.d.ts`,
    `${rootDir}/src/react/index.d.ts`,
  ]);
  await execa("shx", ["rm", "-rf", `${rootDir}/dist/src`]);
  await execa("shx", ["rm", `${rootDir}/dist/index.js`]);
}

async function addPackageJSON() {
  info("Generating package.json");
  const raw = await readFile(resolve(rootDir, "package.json"), "utf8");
  const packageJSON = JSON.parse(raw);
  delete packageJSON.private;
  delete packageJSON.devDependencies;
  delete packageJSON.scripts;
  await writeFile(
    resolve(rootDir, "dist/package.json"),
    JSON.stringify(packageJSON, null, 2)
  );
}

async function addAssets() {
  info("Writing readme and license.");
  await execa("shx", [
    "cp",
    `${rootDir}/README.md`,
    `${rootDir}/dist/README.md`,
  ]);
  // await execa("shx", ["cp", `${rootDir}/LICENSE`, `${rootDir}/dist/LICENSE`]);
}

async function prepareForPublishing() {
  info("Preparing for publication");
  const isClean = !execSync(`git status --untracked-files=no --porcelain`, {
    encoding: "utf-8",
  });
  if (!isClean) {
    error("Commit your changes before publishing.");
    process.exit();
  }
  const raw = await readFile(resolve(rootDir, "package.json"), "utf8");
  const packageJSON = JSON.parse(raw);

  // bump version
  // use `npx bumpp` to bump version, create and push tag
  const version = packageJSON.version;
  const [major, minor, patch] = version.split(".");
  const versionRes = await prompts([
    {
      type: "select",
      name: "value",
      message: `Select version bump type`,
      choices: [
        { title: "Patch", value: "patch" },
        { title: "Minor", value: "minor" },
        { title: "Major", value: "major" },
      ],
      initial: 0,
    },
  ]);
  const newVersion = [major, minor, patch];
  newVersion[["major", "minor", "patch"].indexOf(versionRes.value)]++;
  packageJSON.version = newVersion.join(".");
  await writeFile(
    resolve(rootDir, "package.json"),
    JSON.stringify(packageJSON, null, 2)
  );

  execSync(`git add package.json`);
  execSync(`git commit -m "Bump version to ${packageJSON.version}"`);
  execSync(`git tag ${packageJSON.version}`);
  execSync(`git push origin --tags`);

  const response = await prompts([
    {
      type: "confirm",
      name: "value",
      message: `Confirm you want to publish version ${chalk.red(
        packageJSON.version
      )}?`,
      initial: false,
    },
  ]);
  if (!response.value) {
    error("Please adjust the version and try again");
    process.exit();
  }
}

async function publish() {
  const raw = await readFile(resolve(rootDir, "package.json"), "utf8");
  const packageJSON = JSON.parse(raw);
  const response = await prompts([
    {
      type: "confirm",
      name: "value",
      message: `Project is build. Ready to publish?`,
      initial: false,
    },
  ]);
  if (response.value) {
    execSync("npm publish ./dist --registry https://registry.npmjs.org");
  }
}

async function outputSize(pkg) {
  const raw = await readFile(resolve(rootDir, `dist/${pkg}/index.mjs`), "utf8");
  info(`Brotli size - ${pkg}: ` + prettyBytes(brotliSize.sync(raw)));
}

isPublishing && (await prepareForPublishing());
await clean();
await baseBuild();
// await vueBuild();
await reactBuild();
await declarationsBuild();
await bundleDeclarations();
await addPackageJSON();
await addAssets();
await outputSize("core");
await outputSize("react");
success("Build completed");
isPublishing && (await publish());
