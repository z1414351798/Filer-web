import { useState } from 'react'
import toast from 'react-hot-toast'
import { Zap } from 'lucide-react'

const FIELDS = {
  IMAGE_RESIZE:         ['targetWidth', 'targetHeight'],
  IMAGE_COMPRESS:       ['quality'],
  IMAGE_ROTATE:         ['rotateDegrees'],
  IMAGE_WATERMARK:      ['watermarkText'],
  IMAGE_CROP:           ['cropX', 'cropY', 'cropWidth', 'cropHeight'],
  IMAGE_BLUR:           ['blurRadius'],
  IMAGE_BRIGHTNESS:     ['brightness'],
  IMAGE_COLLAGE:        ['cols'],
  IMAGE_BORDER:         ['borderSize', 'borderColor'],
  IMAGE_ROUND_CORNERS:  ['cornerRadius'],
  IMAGE_COLOR_PALETTE:  ['paletteCount'],
  PDF_SPLIT:            ['splitPage'],
  PDF_ENCRYPT:          ['password'],
  PDF_DECRYPT:          ['password'],
  PDF_WATERMARK:        ['watermarkText', 'watermarkOpacity'],
  PDF_PAGE_ROTATE:      ['pageIndex', 'rotationDegrees'],
  OCR_IMAGE:            ['language'],
  OCR_PDF:              ['language'],
  QR_GENERATE:          ['qrContent'],
  BARCODE_GENERATE:     ['barcodeContent', 'barcodeFormat'],
  TEXT_TO_PDF:          ['textContent'],
  MARKDOWN_TO_HTML:     ['textContent'],
  MARKDOWN_TO_PDF:      ['textContent'],
  TEXT_DIFF:            ['diffFileId'],
  VIDEO_THUMBNAIL:      ['videoSecond'],
  VIDEO_TO_GIF:         ['videoSecond', 'videoDuration', 'videoFps'],
}

const DEFAULTS = {
  targetWidth: 800, targetHeight: 600,
  quality: 75,
  rotateDegrees: 90,
  watermarkText: 'FILER',
  watermarkOpacity: 0.3,
  cropX: 0, cropY: 0, cropWidth: 400, cropHeight: 400,
  blurRadius: 3,
  brightness: 1.3,
  cols: 3,
  borderSize: 20, borderColor: '#000000',
  cornerRadius: 30,
  paletteCount: 6,
  splitPage: 1,
  pageIndex: 0, rotationDegrees: 90,
  password: '',
  language: 'eng',
  qrContent: '', barcodeContent: '', barcodeFormat: 'CODE_128',
  textContent: '',
  diffFileId: '',
  videoSecond: 1, videoDuration: 5, videoFps: 10,
}

