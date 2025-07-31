import "../assets/styles/app.css";

import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { type CatalogItem } from "../model/catalogItem";
import Header from "./Header";
import ListView from "./ListView";
import AddItemModal from "./AddItemModal";
import { getItems, insertItem } from "../backend/store";

// Dummy items
const dummyItems: CatalogItem[] = [
  {
    id: "hakurei_reimu_v1",
    name: "Hakurei Reimu",
    version: "v1",
    imageUrl: "https://fumo.website/img/001.jpg",
  },
  {
    id: "kirisame_marisa_v1",
    name: "Kirisame Marisa",
    version: "v1",
    imageUrl: "https://fumo.website/img/002.jpg",
  },
  {
    id: "izayoi_sakuya_deka",
    name: "Izayoi Sakuya",
    version: "Deka",
    imageUrl: "https://fumo.website/img/853.jpg"
  }
];

function App() {

  // In memory item state - will be replaced with localStorage later on
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load items from the store
  useEffect(() => {
    try {
      // Attempt to load items from localStorage
      const storedItems = getItems();
      setItems(storedItems);
    } catch (error) {
      console.error("Failed to load items from store:", error);
    }
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return; // Item was dropped outside the droppable area
    }

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app">
        <Header onAddAction={() => setIsModalOpen(true)} />
        <ListView
          items={items}
          setItems={setItems}
          onDelete={() => {}}
          showError={() => {}}
        />

        {/* Modal */}
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {

            try {
              const newItem: CatalogItem = {
                id: `${data.name.toLowerCase().replace(/\s+/g, "_")}_${data.version}`,
                name: data.name,
                version: data.version,
                imageUrl: data.imageUrl ?? "https://fumo.website/img/001.jpg", // Placeholder image
              };

              insertItem(newItem);
              setItems((prevItems) => [...prevItems, newItem]);
              setIsModalOpen(false);
            } catch (error) {
              console.error("Failed to insert item:", error);
              // Optionally show an error message to the user
            }
          }}
          title="Add New Item"
          existingItems={items}
        />
      </div>
    </DragDropContext>
  );
}

export default App;
