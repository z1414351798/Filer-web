import { useState, useRef } from 'react'

export default function BeforeAfterSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)

  const onMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setPos((x / rect.width) * 100)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl select-none cursor-col-resize"
      style={{ height: 320 }}
      onMouseMove={onMouseMove}
    >
      <img src={afterSrc} alt="after" className="absolute inset-0 w-full h-full object-contain" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={beforeSrc} alt="before" className="w-full h-full object-contain"
          style={{ width: containerRef.current?.offsetWidth || '100%' }} />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-slate-800 text-xs font-bold">⟺</span>
        </div>
      </div>
      <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</span>
      <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">After</span>
    </div>
  )
}
