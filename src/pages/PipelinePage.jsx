import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Play, Download, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

// Curated list of pipeline-able operations grouped by category
const PIPELINE_OPS = [
  { group: 'Image Format', ops: [
    { value: 'IMAGE_TO_JPG', label: 'Convert to JPG' },
    { value: 'IMAGE_TO_PNG', label: 'Convert to PNG' },
    { value: 'IMAGE_TO_WEBP', label: 'Convert to WebP' },
  ]},
  { group: 'Image Edit', ops: [
    { value: 'IMAGE_RESIZE', label: 'Resize', params: [
      { key: 'targetWidth', label: 'Width', type: 'number', default: 800 },
      { key: 'targetHeight', label: 'Height', type: 'number', default: 600 },
    ]},
    { value: 'IMAGE_COMPRESS', label: 'Compress', params: [
      { key: 'quality', label: 'Quality (0-100)', type: 'number', default: 80 },
    ]},
    { value: 'IMAGE_ROTATE', label: 'Rotate', params: [
      { key: 'rotateDegrees', label: 'Degrees', type: 'select', options: ['90','180','270'], default: '90' },
    ]},
    { value: 'IMAGE_FLIP_H', label: 'Flip Horizontal' },
    { value: 'IMAGE_FLIP_V', label: 'Flip Vertical' },
    { value: 'IMAGE_GRAYSCALE', label: 'Grayscale' },
    { value: 'IMAGE_WATERMARK', label: 'Watermark', params: [
      { key: 'watermarkText', label: 'Text', type: 'text', default: 'WATERMARK' },
    ]},
  ]},
  { group: 'Image Filters', ops: [
    { value: 'IMAGE_SEPIA', label: 'Sepia' },
    { value: 'IMAGE_INVERT', label: 'Invert' },
    { value: 'IMAGE_BLUR', label: 'Blur', params: [
      { key: 'blurRadius', label: 'Radius', type: 'number', default: 3 },
    ]},
    { value: 'IMAGE_SHARPEN', label: 'Sharpen' },
    { value: 'IMAGE_BRIGHTNESS', label: 'Brightness', params: [
      { key: 'brightness', label: 'Factor (0.1-3)', type: 'number', default: 1.2 },
    ]},
    { value: 'IMAGE_NOISE_REDUCE', label: 'Noise Reduce' },
  ]},
  { group: 'Image Enhance', ops: [
    { value: 'IMAGE_BORDER', label: 'Add Border', params: [
      { key: 'borderSize', label: 'Size (px)', type: 'number', default: 10 },
      { key: 'borderColor', label: 'Color (hex)', type: 'text', default: '000000' },
    ]},
    { value: 'IMAGE_ROUND_CORNERS', label: 'Round Corners', params: [
      { key: 'cornerRadius', label: 'Radius', type: 'number', default: 20 },
    ]},
    { value: 'IMAGE_CAPTION', label: 'Add Caption', params: [
      { key: 'captionText', label: 'Caption', type: 'text', default: '' },
      { key: 'captionPosition', label: 'Position', type: 'select', options: ['bottom','top'], default: 'bottom' },
    ]},
    { value: 'IMAGE_EXIF_STRIP', label: 'Strip EXIF' },
  ]},
  { group: 'PDF', ops: [
    { value: 'PDF_COMPRESS', label: 'Compress PDF' },
    { value: 'PDF_LINEARIZE', label: 'Linearize PDF' },
    { value: 'PDF_GRAYSCALE', label: 'Grayscale PDF' },
    { value: 'PDF_FLATTEN', label: 'Flatten PDF' },
    { value: 'PDF_ADD_PAGE_NUMBERS', label: 'Add Page Numbers' },
    { value: 'PDF_WATERMARK', label: 'PDF Watermark', params: [
      { key: 'watermarkText', label: 'Text', type: 'text', default: 'DRAFT' },
    ]},
    { value: 'PDF_EXTRACT_TEXT', label: 'Extract Text' },
    { value: 'PDF_TO_HTML', label: 'PDF to HTML' },
  ]},
  { group: 'Data', ops: [
    { value: 'JSON_FORMAT', label: 'Format JSON' },
    { value: 'JSON_MINIFY', label: 'Minify JSON' },
    { value: 'JSON_FLATTEN', label: 'Flatten JSON' },
    { value: 'JSON_UNFLATTEN', label: 'Unflatten JSON' },
    { value: 'XML_FORMAT', label: 'Format XML' },
    { value: 'HTML_MINIFY', label: 'Minify HTML' },
    { value: 'CSV_DEDUP', label: 'CSV Dedup' },
    { value: 'CSV_SORT', label: 'CSV Sort', params: [
      { key: 'sortColumn', label: 'Column (name or #)', type: 'text', default: '1' },
    ]},
  ]},
  { group: 'Audio', ops: [
    { value: 'AUDIO_NORMALIZE', label: 'Normalize Audio' },
    { value: 'AUDIO_VOLUME', label: 'Adjust Volume', params: [
      { key: 'volumeFactor', label: 'Factor (0.1-4)', type: 'number', default: 1.5 },
    ]},
  ]},
]

