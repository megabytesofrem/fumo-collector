import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import React from "react";
import { useMemo } from "react";

import catalog from "../model/fumo_catalog.json"; // Import the catalog data
import "../assets/styles/listView.css"; // Import styles for ListView

interface ListItemProps {
  id: string;
  name: string;
  version: string;
  onDelete?: (id: string) => void;

  // Optional drag handle props for @hello-pangea/dnd
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

/// List item component
const ListItem: React.FC<ListItemProps> = ({
  id,
  name,
  version,
  onDelete,
  dragHandleProps,
}) => {

  /// Create a memoized catalog item for the specific list item
  const catalogItem = useMemo(() => {
    return catalog.find(item => 
      item.name === name && item.version === version
    ) || null
  }, [name, version]);

  // Placeholder image URL for items
  const placeholderImage = "https://fumo.website/img/039.jpg";

  /// Determine if the item exists in the catalog
  const errorState = catalogItem === null;
  const imageUrl = catalogItem?.imageUrl ? catalogItem.imageUrl : placeholderImage;

  return (
    <div className={`list-item ${errorState ? "error" : ""}`} data-id={id}>
      <div {...dragHandleProps} className="drag-handle">
        ⋮⋮
      </div>

      <img
        className="list-item-image"
        src={imageUrl}
        aria-label={`Image of ${name}`}
      />

      <div className="list-item-content ">
        <span className="item-name" aria-label={name}>
          {name}
        </span>
        <span className="item-version" aria-label={version}>
          {version}
        </span>
      </div>

      <div className="list-item-button-container">
        <button
          className="list-item delete-button"
          onClick={onDelete ? () => onDelete(id) : undefined}
          aria-label={`Delete ${name}`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ListItem;
