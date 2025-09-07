"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { Block } from "@/types";

type Props = {
  palette: Block["type"][];
  onAdd: (type: Block["type"]) => void;
};

export default function Palette({ palette, onAdd }: Props) {
  return (
    <div>
      <div className="fw-semibold mb-2">Building blocks</div>
      <div className="text-muted small mb-2">Drag into the canvas</div>
      <Droppable droppableId="palette" isDropDisabled>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="d-grid gap-2 mb-3"
          >
            {palette.map((t, i) => (
              <Draggable key={t} draggableId={`palette-${t}`} index={i}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className="btn btn-light text-start"
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="text-muted small mb-1">Or click to add</div>
      <div className="d-grid gap-2">
        {palette.map((t) => (
          <button key={t} className="btn btn-light" onClick={() => onAdd(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