const ALL_OPS = PIPELINE_OPS.flatMap(g => g.ops)
const opByValue = Object.fromEntries(ALL_OPS.map(op => [op.value, op]))

function StepCard({ step, index, total, onChange, onRemove }) {
  const op = opByValue[step.type] ?? null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{index+1}</span>
        <select
          value={step.type}
          onChange={e => onChange({ ...step, type: e.target.value, options: {} })}
          className="flex-1 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">— Select operation —</option>
          {PIPELINE_OPS.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.ops.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
            </optgroup>
          ))}
        </select>
        <button onClick={onRemove} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
      </div>
      {op?.params?.map(param => (
        <div key={param.key} className="ml-10 mb-2 flex items-center gap-2">
          <label className="text-xs text-slate-400 w-28 flex-shrink-0">{param.label}</label>
          {param.type === 'select' ? (
            <select
              value={step.options?.[param.key] ?? param.default}
              onChange={e => onChange({ ...step, options: { ...step.options, [param.key]: e.target.value } })}
              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs focus:outline-none"
            >
              {param.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              type={param.type === 'number' ? 'number' : 'text'}
              value={step.options?.[param.key] ?? param.default}
              onChange={e => onChange({ ...step, options: { ...step.options, [param.key]: param.type === 'number' ? Number(e.target.value) : e.target.value } })}
              className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs w-24 focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PipelinePage() {
  const { t } = useTranslation()
  const [fileId, setFileId]   = useState('')
  const [file, setFile]       = useState(null)
  const [steps, setSteps]     = useState([{ type: '', options: {} }])
  const [running, setRunning] = useState(false)
  const [result, setResult]   = useState(null)
  const fileRef = useRef()

  const uploadFile = async (f) => {
    const fd = new FormData(); fd.append('file', f)
    const token = localStorage.getItem('filer_token')
    const res = await fetch('/api/files/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
    const data = await res.json()
    return data?.data?.fileId
  }

  const run = async () => {
    const validSteps = steps.filter(s => s.type)
    if (!file && !fileId) { toast.error('Upload a file first'); return }
    if (validSteps.length === 0) { toast.error('Add at least one step'); return }
    setRunning(true); setResult(null)
    try {
      let fid = fileId
      if (file) { fid = await uploadFile(file); if (!fid) throw new Error('Upload failed') }
      const token = localStorage.getItem('filer_token')
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileId: fid, steps: validSteps.map(s => ({ conversionType: s.type, options: s.options ?? {} })) })
      })
      const data = await res.json()
      if (res.ok && data?.data) { setResult(data.data); toast.success(t('pipeline.result')) }
      else toast.error(data?.message || 'Pipeline failed')
    } catch (e) { toast.error(e.message) }
    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">{t('pipeline.title')}</h1>
        <p className="text-slate-400 text-sm mb-8">{t('pipeline.subtitle')}</p>

        {/* File upload */}
        <div className="bg-slate-800 rounded-xl p-5 mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Input File</label>
          <div className="flex gap-3 items-center">
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              {file ? file.name : t('common.upload')}
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={e => { setFile(e.target.files[0]); setFileId('') }} />
            <span className="text-slate-500 text-xs">or</span>
            <input value={fileId} onChange={e => { setFileId(e.target.value); setFile(null) }}
              placeholder="Paste file ID"
              className="flex-1 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} total={steps.length}
              onChange={updated => setSteps(steps.map((s, j) => j === i ? updated : s))}
              onRemove={() => setSteps(steps.filter((_, j) => j !== i))} />
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          {steps.length < 10 && (
            <button onClick={() => setSteps([...steps, { type: '', options: {} }])}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
              <Plus size={16} />{t('pipeline.addStep')}
            </button>
          )}
          <button onClick={run} disabled={running}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors ml-auto">
            <Play size={16} />{running ? t('pipeline.running') : t('pipeline.run')}
          </button>
        </div>

        {result && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-5">
            <div className="font-medium text-green-300 mb-3">{t('pipeline.result')}</div>
            <div className="text-xs text-slate-400 mb-4">Steps executed: {result.stepsExecuted}</div>
            <a href={result.downloadUrl} download
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm w-fit transition-colors">
              <Download size={16} />{t('pipeline.download')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
