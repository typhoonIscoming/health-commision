import { defineStore } from 'pinia';

export const FONT_SIZE_STORAGE_KEY = 'health-commision-font-size';

export const FONT_SIZE_OPTIONS = [
	{
		key: 'extra-large',
		label: '特大',
		sizes: {
			title: '22px',
			subtitle: '20px',
			text: '18px',
			tip: '16px',
		},
	},
	{
		key: 'large',
		label: '大号',
		sizes: {
			title: '20px',
			subtitle: '18px',
			text: '17px',
			tip: '15px',
		},
	},
	{
		key: 'medium',
		label: '中号',
		sizes: {
			title: '18px',
			subtitle: '17px',
			text: '16px',
			tip: '14px',
		},
	},
	{
		key: 'normal',
		label: '正常',
		sizes: {
			title: '17px',
			subtitle: '16px',
			text: '15px',
			tip: '14px',
		},
	},
	{
		key: 'small',
		label: '小',
		sizes: {
			title: '15px',
			subtitle: '14px',
			text: '13px',
			tip: '12px',
		},
	},
];

export const getFontSizeByKey = (key) => {
	return (
		FONT_SIZE_OPTIONS.find((item) => item.key === key) ||
		FONT_SIZE_OPTIONS[3]
	);
};

export default defineStore('fontSize', {
	state: () => {
		const savedKey = uni.getStorageSync(FONT_SIZE_STORAGE_KEY) || 'normal';
		const current = getFontSizeByKey(savedKey);
		return {
			selected: current.key,
			config: current,
		};
	},
	getters: {
		fontStyle: (state) => ({
			'--app-font-size-title': state.config.sizes.title,
			'--app-font-size-subtitle': state.config.sizes.subtitle,
			'--app-font-size-text': state.config.sizes.text,
			'--app-font-size-tip': state.config.sizes.tip,
		}),
	},
	actions: {
		initFromStorage() {
			const savedKey =
				uni.getStorageSync(FONT_SIZE_STORAGE_KEY) || 'normal';
			const current = getFontSizeByKey(savedKey);
			this.selected = current.key;
			this.config = current;
		},
		setFontSize(key) {
			const next = getFontSizeByKey(key);
			this.selected = next.key;
			this.config = next;
			uni.setStorageSync(FONT_SIZE_STORAGE_KEY, next.key);
		},
	},
});
