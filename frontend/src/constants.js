import {flags} from './assets/flags/flags'

export const ACCESS_TOKEN ="access"
export const REFRESH_TOKEN = "refresh"
export const LANGUAGES_OPTIONS = [
  { code: "en", name: "English", flag: flags.united_states },
  { code: "ru", name: "Русский", flag: flags.russian_flag },
  { code: "zh", name: "中文", flag: flags.chinese_flag },
]

export const SLIDE_INTERVAL = 3000