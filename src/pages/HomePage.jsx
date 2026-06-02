import React, { useState } from 'react'
import UploadZone from '../components/UploadZone'
import FeaturePanel from '../components/FeaturePanel'
import ConversionForm from '../components/ConversionForm'
import JobTracker from '../components/JobTracker'
import { motion } from 'framer-motion'
import {
  Zap, Shield, Globe, Clock
} from 'lucide-react'

const PERKS = [
  { icon: Zap,    label: 'Lightning Fast',  desc: 'Async processing with Kafka queues' },
  { icon: Shield, label: 'Secure',           desc: 'Files deleted after 24 hours' },
  { icon: Globe,  label: '25+ Formats',      desc: 'Images, PDF, Office, Archives, OCR' },
  { icon: Clock,  label: 'Real-time Status', desc: 'Live progress updates via polling' },
]

export default function HomePage() {
  const [fileInfo, setFileInfo]         = useState(null)
  const [conversionType, setConvType]   = useState(null)
  const [currentJob, setCurrentJob]     = useState(null)

  const handleFileUploaded = (info) => {
    setFileInfo(info)
    setConvType(null)
    setCurrentJob(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        >
          Transform Any File,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
            Instantly
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}
          className="text-slate-400 max-w-xl mx-auto"
        >
          Convert images, PDFs, Office documents &amp; archives.
          Extract text with OCR. Resize, compress, watermark &mdash; all in one place.
        </motion.p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PERKS.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="card text-center space-y-2">
            <Icon size={24} className="mx-auto text-brand-400" />
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column: upload + features */}
        <div className="space-y-6">
          <UploadZone onFileUploaded={handleFileUploaded} />
          {fileInfo && (
            <OperationSelector
              fileInfo={fileInfo}
              selected={conversionType}
              onSelect={setConvType}
            />
          )}
        </div>

        {/* Right column: options form + job tracker */}
        <div className="space-y-6">
          {fileInfo && conversionType && (
            <ConversionForm
              fileInfo={fileInfo}
              conversionType={conversionType}
              onJobCreated={setCurrentJob}
            />
          )}
          {currentJob && <JobTracker job={currentJob} />}
        </div>
      </div>
    </div>
  )
}

// Inline simplified operation selector (replaces FeaturePanel inline)
import {
  ImageIcon, FileText, Archive, ScanText, FileSpreadsheet,
  Minimize2, RotateCcw, FlipHorizontal, Palette, Droplets,
  GitMerge, Scissors, FileImage, Type, Lock, Unlock,
  AlignLeft, ChevronDown, ChevronUp
} from 'lucide-react'

const CATS = [
  {
    id: 'image', label: 'Image', icon: ImageIcon, color: 'text-purple-400', border: 'border-purple-500/30',
    ops: [
      { type: 'IMAGE_TO_JPG',    label: 'To JPG',     icon: ImageIcon },
      { type: 'IMAGE_TO_PNG',    label: 'To PNG',     icon: ImageIcon },
      { type: 'IMAGE_TO_WEBP',   label: 'To WEBP',    icon: ImageIcon },
      { type: 'IMAGE_TO_BMP',    label: 'To BMP',     icon: ImageIcon },
      { type: 'IMAGE_TO_GIF',    label: 'To GIF',     icon: ImageIcon },
      { type: 'IMAGE_RESIZE',    label: 'Resize',     icon: Minimize2 },
      { type: 'IMAGE_COMPRESS',  label: 'Compress',   icon: Minimize2 },
      { type: 'IMAGE_ROTATE',    label: 'Rotate',     icon: RotateCcw },
      { type: 'IMAGE_FLIP',      label: 'Flip',       icon: FlipHorizontal },
      { type: 'IMAGE_GRAYSCALE', label: 'Grayscale',  icon: Palette },
      { type: 'IMAGE_WATERMARK', label: 'Watermark',  icon: Droplets },
    ]
  },
  {
    id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-400', border: 'border-red-500/30',
    ops: [
      { type: 'PDF_MERGE',     label: 'Merge',        icon: GitMerge },
      { type: 'PDF_SPLIT',     label: 'Split',        icon: Scissors },
      { type: 'PDF_TO_IMAGES', label: 'To Images',    icon: FileImage },
      { type: 'IMAGES_TO_PDF', label: 'Images→PDF',  icon: FileText },
      { type: 'PDF_TO_TEXT',   label: 'Extract Text', icon: Type },
      { type: 'PDF_ENCRYPT',   label: 'Encrypt',      icon: Lock },
      { type: 'PDF_DECRYPT',   label: 'Decrypt',      icon: Unlock },
    ]
  },
  {
    id: 'ocr', label: 'OCR / Scan', icon: ScanText, color: 'text-green-400', border: 'border-green-500/30',
    ops: [
      { type: 'OCR_IMAGE', label: 'OCR Image', icon: ScanText },
      { type: 'OCR_PDF',   label: 'OCR PDF',   icon: ScanText },
    ]
  },
  {
    id: 'office', label: 'Office', icon: FileSpreadsheet, color: 'text-emerald-400', border: 'border-emerald-500/30',
    ops: [
      { type: 'EXCEL_TO_CSV', label: 'Excel→CSV',  icon: FileSpreadsheet },
      { type: 'CSV_TO_EXCEL', label: 'CSV→Excel',  icon: FileSpreadsheet },
      { type: 'WORD_TO_TEXT', label: 'Word→Text',  icon: AlignLeft },
    ]
  },
  {
    id: 'archive', label: 'Archive', icon: Archive, color: 'text-amber-400', border: 'border-amber-500/30',
    ops: [
      { type: 'ZIP_CREATE',  label: 'Create ZIP',  icon: Archive },
      { type: 'ZIP_EXTRACT', label: 'Extract ZIP', icon: Archive },
    ]
  },
]

function OperationSelector({ fileInfo, selected, onSelect }) {
  const [open, setOpen] = useState('image')
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Choose Operation</p>
      {CATS.map(cat => (
        <div key={cat.id} className={`card border ${ cat.border } overflow-hidden p-4`}>
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setOpen(open === cat.id ? null : cat.id)}
          >
            <span className={`flex items-center gap-2 font-semibold ${ cat.color }`}>
              <cat.icon size={17} />{cat.label}
            </span>
            {open === cat.id
              ? <ChevronUp size={15} className="text-slate-500" />
              : <ChevronDown size={15} className="text-slate-500" />}
          </button>
          {open === cat.id && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {cat.ops.map(op => (
                <button
                  key={op.type}
                  onClick={() => onSelect(selected === op.type ? null : op.type)}
                  className={`rounded-xl p-2.5 text-left border transition-all
                    ${ selected === op.type
                      ? 'border-brand-500 bg-brand-600/20'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50' }`}
                >
                  <op.icon size={15} className={`mb-1 ${ cat.color }`} />
                  <p className="text-xs font-medium text-slate-200 leading-tight">{op.label}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
