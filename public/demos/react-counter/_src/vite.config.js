import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base는 빌드 시 --base ./ 로 주입(자기완결 상대경로 — 헷지 ③).
export default defineConfig({
  plugins: [react()],
});
