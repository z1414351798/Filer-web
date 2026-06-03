import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'

function SortableFile({ id, name, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style}
      className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
      <button {...attributes} {...listeners} className="text-slate-500 hover:text-slate-300 cursor-grab">
        <GripVertical size={16} />
      </button>
      <span className="flex-1 text-sm text-slate-300 truncate">{name}</span>
      <button onClick={() => onRemove(id)} className="text-slate-500 hover:text-red-400">
        <X size={14} />
      </button>
    </div>
  )
}

export default function DndFileList({ items, onChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(i => i.id === active.id)
      const newIndex = items.findIndex(i => i.id === over.id)
      onChange(arrayMove(items, oldIndex, newIndex))
    }
  }

  const remove = (id) => onChange(items.filter(i => i.id !== id))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map(item => (
            <SortableFile key={item.id} id={item.id} name={item.name} onRemove={remove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
