// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Git/Test-proj/node_modules/.pnpm/vite@5.4.20_@types+node@20.19.13/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Git/Test-proj/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.20_vue@3.5.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import federation from "file:///D:/Git/Test-proj/node_modules/.pnpm/@originjs+vite-plugin-federation@1.4.1/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_dirname = "D:\\Git\\Test-proj\\apps\\shell";
var __vite_injected_original_import_meta_url = "file:///D:/Git/Test-proj/apps/shell/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, __vite_injected_original_dirname, "");
  return {
    plugins: [
      vue(),
      federation({
        name: "shell",
        remotes: {
          pharmacy: {
            // فقط URL — بدون name@
            external: env.VITE_PHARMACY_REMOTE || "http://localhost:5174/assets/remoteEntry.js",
            format: "esm",
            // چون ریموتت هم با Vite ساخته میشه
            from: "vite"
            // مهم: منبع ریموت Vite است، نه Webpack
          }
        },
        shared: {
          vue: { singleton: true, strictVersion: true, version: "3.4.15" },
          "vue-router": { singleton: true, strictVersion: true, version: "4.2.5" },
          pinia: { singleton: true, strictVersion: true, version: "2.1.7" }
        }
      })
    ],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) } },
    server: { port: 5173 },
    build: { target: "esnext" }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxHaXRcXFxcVGVzdC1wcm9qXFxcXGFwcHNcXFxcc2hlbGxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEdpdFxcXFxUZXN0LXByb2pcXFxcYXBwc1xcXFxzaGVsbFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovR2l0L1Rlc3QtcHJvai9hcHBzL3NoZWxsL3ZpdGUuY29uZmlnLnRzXCI7Ly8gYXBwcy9zaGVsbC92aXRlLmNvbmZpZy50c1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IGZlZGVyYXRpb24gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWZlZGVyYXRpb24nXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgX19kaXJuYW1lLCAnJylcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIGZlZGVyYXRpb24oe1xyXG4gICAgICAgIG5hbWU6ICdzaGVsbCcsXHJcbiAgICAgICAgcmVtb3Rlczoge1xyXG4gICAgICAgICAgcGhhcm1hY3k6IHtcclxuICAgICAgICAgICAgLy8gXHUwNjQxXHUwNjQyXHUwNjM3IFVSTCBcdTIwMTQgXHUwNjI4XHUwNjJGXHUwNjQ4XHUwNjQ2IG5hbWVAXHJcbiAgICAgICAgICAgIGV4dGVybmFsOiBlbnYuVklURV9QSEFSTUFDWV9SRU1PVEUgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3NC9hc3NldHMvcmVtb3RlRW50cnkuanMnLFxyXG4gICAgICAgICAgICBmb3JtYXQ6ICdlc20nLCAgIC8vIFx1MDY4Nlx1MDY0OFx1MDY0NiBcdTA2MzFcdTA2Q0NcdTA2NDVcdTA2NDhcdTA2MkFcdTA2MkEgXHUwNjQ3XHUwNjQ1IFx1MDYyOFx1MDYyNyBWaXRlIFx1MDYzM1x1MDYyN1x1MDYyRVx1MDYyQVx1MDY0NyBcdTA2NDVcdTA2Q0NcdTA2MzRcdTA2NDdcclxuICAgICAgICAgICAgZnJvbTogJ3ZpdGUnLCAgICAvLyBcdTA2NDVcdTA2NDdcdTA2NDU6IFx1MDY0NVx1MDY0Nlx1MDYyOFx1MDYzOSBcdTA2MzFcdTA2Q0NcdTA2NDVcdTA2NDhcdTA2MkEgVml0ZSBcdTA2MjdcdTA2MzNcdTA2MkFcdTA2MEMgXHUwNjQ2XHUwNjQ3IFdlYnBhY2tcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaGFyZWQ6IHtcclxuICAgICAgICAgIHZ1ZTogeyBzaW5nbGV0b246IHRydWUsIHN0cmljdFZlcnNpb246IHRydWUsIHZlcnNpb246ICczLjQuMTUnIH0sXHJcbiAgICAgICAgICAndnVlLXJvdXRlcic6IHsgc2luZ2xldG9uOiB0cnVlLCBzdHJpY3RWZXJzaW9uOiB0cnVlLCB2ZXJzaW9uOiAnNC4yLjUnIH0sXHJcbiAgICAgICAgICBwaW5pYTogeyBzaW5nbGV0b246IHRydWUsIHN0cmljdFZlcnNpb246IHRydWUsIHZlcnNpb246ICcyLjEuNycgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICByZXNvbHZlOiB7IGFsaWFzOiB7ICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpIH0gfSxcclxuICAgIHNlcnZlcjogeyBwb3J0OiA1MTczIH0sXHJcbiAgICBidWlsZDogeyB0YXJnZXQ6ICdlc25leHQnIH0sXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsZUFBZSxXQUFXO0FBSm5DLElBQU0sbUNBQW1DO0FBQThILElBQU0sMkNBQTJDO0FBTXhOLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sa0NBQVcsRUFBRTtBQUV2QyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixXQUFXO0FBQUEsUUFDVCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxVQUFVO0FBQUE7QUFBQSxZQUVSLFVBQVUsSUFBSSx3QkFBd0I7QUFBQSxZQUN0QyxRQUFRO0FBQUE7QUFBQSxZQUNSLE1BQU07QUFBQTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixLQUFLLEVBQUUsV0FBVyxNQUFNLGVBQWUsTUFBTSxTQUFTLFNBQVM7QUFBQSxVQUMvRCxjQUFjLEVBQUUsV0FBVyxNQUFNLGVBQWUsTUFBTSxTQUFTLFFBQVE7QUFBQSxVQUN2RSxPQUFPLEVBQUUsV0FBVyxNQUFNLGVBQWUsTUFBTSxTQUFTLFFBQVE7QUFBQSxRQUNsRTtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUMsRUFBRSxFQUFFO0FBQUEsSUFDNUUsUUFBUSxFQUFFLE1BQU0sS0FBSztBQUFBLElBQ3JCLE9BQU8sRUFBRSxRQUFRLFNBQVM7QUFBQSxFQUM1QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
