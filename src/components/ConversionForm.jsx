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
  AUDIO_CONVERT:        ['targetFormat'],
  PDF_PAGE_EXTRACT:     ['fromPage', 'toPage'],
  // Video extras
  VIDEO_TRIM:         ['startSec', 'durationSec'],
  VIDEO_COMPRESS:     ['quality'],
  // Audio extras
  AUDIO_TRIM:         ['startSec', 'durationSec'],
  // File encryption
  FILE_AES_ENCRYPT:   ['password'],
  FILE_AES_DECRYPT:   ['password'],
  // Developer tools
  HASH_FILE:          ['hashAlgorithm'],
  // Image extras
  IMAGE_MEME:         ['topText', 'bottomText'],
  IMAGE_COMPARE:      ['diffFileId'],
  PDF_CROP_MARGINS:        ['cropTop', 'cropRight', 'cropBottom', 'cropLeft'],
  PDF_REORDER_PAGES:       ['pageOrder'],
  TEXT_CASE_CONVERT:       ['caseType'],
  VIDEO_EXTRACT_FRAMES:    ['frameInterval'],
  VIDEO_ADD_WATERMARK:     ['videoWatermarkText'],
  // PDF extras
  PDF_METADATA_EDIT:    ['pdfTitle', 'pdfAuthor', 'pdfSubject', 'pdfKeywords'],
  // Video/audio
  VIDEO_SPEED_CHANGE:   ['videoSpeed'],
  AUDIO_SPLIT:          ['splitAtSec'],
  // Image animated GIF
  IMAGE_ANIMATED_GIF:   ['gifDelay'],
  // HTML
  HTML_SANITIZE:        ['sanitizeLevel'],
  // Generator tools
  UUID_GENERATE:        ['uuidCount'],
  LOREM_IPSUM:          ['loremParagraphs'],
  RANDOM_CSV:           ['randomColumns', 'randomRows'],
  // Wave 6
  PDF_TO_DOCX:          [],
  VIDEO_CONCAT:         ['fileIds'],
  // Wave 7
  BARCODE_READ:         [],
  MARKDOWN_TO_DOCX:     [],
  PDF_THUMBNAIL:        ['pageIndex'],
  VIDEO_RESIZE:         ['targetWidth', 'targetHeight'],
  AUDIO_NORMALIZE:      [],
  AUDIO_FADE:           ['fadeInDuration', 'fadeOutDuration'],
  SUBTITLE_SHIFT:       ['shiftMs'],
  REGEX_TEST:           ['regexPattern', 'regexInput', 'regexFlags'],
  PASSWORD_GENERATE:    ['pwdLength'],
  PASSPHRASE_GENERATE:  ['passphraseWords'],
  COLOR_CONVERT:        ['colorInput', 'colorFrom', 'colorTo'],
  PLACEHOLDER_IMAGE:    ['targetWidth', 'targetHeight'],
  HTML_MINIFY:          [],
  JSON_MINIFY:          [],
  XML_TO_YAML:          [],
  YAML_TO_XML:          [],
  CSV_TO_XML:           [],
  // Wave 8
  TEXT_TO_IMAGE:        ['textContent'],
  IMAGE_CAPTION:        ['captionText', 'captionPosition'],
  QR_WITH_LOGO:         ['qrContent', 'qrSize'],
  IMAGE_TO_DATA_URI:    [],
  JSON_FLATTEN:         [],
  JSON_UNFLATTEN:       [],
  CSV_DEDUP:            [],
  CSV_SORT:             ['sortColumn'],
  NUMBER_BASE_CONVERT:  ['numberInput', 'numberFrom', 'numberTo'],
  AUDIO_VOLUME:         ['volumeFactor'],
  PDF_SPLIT_BY_SIZE:    ['pagesPerChunk'],
  ZIP_ENCRYPT:          ['zipPassword', 'fileIds'],
  CRON_DESCRIBE:        ['cronExpression'],
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
  targetFormat: 'mp3',
  fromPage: 1, toPage: 5,
  startSec: 0, durationSec: 30,
  hashAlgorithm: 'SHA-256',
  topText: '', bottomText: '',
  cropTop: 36, cropRight: 36, cropBottom: 36, cropLeft: 36,
  pageOrder: '1,2,3',
  caseType: 'upper',
  frameInterval: 5,
  videoWatermarkText: 'FILER',
  pdfTitle: '', pdfAuthor: '', pdfSubject: '', pdfKeywords: '',
  videoSpeed: 2.0,
  splitAtSec: 30,
  gifDelay: 100,
  sanitizeLevel: 'basic',
  uuidCount: 10,
  loremParagraphs: 5,
  randomColumns: 'id,name,email,score',
  randomRows: 100,
  // Wave 8
  captionText: '',
  captionPosition: 'bottom',
  qrSize: 400,
  codeTheme: 'dark',
  fontSize: 14,
  sortColumn: '1',
  sortAscending: true,
  numberInput: '',
  numberFrom: 'decimal',
  numberTo: 'binary',
  volumeFactor: 1.5,
  pagesPerChunk: 5,
  zipPassword: '',
  cronExpression: '0 12 * * MON-FRI',
  // Wave 6
  fadeInDuration: 2,
  fadeOutDuration: 2,
  shiftMs: 0,
  regexPattern: '',
  regexInput: '',
  regexFlags: 'i',
  pwdLength: 16,
  pwdUppercase: true,
  pwdNumbers: true,
  pwdSymbols: false,
  passphraseWords: 4,
  colorInput: '#FF5733',
  colorFrom: 'hex',
  colorTo: 'all',
  placeholderBg: 'CCCCCC',
  placeholderLabel: '',
  fileIds: '',
}

