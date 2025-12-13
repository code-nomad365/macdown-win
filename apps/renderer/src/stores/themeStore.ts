import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme =
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'retro'
  | 'cyberpunk'
  | 'valentine'
  | 'halloween'
  | 'garden'
  | 'forest'
  | 'aqua'
  | 'lofi'
  | 'pastel'
  | 'fantasy'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'cmyk'
  | 'autumn'
  | 'business'
  | 'acid'
  | 'lemonade'
  | 'night'
  | 'coffee'
  | 'winter'
  | 'dim'
  | 'nord'
  | 'sunset';

export const THEMES: Theme[] = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
];

// 主題中文名稱對照表
export const THEME_NAMES: Record<Theme, string> = {
  light: '明亮',
  dark: '深色',
  cupcake: '杯子蛋糕',
  bumblebee: '大黃蜂',
  emerald: '翡翠綠',
  corporate: '企業風',
  synthwave: '合成波',
  retro: '復古',
  cyberpunk: '賽博龐克',
  valentine: '情人節',
  halloween: '萬聖節',
  garden: '花園',
  forest: '森林',
  aqua: '水藍',
  lofi: 'Lo-Fi',
  pastel: '粉彩',
  fantasy: '幻想',
  wireframe: '線框',
  black: '黑色',
  luxury: '奢華',
  dracula: '德古拉',
  cmyk: 'CMYK',
  autumn: '秋天',
  business: '商務',
  acid: '酸性',
  lemonade: '檸檬水',
  night: '夜晚',
  coffee: '咖啡',
  winter: '冬天',
  dim: '昏暗',
  nord: '北歐',
  sunset: '日落',
};

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'macdown-theme',
    }
  )
);
