// Data will be managed by admin - these are loaded from localStorage
export const getVoices = () => {
  const stored = localStorage.getItem('adminVoices');
  return stored ? JSON.parse(stored) : [];
};

export const getRelationshipTypes = () => {
  const stored = localStorage.getItem('adminRelationships');
  return stored ? JSON.parse(stored) : [];
};

export const getCharacteristics = () => {
  const stored = localStorage.getItem('adminCharacteristics');
  return stored ? JSON.parse(stored) : [];
};

export const getDemoVoices = () => {
  const stored = localStorage.getItem('demoVoices');
  return stored ? JSON.parse(stored).filter((v: any) => v.isSelected) : [];
};