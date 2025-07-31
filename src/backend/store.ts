import type { CatalogItem } from "../model/catalogItem";

export const db = localStorage;

/// Key which stores a JSON object containing the catalog items.
export const storeKey = "fumo-collector-items";

export type Selector = {
  method: "name" | "version" | "dateAcquired";
  id: string;
};

export const getItem = (id: string): CatalogItem | null => {
  const items = getItems();
  return items.find(item => item.id === id) || null;
};

export const getItems = (): CatalogItem[] => {
  const items = db.getItem(storeKey);
  return items ? JSON.parse(items) : [];
};

export const selectItems = (selector: Selector): CatalogItem[] => {
  const items = getItems();

  return items.filter(item => {
    switch (selector.method) {
      case "name":
        return item.name.toLowerCase() === selector.id.toLowerCase();
      case "version":
        return item.version.toLowerCase() === selector.id.toLowerCase();
      case "dateAcquired":
        return item.dateAcquired === selector.id;
      default:
        return false;
    }
  });
};

export const insertItem = (item: CatalogItem) => {
  const items = getItems();
  db.setItem(storeKey, JSON.stringify([...items, item]));
};

export const deleteItem = (id: string) => {
  const items = getItems();
  db.setItem(storeKey, JSON.stringify(items.filter(item => item.id !== id)));
};
