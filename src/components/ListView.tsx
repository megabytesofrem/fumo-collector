import type { CatalogItem } from "../model/catalogItem";
import { Draggable, Droppable} from "@hello-pangea/dnd";
import ListItem from "./ListItem";

import '../assets/styles/listView.css'; // Import styles for ListView
import { deleteItem } from "../backend/store";

interface ListViewProps {
  items: CatalogItem[];
  setItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;

  onDelete: (id: string) => void;
  showError: (message: string) => void;
}

/// List view component
const ListView: React.FC<ListViewProps> = ({ items, setItems, showError }) => {

  const handleDelete = (id: string) => {
    // Animate deletion
    const listItem = document.querySelector(`.list-item[data-id="${id}"]`);

    if (listItem) {
      listItem.classList.add("animate-deletion");
      
      // Wait for animation to complete before updating state
      setTimeout(() => {
        try {
          deleteItem(id);
          setItems((prevItems) => prevItems.filter(item => item.id !== id));
        } catch (error) {
          console.error("Error deleting item:", error);
          showError("Failed to delete item. Please try again.");
        }
      }, 200); // Match the duration of the slide-out animation
    } else {
      // If element not found, just update state immediately
      try {
        deleteItem(id);
        setItems((prevItems) => prevItems.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
        showError("Failed to delete item. Please try again.");
      }
    }
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