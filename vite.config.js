import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		uni(),
		AutoImport({
			imports: ['vue', 'uni-app'],
			dirs: ['src/utils', 'src/store/**'],
		}),
	],
	server: {
		open: true,
		proxy: {
			// 或者更详细的配置
			'/api': {
				target: 'https://www.2g2b.cn',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
			'/cgi-bin': {
				target: 'https://api.weixin.qq.com',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, '/api'),
			},
		},
	},
});
