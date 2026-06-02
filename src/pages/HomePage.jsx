import React, { useState } from 'react'
import UploadZone from '../components/UploadZone'
import ConversionForm from '../components/ConversionForm'
import JobTracker from '../components/JobTracker'
import ImagePreview from '../components/ImagePreview'
import FileInfoPanel from '../components/FileInfoPanel'
import QrWidget from '../components/QrWidget'
import { motion } from 'framer-motion'
import {
  ImageIcon, FileText, Archive, ScanText, FileSpreadsheet,
  Minimize2, RotateCcw, FlipHorizontal, Palette, Droplets,
  GitMerge, Scissors, FileImage, Type, Lock, Unlock,
  AlignLeft, ChevronDown, ChevronUp, Zap, Shield, Globe, Clock,
  QrCode, BarChart2, Database, FileJson, Code2, Crop,
  SunMedium, Contrast, Sparkles, Hash, Info
} from 'lucide-react'

const PERKS = [
  { icon: Zap,    label: 'Lightning Fast',  desc: 'Kafka-powered async pipeline' },
  { icon: Shield, label: 'Secure',           desc: 'Files auto-deleted after 24h' },
  { icon: Globe,  label: '40+ Operations',   desc: 'Images, PDF, QR, OCR, data…' },
  { icon: Clock,  label: 'Live Progress',    desc: 'Real-time status polling' },
]

const CATS = [
  {
    id: 'image', label: 'Image Formats', icon: ImageIcon,
    color: 'text-purple-400', border: 'border-purple-500/30',
    ops: [
      { type: 'IMAGE_TO_JPG',   label: 'To JPG',  icon: ImageIcon },
      { type: 'IMAGE_TO_PNG',   label: 'To PNG',  icon: ImageIcon },
      { type: 'IMAGE_TO_WEBP',  label: 'To WEBP', icon: ImageIcon },
      { type: 'IMAGE_TO_BMP',   label: 'To BMP',  icon: ImageIcon },
      { type: 'IMAGE_TO_GIF',   label: 'To GIF',  icon: ImageIcon },
    ]
  },
  {
    id: 'imgops', label: 'Image Edit', icon: Crop,
    color: 'text-pink-400', border: 'border-pink-500/30',
    ops: [
      { type: 'IMAGE_RESIZE',    label: 'Resize',     icon: Minimize2 },
      { type: 'IMAGE_COMPRESS',  label: 'Compress',   icon: Minimize2 },
      { type: 'IMAGE_ROTATE',    label: 'Rotate',     icon: RotateCcw },
      { type: 'IMAGE_FLIP',      label: 'Flip',       icon: FlipHorizontal },
      { type: 'IMAGE_CROP',      label: 'Crop',       icon: Crop },
      { type: 'IMAGE_WATERMARK', label: 'Watermark',  icon: Droplets },
    ]
  },
  {
    id: 'imgfilter', label: 'Image Filters', icon: Sparkles,
    color: 'text-fuchsia-400', border: 'border-fuchsia-500/30',
    ops: [
      { type: 'IMAGE_GRAYSCALE', label: 'Grayscale',  icon: Palette },
      { type: 'IMAGE_SEPIA',     label: 'Sepia',      icon: Palette },
      { type: 'IMAGE_INVERT',    label: 'Invert',     icon: Contrast },
      { type: 'IMAGE_BLUR',      label: 'Blur',       icon: Sparkles },
      { type: 'IMAGE_SHARPEN',   label: 'Sharpen',    icon: Sparkles },
      { type: 'IMAGE_BRIGHTNESS',label: 'Brightness', icon: SunMedium },
    ]
  },
  {
    id: 'pdf', label: 'PDF', icon: FileText,
    color: 'text-red-400', border: 'border-red-500/30',
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
    id: 'ocr', label: 'OCR / Scan', icon: ScanText,
    color: 'text-green-400', border: 'border-green-500/30',
    ops: [
      { type: 'OCR_IMAGE', label: 'OCR Image', icon: ScanText },
      { type: 'OCR_PDF',   label: 'OCR PDF',   icon: ScanText },
    ]
  },
  {
    id: 'qr', label: 'QR / Barcode', icon: QrCode,
    color: 'text-violet-400', border: 'border-violet-500/30',
    ops: [
      { type: 'QR_SCAN',          label: 'Scan QR/Code',  icon: QrCode },
      { type: 'BARCODE_GENERATE', label: 'Gen Barcode',   icon: BarChart2 },
      { type: 'BARCODE_SCAN',     label: 'Scan Barcode',  icon: BarChart2 },
    ]
  },
  {
    id: 'data', label: 'Data Formats', icon: Database,
    color: 'text-cyan-400', border: 'border-cyan-500/30',
    ops: [
      { type: 'CSV_TO_JSON',    label: 'CSV→JSON',   icon: FileJson },
      { type: 'JSON_TO_CSV',    label: 'JSON→CSV',   icon: Database },
      { type: 'XML_TO_JSON',    label: 'XML→JSON',   icon: Code2 },
      { type: 'JSON_TO_XML',    label: 'JSON→XML',   icon: Code2 },
      { type: 'MARKDOWN_TO_HTML', label: 'MD→HTML',  icon: Code2 },
      { type: 'MARKDOWN_TO_PDF',  label: 'MD→PDF',   icon: FileText },
      { type: 'TEXT_TO_PDF',    label: 'Text→PDF',   icon: FileText },
      { type: 'HTML_TO_PDF',    label: 'HTML→PDF',   icon: FileText },
    ]
  },
  {
    id: 'office', label: 'Office', icon: FileSpreadsheet,
    color: 'text-emerald-400', border: 'border-emerald-500/30',
    ops: [
      { type: 'EXCEL_TO_CSV', label: 'Excel→CSV',  icon: FileSpreadsheet },
      { type: 'CSV_TO_EXCEL', label: 'CSV→Excel',  icon: FileSpreadsheet },
      { type: 'WORD_TO_TEXT', label: 'Word→Text',  icon: AlignLeft },
    ]
  },
  {
    id: 'archive', label: 'Archive', icon: Archive,
    color: 'text-amber-400', border: 'border-amber-500/30',
    ops: [
      { type: 'ZIP_CREATE',  label: 'Create ZIP',  icon: Archive },
      { type: 'ZIP_EXTRACT', label: 'Extract ZIP', icon: Archive },
    ]
  },
  {
    id: 'util', label: 'File Utilities', icon: Info,
    color: 'text-sky-400', border: 'border-sky-500/30',
    ops: [
      { type: 'FILE_CHECKSUM',  label: 'Checksum',    icon: Hash },
      { type: 'IMAGE_METADATA', label: 'EXIF Data',   icon: Info },
      { type: 'PDF_INFO',       label: 'PDF Info',    icon: Info },
    ]
  },
]