export default function ConversionForm({ type, file, onSubmit }) {
  const [fields, setFields] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)

  if (!type) return null

  const needed = FIELDS[type] ?? []
  const set = (k, v) => setFields(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = Object.fromEntries(needed.map(k => [k, fields[k]]))
      await onSubmit(params)
      toast.success('Job queued!')
    } catch (err) {
      toast.error(err?.message || 'Failed to start')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Numeric fields */}
      {needed.includes('targetWidth')    && <NumField label="Width (px)"       value={fields.targetWidth}    onChange={v => set('targetWidth', v)}    min={1} max={10000} />}
      {needed.includes('targetHeight')   && <NumField label="Height (px)"      value={fields.targetHeight}   onChange={v => set('targetHeight', v)}   min={1} max={10000} />}
      {needed.includes('cropX')          && <NumField label="Crop X"            value={fields.cropX}          onChange={v => set('cropX', v)}          min={0} />}
      {needed.includes('cropY')          && <NumField label="Crop Y"            value={fields.cropY}          onChange={v => set('cropY', v)}          min={0} />}
      {needed.includes('cropWidth')      && <NumField label="Crop Width"        value={fields.cropWidth}      onChange={v => set('cropWidth', v)}      min={1} />}
      {needed.includes('cropHeight')     && <NumField label="Crop Height"       value={fields.cropHeight}     onChange={v => set('cropHeight', v)}     min={1} />}
      {needed.includes('rotateDegrees')  && <NumField label="Rotate degrees"    value={fields.rotateDegrees}  onChange={v => set('rotateDegrees', v)}  step={90} />}
      {needed.includes('splitPage')      && <NumField label="Split after page"  value={fields.splitPage}      onChange={v => set('splitPage', v)}      min={1} />}
      {needed.includes('pageIndex')      && <NumField label="Page index (0-based)" value={fields.pageIndex}  onChange={v => set('pageIndex', v)}      min={0} />}
      {needed.includes('rotationDegrees') && <NumField label="Rotation degrees" value={fields.rotationDegrees} onChange={v => set('rotationDegrees', v)} step={90} />}
      {needed.includes('cols')           && <NumField label="Columns"           value={fields.cols}           onChange={v => set('cols', v)}           min={1} max={10} />}
      {needed.includes('borderSize')     && <NumField label="Border size (px)" value={fields.borderSize}     onChange={v => set('borderSize', v)}     min={1} max={200} />}
      {needed.includes('cornerRadius')   && <NumField label="Corner radius (px)" value={fields.cornerRadius} onChange={v => set('cornerRadius', v)}   min={1} max={300} />}
      {needed.includes('paletteCount')   && <NumField label="Color count"       value={fields.paletteCount}   onChange={v => set('paletteCount', v)}   min={1} max={20} />}
      {needed.includes('videoSecond')    && <NumField label="Start second"      value={fields.videoSecond}    onChange={v => set('videoSecond', v)}    min={0} />}
      {needed.includes('videoDuration')  && <NumField label="Duration (s, max 10)" value={fields.videoDuration} onChange={v => set('videoDuration', v)} min={1} max={10} />}
      {needed.includes('videoFps')       && <NumField label="FPS (max 15)"      value={fields.videoFps}       onChange={v => set('videoFps', v)}       min={1} max={15} />}

      {/* Sliders */}
      {needed.includes('quality') && (
        <SliderField label="Quality" min={10} max={100} step={5}
          value={fields.quality} onChange={v => set('quality', v)}
          display={v => v + '%'} />
      )}
      {needed.includes('blurRadius') && (
        <SliderField label="Blur radius" min={1} max={20} step={1}
          value={fields.blurRadius} onChange={v => set('blurRadius', v)}
          display={v => v} />
      )}
      {needed.includes('brightness') && (
        <SliderField label="Brightness" min={0.2} max={3} step={0.1}
          value={fields.brightness} onChange={v => set('brightness', v)}
          display={v => Number(v).toFixed(1) + '×'} />
      )}
      {needed.includes('watermarkOpacity') && (
        <SliderField label="Watermark opacity" min={0.05} max={1} step={0.05}
          value={fields.watermarkOpacity} onChange={v => set('watermarkOpacity', v)}
          display={v => Math.round(Number(v) * 100) + '%'} />
      )}

      {/* Text fields */}
      {needed.includes('watermarkText')  && <TextField label="Watermark text"   value={fields.watermarkText}  onChange={v => set('watermarkText', v)} />}
      {needed.includes('password')       && <TextField label="Password" type="password" value={fields.password} onChange={v => set('password', v)} />}
      {needed.includes('qrContent')      && <TextField label="Text / URL to encode" value={fields.qrContent} onChange={v => set('qrContent', v)} />}
      {needed.includes('barcodeContent') && <TextField label="Barcode content"  value={fields.barcodeContent} onChange={v => set('barcodeContent', v)} />}
      {needed.includes('diffFileId')     && <TextField label="Second file ID (for diff)" value={fields.diffFileId} onChange={v => set('diffFileId', v)} placeholder="Upload 2nd file, paste its fileId here" />}
      {needed.includes('borderColor')    && (
        <label className="block">
          <span className="text-xs text-slate-400 mb-1 block">Border color</span>
          <input type="color" value={fields.borderColor}
            onChange={e => set('borderColor', e.target.value)}
            className="h-9 w-20 rounded border-0 bg-transparent cursor-pointer" />
        </label>
      )}

      {/* Select fields */}
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
            { value: 'CODE_128', label: 'Code 128' },
            { value: 'EAN_13',   label: 'EAN-13' },
            { value: 'QR_CODE',  label: 'QR Code' },
          ]} />
      )}

      {/* Textarea */}
      {needed.includes('textContent') && (
        <label className="block">
          <span className="text-xs text-slate-400 mb-1 block">
            {type.startsWith('MARKDOWN') ? 'Markdown content' : 'Text content'}
            {file && ' — leave blank to use uploaded file'}
          </span>
          <textarea rows={6} value={fields.textContent}
            onChange={e => set('textContent', e.target.value)}
            placeholder={type.startsWith('MARKDOWN') ? '# Heading\n\n**Bold** text...' : 'Your text here...'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-indigo-500"
          />
        </label>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
        <Zap size={15} />{loading ? 'Starting...' : 'Start Conversion'}
      </button>
    </form>
  )
}

function NumField({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(e.target.valueAsNumber)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
    </label>
  )
}

function TextField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
    </label>
  )
}

function SliderField({ label, min, max, step, value, onChange, display }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label} ({display(Number(value))})</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-indigo-500" />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 mb-1 block">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
