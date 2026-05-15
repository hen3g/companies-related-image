import { readdir, mkdir, rename } from "fs/promises";
import { join, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { companyLogoPathPrefix } from "../lib/company-logo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, "icons");

async function organizeIcons() {
  try {
    console.log("Start organizing icon files...");

    const files = await readdir(ICONS_DIR);

    const jpgFiles = files.filter((file) => file.toLowerCase().endsWith(".jpg"));

    console.log(`Found ${jpgFiles.length} JPG files`);

    let movedCount = 0;
    const createdFolders = new Set<string>();

    for (const file of jpgFiles) {
      const stem = basename(file, extname(file));
      const prefix = companyLogoPathPrefix(stem);

      const targetFolder = join(ICONS_DIR, prefix);

      if (!existsSync(targetFolder)) {
        await mkdir(targetFolder, { recursive: true });
        createdFolders.add(prefix);
        console.log(`Created folder: ${prefix}/`);
      }

      const sourcePath = join(ICONS_DIR, file);
      const targetPath = join(targetFolder, file);

      await rename(sourcePath, targetPath);
      movedCount++;

      if (movedCount % 100 === 0) {
        console.log(`Processed ${movedCount} files...`);
      }
    }

    console.log("\nOrganization completed!");
    console.log(`Total files moved: ${movedCount}`);
    console.log(`Folders created: ${createdFolders.size}`);
    console.log(`Folder list: ${Array.from(createdFolders).sort().join(", ")}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error:", message);
    process.exit(1);
  }
}

void organizeIcons();