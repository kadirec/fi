"use client";

import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export function SortableGrid<T extends { id: string }>({
  items,
  onReorder,
  className,
  renderItem,
  disabled,
}: {
  items: T[];
  onReorder: (next: T[]) => void;
  className?: string;
  renderItem: (item: T, handleProps: { listeners: any; attributes: any; isDragging: boolean }) => ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  if (disabled) {
    return (
      <div className={className}>
        {items.map((it) => (
          <div key={it.id}>
            {renderItem(it, { listeners: {}, attributes: {}, isDragging: false })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className={className}>
          {items.map((it) => (
            <SortableItem key={it.id} id={it.id}>
              {(state) => renderItem(it, state)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (state: { listeners: any; attributes: any; isDragging: boolean }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "z-30 opacity-90 ring-2 ring-gold/60")}
    >
      {children({ listeners, attributes, isDragging })}
    </div>
  );
}

export function DragHandle({
  listeners,
  attributes,
  className,
}: {
  listeners: any;
  attributes: any;
  className?: string;
}) {
  return (
    <button
      type="button"
      {...listeners}
      {...attributes}
      className={cn(
        "p-1.5 text-bone/40 hover:text-gold cursor-grab active:cursor-grabbing touch-none",
        className
      )}
      aria-label="drag to reorder"
    >
      <GripVertical size={14} />
    </button>
  );
}
