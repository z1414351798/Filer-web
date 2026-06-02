import React, { useState } from 'react'
import { createJob } from '../api/filerApi'
import toast from 'react-hot-toast'
import { Zap } from 'lucide-react'

const FIELDS = {
  IMAGE_RESIZE:       ['width', 'height'],
  IMAGE_COMPRESS:     ['quality'],
  IMAGE_ROTATE:       ['angle'],
  IMAGE_WATERMARK:    ['watermarkText'],
  IMAGE_CROP:         ['cropX', 'cropY', 'cropWidth', 'cropHeight'],
  IMAGE_BLUR:         ['blurRadius'],
  IMAGE_BRIGHTNESS:   ['brightness'],
  PDF_SPLIT:          ['splitPage'],
  PDF_ENCRYPT:        ['password'],
  PDF_DECRYPT:        ['password'],
  OCR_IMAGE:          ['language'],
  OCR_PDF:            ['language'],
  BARCODE_GENERATE:   ['qrText', 'barcodeFormat', 'width', 'height'],
  FILE_CHECKSUM:      ['checksumAlgorithm'],
  TEXT_TO_PDF:        ['textContent'],
  MARKDOWN_TO_HTML:   ['textContent'],
  MARKDOWN_TO_PDF:    ['textContent'],
}

const DEFAULTS = {
  width: 800, height: 600, quality: 0.7, angle: 90,
  watermarkText: 'FILER',
  cropX: 0, cropY: 0, cropWidth: 400, cropHeight: 400,
  blurRadius: 3,
  brightness: 1.3,
  splitPage: 1, password: '',
  language: 'eng',
  qrText: '', barcodeFormat: 'CODE_128',
  checksumAlgorithm: 'SHA-256',
  textContent: '',
}

export default function ConversionForm({ fileInfo, conversionType, onJobCreated }) {
  const [fields, setFields] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)

  if (!conversionType) return null
  if (conversionType === 'QR_GENERATE') return null

  const needed = FIELDS[conversionType] ?? []
  const set = (k, v) => setFields(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        fileId: fileInfo?.fileId ?? null,
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

  return (
    <form onSubmit={handleSubmit} className="card border border-brand-500/30 space-y-4">
      <p className="font-semibold text-brand-400 text-sm">
        {conversionType.replace(/_/g, ' ')}
      </p>

      {needed.includes('width')  && <NumField label="Width (px)"  value={fields.width}  onChange={v => set('width', v)}  min={1} max={10000} />}
      {needed.includes('height') && <NumField label="Height (px)" value={fields.height} onChange={v => set('height', v)} min={1} max={10000} />}

      {needed.includes('cropX')      && <NumField label="Crop X"      value={fields.cropX}      onChange={v => set('cropX', v)}      min={0} />}
      {needed.includes('cropY')      && <NumField label="Crop Y"      value={fields.cropY}      onChange={v => set('cropY', v)}      min={0} />}
      {needed.includes('cropWidth')  && <NumField label="Crop Width"  value={fields.cropWidth}  onChange={v => set('cropWidth', v)}  min={1} />}
      {needed.includes('cropHeight') && <NumField label="Crop Height" value={fields.cropHeight} onChange={v => set('cropHeight', v)} min={1} />}

      {needed.includes('angle')     && <NumField label="Angle (degrees)"  value={fields.angle}     onChange={v => set('angle', v)} />}
      {needed.includes('splitPage') && <NumField label="Split after page" value={fields.splitPage} onChange={v => set('splitPage', v)} min={1} />}

      {needed.includes('blurRadius') && (
        <SliderField label="Blur Radius" min={1} max={15} step={1}
          value={fields.blurRadius} onChange={v => set('blurRadius', v)}
          display={v => v} />
      )}
      {needed.includes('quality') && (
        <SliderField label="Quality" min={0.1} max={1} step={0.05}
          value={fields.quality} onChange={v => set('quality', v)}
          display={v => Math.round(v * 100) + '%'} />
      )}
      {needed.includes('brightness') && (
        <SliderField label="Brightness" min={0.2} max={3} step={0.1}
          value={fields.brightness} onChange={v => set('brightness', v)}
          display={v => Number(v).toFixed(1) + '×'} />
      )}

      {needed.includes('watermarkText') && <TextField label="Watermark Text" value={fields.watermarkText} onChange={v => set('watermarkText', v)} />}
      {needed.includes('password')      && <TextField label="Password" type="password" value={fields.password} onChange={v => set('password', v)} />}
      {needed.includes('qrText')        && <TextField label="Text / URL" value={fields.qrText} onChange={v => set('qrText', v)} placeholder="123456789012" />}

      {needed.includes('language') && (
        <SelectField label="OCR Language" value={fields.language} onChange={v => set('language', v)}
          options={[
            { value: 'eng',     label: 'English' },
            { value: 'chi_sim', label: 'Chinese (Simplified)' },
            { value: 'chi_tra', label: 'Chinese (Traditional)' },
            { value: 'jpn',     label: 'Japanese' },
            { value: 'kor',     label: 'Korean' },
            { value: 'fra',     label: 'French' },
            { value: 'deu',     label: 'German' },
            { value: 'spa',     label: 'Spanish' },
          ]} />
      )}
      {needed.includes('barcodeFormat') && (
        <SelectField label="Barcode Format" value={fields.barcodeFormat} onChange={v => set('barcodeFormat', v)}
          options={[
            { value: 'CODE_128', label: 'Code 128 (general purpose)' },
            { value: 'EAN_13',   label: 'EAN-13 (retail)' },
          ]} />
      )}
      {needed.includes('checksumAlgorithm') && (
        <SelectField label="Algorithm" value={fields.checksumAlgorithm} onChange={v => set('checksumAlgorithm', v)}
          options={[
            { value: 'MD5',     label: 'MD5' },
            { value: 'SHA-256', label: 'SHA-256' },
            { value: 'SHA-512', label: 'SHA-512' },
          ]} />
      )}

      {needed.includes('textContent') && (
        <label className="block">
          <span className="text-xs text-slate-400 mb-1 block">
            {conversionType.startsWith('MARKDOWN') ? 'Markdown content' : 'Text content'}
            {fileInfo && ' — leave blank to use uploaded file'}
          </span>
          <textarea
            rows={6}
            value={fields.textContent}
            onChange={e => set('textContent', e.target.value)}
            placeholder={conversionType.startsWith('MARKDOWN')
              ? '# Heading\n\nYour **markdown** here…'
              : 'Your text here…'}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-brand-500"
          />
        </label>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2">
        <Zap size={15} />{loading ? 'Queuing…' : 'Start Conversion'}
      </button>
    </form>
  )
}

// Number inputs — always emit a JS number so Jackson gets a proper integer/float
function NumField({ label, value, onChange, min, max }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <input
        type="number" value={value} min={min} max={max}
        onChange={e => onChange(e.target.valueAsNumber)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
      />
    </label>
  )
}

function TextField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
      />
    </label>
  )
}

function SliderField({ label, min, max, step, value, onChange, display }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label} ({display(Number(value))})</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand-500" />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
