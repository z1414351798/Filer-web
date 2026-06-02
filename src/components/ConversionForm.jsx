import React, { useState } from 'react'
import { createJob } from '../api/filerApi'
import toast from 'react-hot-toast'
import { Zap } from 'lucide-react'

const NEEDS_OPTIONS = {
  IMAGE_RESIZE:    ['width', 'height'],
  IMAGE_COMPRESS:  ['quality'],
  IMAGE_ROTATE:    ['angle'],
  IMAGE_WATERMARK: ['watermarkText'],
  PDF_SPLIT:       ['splitPage'],
  PDF_ENCRYPT:     ['password'],
  PDF_DECRYPT:     ['password'],
  OCR_IMAGE:       ['language'],
  OCR_PDF:         ['language'],
}

export default function ConversionForm({ fileInfo, conversionType, onJobCreated }) {
  const [fields, setFields] = useState({
    width: 800, height: 600, quality: 0.7,
    angle: 90, watermarkText: 'FILER',
    splitPage: 1, password: '', language: 'eng'
  })
  const [loading, setLoading] = useState(false)

  if (!fileInfo || !conversionType) return null

  const needed = NEEDS_OPTIONS[conversionType] ?? []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        fileId: fileInfo.fileId,
        conversionType,
        ...Object.fromEntries(needed.map(k => [k, fields[k]]))
      }
      const { data } = await createJob(payload)
      toast.success('Job queued!')
      onJobCreated(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', extra = {}) => (
    <label key={key} className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <input
        type={type}
        value={fields[key]}
        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
        {...extra}
      />
    </label>
  )

  return (
    <form onSubmit={handleSubmit} className="card border border-brand-500/30 space-y-4">
      <p className="font-semibold text-brand-400">Options for {conversionType.replace(/_/g, ' ')}</p>
      {needed.includes('width')  && field('width',  'Width (px)',   'number', { min: 1, max: 10000 })}
      {needed.includes('height') && field('height', 'Height (px)',  'number', { min: 1, max: 10000 })}
      {needed.includes('quality') && (
        <label className="block">
          <span className="text-xs text-slate-400 mb-1 block">Quality ({Math.round(fields.quality * 100)}%)</span>
          <input type="range" min="0.1" max="1" step="0.05"
            value={fields.quality}
            onChange={e => setFields(f => ({ ...f, quality: parseFloat(e.target.value) }))}
            className="w-full accent-brand-500" />
        </label>
      )}
      {needed.includes('angle')         && field('angle',         'Angle (degrees)', 'number')}
      {needed.includes('watermarkText') && field('watermarkText', 'Watermark Text')}
      {needed.includes('splitPage')     && field('splitPage',     'Split after page #', 'number', { min: 1 })}
      {needed.includes('password')      && field('password',      'Password', 'password')}
      {needed.includes('language') && (
        <label className="block">
          <span className="text-xs text-slate-400 mb-1 block">OCR Language</span>
          <select
            value={fields.language}
            onChange={e => setFields(f => ({ ...f, language: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
          >
            <option value="eng">English</option>
            <option value="chi_sim">Chinese (Simplified)</option>
            <option value="chi_tra">Chinese (Traditional)</option>
            <option value="jpn">Japanese</option>
            <option value="kor">Korean</option>
            <option value="fra">French</option>
            <option value="deu">German</option>
            <option value="spa">Spanish</option>
          </select>
        </label>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        <Zap size={16} />{loading ? 'Queuing...' : 'Start Conversion'}
      </button>
    </form>
  )
}