const NO_FILE_TYPES = new Set([
  'REGEX_TEST', 'PASSWORD_GENERATE', 'PASSPHRASE_GENERATE', 'COLOR_CONVERT',
  'UUID_GENERATE', 'LOREM_IPSUM', 'RANDOM_CSV',
  'TEXT_TO_IMAGE', 'NUMBER_BASE_CONVERT', 'CRON_DESCRIBE',
])

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
      if (fields.notifyEmail) params.notifyEmail = fields.notifyEmail
      if (fields.webhookUrl)  params.webhookUrl  = fields.webhookUrl
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
      {needed.includes('fromPage')       && <NumField label="From page (1-based)" value={fields.fromPage}     onChange={v => set('fromPage', v)}       min={1} />}
      {needed.includes('toPage')         && <NumField label="To page (0 = last)"  value={fields.toPage}       onChange={v => set('toPage', v)}         min={0} />}
      {needed.includes('startSec')    && <NumField label="Start second"         value={fields.startSec}    onChange={v => set('startSec', v)}    min={0} />}
      {needed.includes('durationSec') && <NumField label="Duration (seconds)"   value={fields.durationSec} onChange={v => set('durationSec', v)} min={1} />}
      {needed.includes('cropTop')      && <NumField label="Crop Top (pt)"    value={fields.cropTop}    onChange={v => set('cropTop', v)}    min={0} max={300} />}
      {needed.includes('cropRight')    && <NumField label="Crop Right (pt)"  value={fields.cropRight}  onChange={v => set('cropRight', v)}  min={0} max={300} />}
      {needed.includes('cropBottom')   && <NumField label="Crop Bottom (pt)" value={fields.cropBottom} onChange={v => set('cropBottom', v)} min={0} max={300} />}
      {needed.includes('cropLeft')     && <NumField label="Crop Left (pt)"   value={fields.cropLeft}   onChange={v => set('cropLeft', v)}   min={0} max={300} />}
      {needed.includes('frameInterval') && <NumField label="Seconds between frames" value={fields.frameInterval} onChange={v => set('frameInterval', v)} min={1} max={60} />}
      {needed.includes('videoSpeed')     && <SliderField label="Speed multiplier" min={0.25} max={4} step={0.25} value={fields.videoSpeed} onChange={v => set('videoSpeed', v)} display={v => v + '×'} />}
      {needed.includes('splitAtSec')     && <NumField label="Split at second"   value={fields.splitAtSec}     onChange={v => set('splitAtSec', v)}     min={1} />}
      {needed.includes('gifDelay')       && <NumField label="Frame delay (cs, 100=1s)" value={fields.gifDelay} onChange={v => set('gifDelay', v)}    min={10} max={500} />}
      {needed.includes('uuidCount')      && <NumField label="Number of UUIDs"   value={fields.uuidCount}      onChange={v => set('uuidCount', v)}      min={1} max={10000} />}
      {needed.includes('loremParagraphs') && <NumField label="Paragraphs"       value={fields.loremParagraphs} onChange={v => set('loremParagraphs', v)} min={1} max={100} />}
      {needed.includes('randomRows')     && <NumField label="Number of rows"    value={fields.randomRows}     onChange={v => set('randomRows', v)}     min={1} max={10000} />}
      {needed.includes('shiftMs')         && <NumField label="Shift by (ms, negative=earlier)" value={fields.shiftMs}         onChange={v => set('shiftMs', v)}         min={-3600000} max={3600000} />}
      {needed.includes('fadeInDuration')  && <NumField label="Fade in (seconds)"   value={fields.fadeInDuration}  onChange={v => set('fadeInDuration', v)}  min={0} max={60} />}
      {needed.includes('fadeOutDuration') && <NumField label="Fade out (seconds)"  value={fields.fadeOutDuration} onChange={v => set('fadeOutDuration', v)} min={0} max={60} />}
      {needed.includes('passphraseWords') && <NumField label="Number of words"     value={fields.passphraseWords} onChange={v => set('passphraseWords', v)} min={2} max={12} />}
      {needed.includes('pwdLength')       && <NumField label="Password length"     value={fields.pwdLength}       onChange={v => set('pwdLength', v)}       min={8} max={256} />}
      {needed.includes('pagesPerChunk')  && <NumField label="Pages per chunk" value={fields.pagesPerChunk} onChange={v => set('pagesPerChunk', v)} min={1} max={500} />}
      {needed.includes('fontSize')       && <NumField label="Font size (px)"  value={fields.fontSize}      onChange={v => set('fontSize', v)}      min={8} max={32} />}
      {needed.includes('qrSize')         && <NumField label="QR size (px)"    value={fields.qrSize}        onChange={v => set('qrSize', v)}        min={100} max={2000} />}

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
      {needed.includes('volumeFactor')   && <SliderField label="Volume multiplier" min={0.1} max={4} step={0.1} value={fields.volumeFactor} onChange={v => set('volumeFactor', v)} display={v => v + '×'} />}

      {/* Text fields */}
      {needed.includes('watermarkText')  && <TextField label="Watermark text"   value={fields.watermarkText}  onChange={v => set('watermarkText', v)} />}
      {needed.includes('password')       && <TextField label="Password" type="password" value={fields.password} onChange={v => set('password', v)} />}
      {needed.includes('qrContent')      && <TextField label="Text / URL to encode" value={fields.qrContent} onChange={v => set('qrContent', v)} />}
      {needed.includes('barcodeContent') && <TextField label="Barcode content"  value={fields.barcodeContent} onChange={v => set('barcodeContent', v)} />}
      {needed.includes('diffFileId')     && <TextField label="Second file ID (for diff)" value={fields.diffFileId} onChange={v => set('diffFileId', v)} placeholder="Upload 2nd file, paste its fileId here" />}
      {needed.includes('topText')    && <TextField label="Top text"    value={fields.topText}    onChange={v => set('topText', v)}    placeholder="TOP TEXT" />}
      {needed.includes('bottomText') && <TextField label="Bottom text" value={fields.bottomText} onChange={v => set('bottomText', v)} placeholder="BOTTOM TEXT" />}
      {needed.includes('pageOrder')          && <TextField label="Page order (e.g. 3,1,2)" value={fields.pageOrder}          onChange={v => set('pageOrder', v)} placeholder="3,1,2" />}
      {needed.includes('videoWatermarkText') && <TextField label="Watermark text"           value={fields.videoWatermarkText} onChange={v => set('videoWatermarkText', v)} />}
      {needed.includes('pdfTitle')    && <TextField label="PDF Title"    value={fields.pdfTitle}    onChange={v => set('pdfTitle', v)} />}
      {needed.includes('pdfAuthor')   && <TextField label="PDF Author"   value={fields.pdfAuthor}   onChange={v => set('pdfAuthor', v)} />}
      {needed.includes('pdfSubject')  && <TextField label="PDF Subject"  value={fields.pdfSubject}  onChange={v => set('pdfSubject', v)} />}
      {needed.includes('pdfKeywords') && <TextField label="PDF Keywords" value={fields.pdfKeywords} onChange={v => set('pdfKeywords', v)} placeholder="keyword1, keyword2" />}
      {needed.includes('randomColumns') && <TextField label="Column names (comma-separated)" value={fields.randomColumns} onChange={v => set('randomColumns', v)} placeholder="id,name,email,score" />}
      {needed.includes('colorInput')       && <TextField label="Color value"             value={fields.colorInput}       onChange={v => set('colorInput', v)}       placeholder="#FF5733 or 255,87,51" />}
      {needed.includes('placeholderBg')    && <TextField label="Background color (hex)"  value={fields.placeholderBg}    onChange={v => set('placeholderBg', v)}    placeholder="CCCCCC" />}
      {needed.includes('placeholderLabel') && <TextField label="Label text (optional)"   value={fields.placeholderLabel} onChange={v => set('placeholderLabel', v)} placeholder="400 × 300" />}
      {needed.includes('regexPattern')     && <TextField label="Regex pattern"           value={fields.regexPattern}     onChange={v => set('regexPattern', v)}     placeholder="e.g. \d{3}-\d{4}" />}
      {needed.includes('fileIds')          && <TextField label="Additional file IDs (comma-separated)" value={fields.fileIds} onChange={v => set('fileIds', v)} placeholder="fileId1,fileId2,..." />}
      {needed.includes('captionText')    && <TextField label="Caption text"    value={fields.captionText}    onChange={v => set('captionText', v)} />}
      {needed.includes('sortColumn')     && <TextField label="Sort by column (name or number)" value={fields.sortColumn} onChange={v => set('sortColumn', v)} placeholder="e.g. price or 3" />}
      {needed.includes('numberInput')    && <TextField label="Number to convert" value={fields.numberInput} onChange={v => set('numberInput', v)} placeholder="e.g. 255 or FF or 11111111" />}
      {needed.includes('zipPassword')    && <TextField label="ZIP password" value={fields.zipPassword} onChange={v => set('zipPassword', v)} placeholder="Encryption password" />}
      {needed.includes('cronExpression') && <TextField label="Cron expression" value={fields.cronExpression} onChange={v => set('cronExpression', v)} placeholder="0 12 * * MON-FRI" />}
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
      {needed.includes('hashAlgorithm') && (
        <SelectField label="Hash Algorithm" value={fields.hashAlgorithm} onChange={v => set('hashAlgorithm', v)}
          options={[
            { value: 'SHA-256', label: 'SHA-256 (recommended)' },
            { value: 'SHA-512', label: 'SHA-512' },
            { value: 'MD5',     label: 'MD5' },
          ]} />
      )}
      {needed.includes('targetFormat') && (
        <SelectField label="Target Audio Format" value={fields.targetFormat} onChange={v => set('targetFormat', v)}
          options={[
            { value: 'mp3',  label: 'MP3' },
            { value: 'wav',  label: 'WAV' },
            { value: 'ogg',  label: 'OGG' },
            { value: 'aac',  label: 'AAC' },
            { value: 'flac', label: 'FLAC' },
            { value: 'm4a',  label: 'M4A' },
          ]} />
      )}
      {needed.includes('caseType') && (
        <SelectField label="Target Case" value={fields.caseType} onChange={v => set('caseType', v)}
          options={[
            { value: 'upper',  label: 'UPPER CASE' },
            { value: 'lower',  label: 'lower case' },
            { value: 'title',  label: 'Title Case' },
            { value: 'camel',  label: 'camelCase' },
            { value: 'snake',  label: 'snake_case' },
            { value: 'kebab',  label: 'kebab-case' },
          ]} />
      )}
      {needed.includes('sanitizeLevel') && (
        <SelectField label="Sanitize Level" value={fields.sanitizeLevel} onChange={v => set('sanitizeLevel', v)}
          options={[
            { value: 'basic',          label: 'Basic (bold, italic, links, lists)' },
            { value: 'basic_w_images', label: 'Basic + Images' },
            { value: 'relaxed',        label: 'Relaxed (allows more tags)' },
            { value: 'none',           label: 'Strip all HTML tags' },
          ]} />
      )}
      {needed.includes('colorFrom') && (
        <SelectField label="From format" value={fields.colorFrom} onChange={v => set('colorFrom', v)}
          options={[{value:'hex',label:'HEX'},{value:'rgb',label:'RGB'},{value:'hsl',label:'HSL'}]} />
      )}
      {needed.includes('colorTo') && (
        <SelectField label="To format" value={fields.colorTo} onChange={v => set('colorTo', v)}
          options={[{value:'all',label:'All formats'},{value:'hex',label:'HEX'},{value:'rgb',label:'RGB'},{value:'hsl',label:'HSL'}]} />
      )}
      {needed.includes('regexFlags') && (
        <SelectField label="Regex flags" value={fields.regexFlags} onChange={v => set('regexFlags', v)}
          options={[{value:'',label:'None'},{value:'i',label:'i (case insensitive)'},{value:'m',label:'m (multiline)'},{value:'s',label:'s (dot matches all)'},{value:'im',label:'im'}]} />
      )}
      {needed.includes('captionPosition') && (
        <SelectField label="Caption position" value={fields.captionPosition} onChange={v => set('captionPosition', v)}
          options={[{value:'bottom',label:'Bottom'},{value:'top',label:'Top'}]} />
      )}
      {needed.includes('codeTheme') && (
        <SelectField label="Theme" value={fields.codeTheme} onChange={v => set('codeTheme', v)}
          options={[{value:'dark',label:'Dark'},{value:'light',label:'Light'}]} />
      )}
      {needed.includes('numberFrom') && (
        <SelectField label="From base" value={fields.numberFrom} onChange={v => set('numberFrom', v)}
          options={[{value:'decimal',label:'Decimal (10)'},{value:'binary',label:'Binary (2)'},{value:'octal',label:'Octal (8)'},{value:'hex',label:'Hexadecimal (16)'}]} />
      )}
      {needed.includes('numberTo') && (
        <SelectField label="To base" value={fields.numberTo} onChange={v => set('numberTo', v)}
          options={[{value:'decimal',label:'Decimal (10)'},{value:'binary',label:'Binary (2)'},{value:'octal',label:'Octal (8)'},{value:'hex',label:'Hexadecimal (16)'}]} />
      )}
      {needed.includes('sortAscending') && (
        <SelectField label="Sort direction" value={fields.sortAscending ? 'asc' : 'desc'} onChange={v => set('sortAscending', v === 'asc')}
          options={[{value:'asc',label:'Ascending ↑'},{value:'desc',label:'Descending ↓'}]} />
      )}

      {/* Password checkboxes */}
      {needed.includes('pwdLength') && (
        <div className="flex gap-4 flex-wrap">
          {[['pwdUppercase','A-Z'],['pwdNumbers','0-9'],['pwdSymbols','!@#']].map(([k,label]) => (
            <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!fields[k]} onChange={e => set(k, e.target.checked)} className="w-4 h-4 rounded" />
              {label}
            </label>
          ))}
        </div>
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
      {needed.includes('regexInput') && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Input text to test</label>
          <textarea
            value={fields.regexInput || ''}
            onChange={e => set('regexInput', e.target.value)}
            rows={5}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            placeholder="Enter text to test against the regex..."
          />
        </div>
      )}

      {/* Notifications */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-200 select-none flex items-center gap-2">
          <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
          Notifications (optional)
        </summary>
        <div className="mt-3 space-y-3 pl-4 border-l border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notify by email when done</label>
            <input
              type="email"
              value={fields.notifyEmail || ''}
              onChange={e => set('notifyEmail', e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Webhook URL (POST on completion)</label>
            <input
              type="url"
              value={fields.webhookUrl || ''}
              onChange={e => set('webhookUrl', e.target.value)}
              placeholder="https://your-server.com/webhook"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </details>

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
