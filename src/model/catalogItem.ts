/// Model type used to represent a single catalog item
export type CatalogItem = {
  id: string;
  name: string;
  version: string;
  imageUrl: string;
  dateAcquired?: string; // Optional field for when the item was acquired
}