import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh' || i18n.language?.startsWith('zh')

  return (
    <button
      onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
      title="Switch language / 切换语言"
    >
      {isZh ? 'EN' : '中文'}
    </button>
  )
}
