import type { CatalogItem } from "../model/catalogItem";
import { Draggable, Droppable} from "@hello-pangea/dnd";
import ListItem from "./ListItem";

import '../assets/styles/listView.css'; // Import styles for ListView

interface ListViewProps {
  items: CatalogItem[];
  setItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;

  onDelete: (id: string) => void;
  showError: (message: string) => void;
}

/// List view component
const ListView: React.FC<ListViewProps> = ({ items, setItems, showError }) => {

  const handleDelete = (id: string) => {
    // TODO: Handle deletion of an item
  };

  // Handle the case where there are no items to display
  if (items.length === 0) {
    return (
      <div className="empty-list">
      </div>
    );
  }

  return (
    <div>
      <Droppable droppableId="collection-list">
        {(provided) => (
          <div
            className="list-view"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                  >
                    <ListItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      version={item.version}
                      onDelete={() => handleDelete(item.id)}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default ListView;