export default function HomePage() {
  const [fileInfo, setFileInfo]   = useState(null)
  const [selected, setSelected]   = useState(null)
  const [currentJob, setCurrentJob] = useState(null)

  const handleFileUploaded = (info) => {
    setFileInfo(info)
    setSelected(null)
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
          className="text-slate-400 max-w-xl mx-auto text-sm"
        >
          Convert images &bull; Edit &amp; filter &bull; PDF tools &bull; OCR &bull;
          QR codes &bull; Data formats &bull; File utilities &mdash; all async, all free.
        </motion.p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PERKS.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="card text-center space-y-1.5 py-4">
            <Icon size={22} className="mx-auto text-brand-400" />
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">

        {/* Left: upload + operation picker */}
        <div className="space-y-5">
          <UploadZone onFileUploaded={handleFileUploaded} />
          {fileInfo && <ImagePreview fileInfo={fileInfo} />}
          {fileInfo && <FileInfoPanel fileInfo={fileInfo} />}
          {fileInfo && (
            <OperationAccordion
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>

        {/* Right: QR widget + options form + job tracker */}
        <div className="space-y-5">
          <QrWidget />
          {selected && selected !== 'QR_GENERATE' && (
            <ConversionForm
              fileInfo={fileInfo}
              conversionType={selected}
              onJobCreated={setCurrentJob}
            />
          )}
          {currentJob && <JobTracker job={currentJob} />}
        </div>
      </div>
    </div>
  )
}

function OperationAccordion({ selected, onSelect }) {
  const [open, setOpen] = useState('image')
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Choose Operation</p>
      {CATS.map(cat => (
        <div key={cat.id} className={`card border ${cat.border} overflow-hidden p-4`}>
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setOpen(open === cat.id ? null : cat.id)}
          >
            <span className={`flex items-center gap-2 font-semibold text-sm ${cat.color}`}>
              <cat.icon size={16} />{cat.label}
              <span className="text-xs font-normal text-slate-500">{cat.ops.length} ops</span>
            </span>
            {open === cat.id
              ? <ChevronUp size={14} className="text-slate-500" />
              : <ChevronDown size={14} className="text-slate-500" />}
          </button>
          {open === cat.id && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {cat.ops.map(op => (
                <button
                  key={op.type}
                  onClick={() => onSelect(selected === op.type ? null : op.type)}
                  className={`rounded-xl p-2.5 text-left border transition-all
                    ${selected === op.type
                      ? 'border-brand-500 bg-brand-600/20'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}
                >
                  <op.icon size={14} className={`mb-1.5 ${cat.color}`} />
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
