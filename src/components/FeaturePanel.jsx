import React, { useState } from 'react'
import {
  ImageIcon, FileText, Archive, ScanText, FileImage,
  Minimize2, RotateCcw, FlipHorizontal, Palette, Droplets,
  GitMerge, Scissors, Type, Lock, Unlock, FileSpreadsheet,
  AlignLeft, ChevronDown, ChevronUp
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'image',
    label: 'Image',
    icon: ImageIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    ops: [
      { type: 'IMAGE_TO_JPG',   label: 'To JPG',      icon: ImageIcon },
      { type: 'IMAGE_TO_PNG',   label: 'To PNG',      icon: ImageIcon },
      { type: 'IMAGE_TO_WEBP',  label: 'To WEBP',     icon: ImageIcon },
      { type: 'IMAGE_TO_BMP',   label: 'To BMP',      icon: ImageIcon },
      { type: 'IMAGE_TO_GIF',   label: 'To GIF',      icon: ImageIcon },
      { type: 'IMAGE_RESIZE',   label: 'Resize',      icon: Minimize2 },
      { type: 'IMAGE_COMPRESS', label: 'Compress',    icon: Minimize2 },
      { type: 'IMAGE_ROTATE',   label: 'Rotate',      icon: RotateCcw },
      { type: 'IMAGE_FLIP',     label: 'Flip',        icon: FlipHorizontal },
      { type: 'IMAGE_GRAYSCALE',label: 'Grayscale',   icon: Palette },
      { type: 'IMAGE_WATERMARK',label: 'Watermark',   icon: Droplets },
    ]
  },
  {
    id: 'pdf',
    label: 'PDF',
    icon: FileText,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    ops: [
      { type: 'PDF_MERGE',      label: 'Merge PDFs',  icon: GitMerge },
      { type: 'PDF_SPLIT',      label: 'Split PDF',   icon: Scissors },
      { type: 'PDF_TO_IMAGES',  label: 'To Images',   icon: FileImage },
      { type: 'IMAGES_TO_PDF',  label: 'Images→PDF', icon: FileText },
      { type: 'PDF_TO_TEXT',    label: 'Extract Text',icon: Type },
      { type: 'PDF_ENCRYPT',    label: 'Encrypt',     icon: Lock },
      { type: 'PDF_DECRYPT',    label: 'Decrypt',     icon: Unlock },
    ]
  },
  {
    id: 'ocr',
    label: 'OCR / Scan',
    icon: ScanText,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    ops: [
      { type: 'OCR_IMAGE', label: 'OCR Image', icon: ScanText },
      { type: 'OCR_PDF',   label: 'OCR PDF',   icon: ScanText },
    ]
  },
  {
    id: 'office',
    label: 'Office',
    icon: FileSpreadsheet,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    ops: [
      { type: 'EXCEL_TO_CSV',  label: 'Excel→CSV',    icon: FileSpreadsheet },
      { type: 'CSV_TO_EXCEL',  label: 'CSV→Excel',    icon: FileSpreadsheet },
      { type: 'WORD_TO_TEXT',  label: 'Word→Text',    icon: AlignLeft },
    ]
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: Archive,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    ops: [
      { type: 'ZIP_CREATE',  label: 'Create ZIP',  icon: Archive },
      { type: 'ZIP_EXTRACT', label: 'Extract ZIP', icon: Archive },
    ]
  },
]

export default function FeaturePanel({ fileInfo, onJobCreated }) {
  const [selected, setSelected] = useState(null)
  const [openCat, setOpenCat] = useState('image')

  if (!fileInfo) return null

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Choose Operation</p>
      {CATEGORIES.map(cat => (
        <div key={cat.id} className={`card border ${ cat.border } overflow-hidden`}>
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
          >
            <span className={`flex items-center gap-2 font-semibold ${ cat.color }`}>
              <cat.icon size={18} />{cat.label}
            </span>
            {openCat === cat.id ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </button>
          {openCat === cat.id && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cat.ops.map(op => (
                <OperationTile
                  key={op.type}
                  op={op}
                  catColor={cat.color}
                  catBg={cat.bg}
                  selected={selected?.type === op.type}
                  onSelect={() => setSelected(selected?.type === op.type ? null : op)}
                  fileInfo={fileInfo}
                  onJobCreated={(job) => { onJobCreated(job); setSelected(null) }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OperationTile({ op, catColor, catBg, selected, onSelect, fileInfo, onJobCreated }) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-xl p-3 text-left border transition-all
        ${ selected
          ? 'border-brand-500 bg-brand-600/20'
          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50' }`}
    >
      <op.icon size={18} className={`mb-1.5 ${ catColor }`} />
      <p className="text-xs font-medium text-slate-200">{op.label}</p>
    </button>
  )
}
