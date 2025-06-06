
import { useState } from "react";

export const useClientModals = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  return {
    showAddForm,
    setShowAddForm,
    showSearchModal,
    setShowSearchModal
  };
};
