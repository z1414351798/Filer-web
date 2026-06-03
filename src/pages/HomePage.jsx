import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UploadZone from '../components/UploadZone'
import ConversionForm from '../components/ConversionForm'
import JobTracker from '../components/JobTracker'
import ImagePreview from '../components/ImagePreview'
import QrWidget from '../components/QrWidget'
import FileInfoPanel from '../components/FileInfoPanel'
import BatchUpload from '../components/BatchUpload'
import { createJob } from '../api/filerApi'
import toast from 'react-hot-toast'
import {
  Image, FileText, Eye, QrCode, Table, File,
  Archive, Info, ChevronDown, Layers, Video, Code, Lock, Type
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'img-fmt', label: 'Image Formats', Icon: Image,
    ops: [
      { label: 'To PNG', type: 'IMAGE_TO_PNG' },
      { label: 'To JPG', type: 'IMAGE_TO_JPG' },
      { label: 'To WEBP', type: 'IMAGE_TO_WEBP' },
      { label: 'To BMP', type: 'IMAGE_TO_BMP' },
      { label: 'To GIF', type: 'IMAGE_TO_GIF' },
      { label: 'To TIFF', type: 'IMAGE_TO_TIFF' },
    ]
  },
  {
    id: 'img-edit', label: 'Image Edit', Icon: Image,
    ops: [
      { label: 'Resize', type: 'IMAGE_RESIZE' },
      { label: 'Compress', type: 'IMAGE_COMPRESS' },
      { label: 'Rotate', type: 'IMAGE_ROTATE' },
      { label: 'Flip Horizontal', type: 'IMAGE_FLIP_H' },
      { label: 'Flip Vertical', type: 'IMAGE_FLIP_V' },
      { label: 'Grayscale', type: 'IMAGE_GRAYSCALE' },
      { label: 'Watermark', type: 'IMAGE_WATERMARK' },
    ]
  },
  {
    id: 'img-filter', label: 'Image Filters', Icon: Eye,
    ops: [
      { label: 'Crop', type: 'IMAGE_CROP' },
      { label: 'Sepia', type: 'IMAGE_SEPIA' },
      { label: 'Invert', type: 'IMAGE_INVERT' },
      { label: 'Blur', type: 'IMAGE_BLUR' },
      { label: 'Sharpen', type: 'IMAGE_SHARPEN' },
      { label: 'Brightness', type: 'IMAGE_BRIGHTNESS' },
    ]
  },
  {
    id: 'img-enhance', label: 'Image Enhance', Icon: Layers,
    ops: [
      { label: 'Create Collage', type: 'IMAGE_COLLAGE' },
      { label: 'Add Border', type: 'IMAGE_BORDER' },
      { label: 'Round Corners', type: 'IMAGE_ROUND_CORNERS' },
      { label: 'Color Palette', type: 'IMAGE_COLOR_PALETTE' },
      { label: 'ASCII Art', type: 'IMAGE_ASCII_ART' },
      { label: 'Meme Generator', type: 'IMAGE_MEME' },
      { label: 'Compare Images', type: 'IMAGE_COMPARE' },
      { label: 'Convert to ICO', type: 'IMAGE_TO_ICO' },
    ]
  },
  {
    id: 'pdf', label: 'PDF Tools', Icon: FileText,
    ops: [
      { label: 'Merge PDFs', type: 'PDF_MERGE' },
      { label: 'Split PDF', type: 'PDF_SPLIT' },
      { label: 'Extract Pages', type: 'PDF_PAGE_EXTRACT' },
      { label: 'PDF to Images', type: 'PDF_TO_IMAGES' },
      { label: 'Images to PDF', type: 'IMAGES_TO_PDF' },
      { label: 'Extract Text', type: 'PDF_EXTRACT_TEXT' },
      { label: 'Encrypt PDF', type: 'PDF_ENCRYPT' },
      { label: 'Decrypt PDF', type: 'PDF_DECRYPT' },
      { label: 'Compress PDF', type: 'PDF_COMPRESS' },
      { label: 'Add Page Numbers', type: 'PDF_ADD_PAGE_NUMBERS' },
      { label: 'PDF to HTML', type: 'PDF_TO_HTML' },
      { label: 'Linearize PDF', type: 'PDF_LINEARIZE' },
      { label: 'Crop Margins', type: 'PDF_CROP_MARGINS' },
      { label: 'Reorder Pages', type: 'PDF_REORDER_PAGES' },
      { label: 'Watermark PDF', type: 'PDF_WATERMARK' },
      { label: 'Rotate Page', type: 'PDF_PAGE_ROTATE' },
      { label: 'PDF to Text', type: 'PDF_TO_DOCX' },
    ]
  },
  {
    id: 'ocr', label: 'OCR / Scan', Icon: Eye,
    ops: [
      { label: 'OCR Image', type: 'OCR_IMAGE' },
      { label: 'OCR PDF', type: 'OCR_PDF' },
    ]
  },
  {
    id: 'qr', label: 'QR & Barcode', Icon: QrCode,
    ops: [
      { label: 'Generate QR', type: 'QR_GENERATE' },
      { label: 'Generate Barcode', type: 'BARCODE_GENERATE' },
      { label: 'Scan QR/Barcode', type: 'QR_SCAN' },
    ]
  },
  {
    id: 'data', label: 'Data Formats', Icon: Table,
    ops: [
      { label: 'CSV to JSON', type: 'CSV_TO_JSON' },
      { label: 'JSON to CSV', type: 'JSON_TO_CSV' },
      { label: 'XML to JSON', type: 'XML_TO_JSON' },
      { label: 'JSON to XML', type: 'JSON_TO_XML' },
      { label: 'JSON to YAML', type: 'JSON_TO_YAML' },
      { label: 'YAML to JSON', type: 'YAML_TO_JSON' },
      { label: 'Format JSON', type: 'JSON_FORMAT' },
      { label: 'Format XML', type: 'XML_FORMAT' },
      { label: 'Base64 Encode', type: 'BASE64_ENCODE' },
      { label: 'Base64 Decode', type: 'BASE64_DECODE' },
      { label: 'Text Diff', type: 'TEXT_DIFF' },
      { label: 'Excel to JSON', type: 'EXCEL_TO_JSON' },
      { label: 'Merge CSVs', type: 'CSV_MERGE' },
      { label: 'Hash File', type: 'HASH_FILE' },
      { label: 'URL Encode', type: 'URL_ENCODE' },
      { label: 'URL Decode', type: 'URL_DECODE' },
      { label: 'Decode JWT', type: 'JWT_DECODE' },
      { label: 'CSV to HTML Table', type: 'CSV_TO_HTML' },
      { label: 'JSON to HTML Table', type: 'JSON_TO_HTML' },
      { label: 'Text Case Convert', type: 'TEXT_CASE_CONVERT' },
      { label: 'SRT to VTT', type: 'SUBTITLE_SRT_TO_VTT' },
      { label: 'VTT to SRT', type: 'VTT_TO_SRT' },
    ]
  },
  {
    id: 'office', label: 'Office & Documents', Icon: File,
    ops: [
      { label: 'Word (DOCX) → PDF', type: 'DOCX_TO_PDF' },
      { label: 'Excel (XLSX) → PDF', type: 'XLSX_TO_PDF' },
      { label: 'PowerPoint (PPTX) → PDF', type: 'PPTX_TO_PDF' },
      { label: 'PPTX → Images (ZIP)', type: 'PPTX_TO_IMAGES' },
      { label: 'Excel to CSV', type: 'EXCEL_TO_CSV' },
      { label: 'CSV to Excel', type: 'CSV_TO_EXCEL' },
      { label: 'JSON to Excel', type: 'JSON_TO_EXCEL' },
      { label: 'Word to Text', type: 'WORD_TO_TEXT' },
      { label: 'Markdown to HTML', type: 'MARKDOWN_TO_HTML' },
      { label: 'Markdown to PDF', type: 'MARKDOWN_TO_PDF' },
      { label: 'Text to PDF', type: 'TEXT_TO_PDF' },
      { label: 'HTML to PDF', type: 'HTML_TO_PDF' },
      { label: 'RTF to PDF', type: 'RTF_TO_PDF' },
      { label: 'RTF to Text', type: 'RTF_TO_TEXT' },
      { label: 'Merge Excel Files', type: 'EXCEL_MERGE' },
    ]
  },
  {
    id: 'archive', label: 'Archive', Icon: Archive,
    ops: [
      { label: 'Create ZIP', type: 'ZIP_CREATE' },
      { label: 'Extract ZIP', type: 'ZIP_EXTRACT' },
      { label: 'Create TAR.GZ', type: 'TAR_CREATE' },
      { label: 'Extract TAR.GZ', type: 'TAR_EXTRACT' },
    ]
  },
  {
    id: 'security', label: 'File Security', Icon: Lock,
    ops: [
      { label: 'AES Encrypt File', type: 'FILE_AES_ENCRYPT' },
      { label: 'AES Decrypt File', type: 'FILE_AES_DECRYPT' },
    ]
  },
  {
    id: 'font', label: 'Font', Icon: Type,
    ops: [
      { label: 'Font Preview', type: 'FONT_PREVIEW' },
    ]
  },
  {
    id: 'svg', label: 'SVG', Icon: Code,
    ops: [
      { label: 'SVG to PNG', type: 'SVG_TO_PNG' },
      { label: 'SVG to PDF', type: 'SVG_TO_PDF' },
    ]
  },
  {
    id: 'video', label: 'Video & Audio', Icon: Video,
    ops: [
      { label: 'Extract Thumbnail', type: 'VIDEO_THUMBNAIL' },
      { label: 'Video to GIF', type: 'VIDEO_TO_GIF' },
      { label: 'Trim Video', type: 'VIDEO_TRIM' },
      { label: 'Compress Video', type: 'VIDEO_COMPRESS' },
      { label: 'Convert to MP4', type: 'VIDEO_TO_MP4' },
      { label: 'Extract Audio (MP3)', type: 'VIDEO_AUDIO_EXTRACT' },
      { label: 'Convert Audio Format', type: 'AUDIO_CONVERT' },
      { label: 'Trim Audio', type: 'AUDIO_TRIM' },
      { label: 'Merge Audio Files', type: 'AUDIO_MERGE' },
      { label: 'Extract Frames', type: 'VIDEO_EXTRACT_FRAMES' },
      { label: 'Add Watermark to Video', type: 'VIDEO_ADD_WATERMARK' },
    ]
  },
  {
    id: 'info', label: 'File Utilities', Icon: Info,
    ops: [
      { label: 'Image Metadata (EXIF)', type: '_INFO_IMAGE' },
      { label: 'PDF Info', type: '_INFO_PDF' },
      { label: 'Checksum (SHA-256)', type: '_INFO_CHECKSUM' },
    ]
  },
]

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedOp, setSelectedOp] = useState(null)
  const [jobId, setJobId] = useState(null)
  const [openCat, setOpenCat] = useState(null)

  const handleUpload = (file) => {
    setUploadedFile(file)
    setSelectedOp(null)
    setJobId(null)
  }

  const handleConvert = async (params) => {
    try {
      const job = await createJob({ fileId: uploadedFile.fileId, conversionType: selectedOp, ...params })
      setJobId(job.jobId)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start conversion')
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-white">File Converter</h1>
        <p className="text-slate-400">Convert, transform & process any file — images, PDFs, video, data formats and more.</p>
      </div>

      <UploadZone onUpload={handleUpload} />

      {uploadedFile && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <ImagePreview file={uploadedFile} />
          <FileInfoPanel file={uploadedFile} />
        </motion.div>
      )}

      {/* Operation categories */}
      <div className="space-y-2">
        {CATEGORIES.map(({ id, label, Icon, ops }) => (
          <div key={id} className="card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
              onClick={() => setOpenCat(openCat === id ? null : id)}
            >
              <span className="flex items-center gap-3 font-medium text-white">
                <Icon size={18} className="text-indigo-400" />
                {label}
                <span className="text-xs text-slate-500">({ops.length})</span>
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform ${openCat === id ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {openCat === id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {ops.map(op => (
                        <button
                          key={op.type}
                          onClick={() => { setSelectedOp(op.type); setJobId(null) }}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            selectedOp === op.type
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>

                    {selectedOp && ops.find(o => o.type === selectedOp) && (
                      <ConversionForm
                        type={selectedOp}
                        file={uploadedFile}
                        onSubmit={handleConvert}
                      />
                    )}

                    <JobTracker jobId={jobId} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* QR inline widget */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QrCode size={18} className="text-indigo-400" /> Quick QR Generator
        </h2>
        <QrWidget />
      </div>

      {/* Batch upload */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Layers size={18} className="text-indigo-400" /> Batch Upload
        </h2>
        <BatchUpload onUploaded={(files) => toast.success(`${files.length} files ready`)} />
      </div>
    </main>
  )
}
