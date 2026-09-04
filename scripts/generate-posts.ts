import { fetchPosts, publishedPosts } from "./fetch";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "src/generated");
const filePath = path.join(dir, "posts.json");
const dailyFilePath = path.join(dir, "daily.json");

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const data = await fetchPosts("/blog");
const dailyData = await fetchPosts("/daily");
writeFileSync(filePath, JSON.stringify(data, null, 2));
writeFileSync(dailyFilePath, JSON.stringify(dailyData));

console.log("✅ 파일 저장 완료!");
