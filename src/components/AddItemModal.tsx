import { useMemo, useState } from "react";
import type { CatalogItem } from "../model/catalogItem";

import catalog from "../model/fumo_catalog.json"; // Import the catalog data
import "../assets/styles/modal.css";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  onError?: (message: string) => void;

  title: string;
  existingItems: Array<CatalogItem>;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onError,

  title,
  existingItems,
}) => {
  const [form, setForm] = useState({
    name: "",
    version: "",
  });

  // Memorized list of character names from the catalog
  const characterMemo = useMemo(() => {

    // TODO: Maybe store the ID here as well?
    const nameSet = [...new Set(catalog.map((item) => item.name))];
    return nameSet;
  }, []);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  // Helper functions
  const getCharacterVersions = (character: string) => {
    if (!character) return [];

    const versions = catalog
      .filter((item) => item.name === character)
      .map((item) => item.version);

    const versionSet = [...new Set(versions)];
    
    // Return a pair of label and value for each version
    // Label is the prettified version name
    return versionSet.map(v => ({
      label: versionFormat(v),
      value: v,
    }));
  };

  const versionFormat = (version: string): string => {
    const map: Record<string, string> = {
      'v1': 'V1',
      'v1_5': 'V1.5',
      'v2': 'V2',
      'deka': 'Deka',
      'mannaka': 'Mannaka',
      'toystrap': 'Toystrap',
    };

    return map[version.toLowerCase()] || version;
  }

  // Handlers

  const handleClose = () => {
    onClose();
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setForm((prevForm) => {
      const newForm = { ...prevForm, [fieldName]: value };

      // If the name is changed, reset the version
      if (fieldName === "name") {
        newForm.version = "";
      }

      return newForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!form.name || !form.version) {
      onError?.("Please fill in all fields.");
      return;
    }

    // Duplicate check
    const isDuplicate = existingItems.some(
      (item) => item.name === form.name && item.version === form.version
    );

    if (isDuplicate) {
      onError?.(
        `${form.name} (${form.version}) already exists in your collection.`
      );
      return;
    }

    onSubmit({ name: form.name, version: form.version });
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      {/* Modal content */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>

          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>

        {/* Modal form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* Character drop down */}
            <label htmlFor="name-select" aria-labelledby="name-select">
              Character
            </label>
            <select
              id="name-select"
              className="form-select"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              required
            >
              <option value="">Select a character</option>
              {characterMemo.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            {/* Version input */}
            <label htmlFor="version-select" aria-labelledby="version-input">
              Version
            </label>
            <select
              id="version-select"
              className="form-select"
              value={form.version}
              onChange={(e) => handleFieldChange("version", e.target.value)}
              required
            >
              <option value="">Select a version</option>
              {getCharacterVersions(form.name).map((version) => (
                <option key={version.label} value={version.value}>
                  {version.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <div className="modal-actions">
            <button type="submit" className="modal-submit">
              Add Item
            </button>
            <button
              type="button"
              className="modal-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
