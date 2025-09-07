// Data will be managed by admin - these are loaded from localStorage
export const getVoices = () => {
  const stored = localStorage.getItem('adminVoices');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default voices if none exist
  const defaultVoices = [
    {
      id: 'voice1',
      name: 'Yuki',
      nameJa: 'ユキ',
      gender: 'female',
      ageRange: '20-25',
      personality: 'Sweet and caring',
      personalityJa: '優しくて思いやりがある',
    },
    {
      id: 'voice2',
      name: 'Akira',
      nameJa: 'アキラ',
      gender: 'male',
      ageRange: '25-30',
      personality: 'Confident and supportive',
      personalityJa: '自信があって支えてくれる',
    },
    {
      id: 'voice3',
      name: 'Sakura',
      nameJa: 'サクラ',
      gender: 'female',
      ageRange: '22-27',
      personality: 'Cheerful and energetic',
      personalityJa: '明るくて元気',
    }
  ];
  
  localStorage.setItem('adminVoices', JSON.stringify(defaultVoices));
  return defaultVoices;
};

export const getRelationshipTypes = () => {
  const stored = localStorage.getItem('adminRelationships');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default relationship types if none exist
  const defaultRelationships = [
    {
      id: 'girlfriend',
      label: '彼女',
      labelEn: 'Girlfriend'
    },
    {
      id: 'friend',
      label: '親友',
      labelEn: 'Best Friend'
    },
    {
      id: 'sister',
      label: '妹',
      labelEn: 'Sister'
    },
    {
      id: 'companion',
      label: 'パートナー',
      labelEn: 'Life Partner'
    },
    {
      id: 'mentor',
      label: 'メンター',
      labelEn: 'Mentor'
    }
  ];
  
  localStorage.setItem('adminRelationships', JSON.stringify(defaultRelationships));
  return defaultRelationships;
};

export const getCharacteristics = () => {
  const stored = localStorage.getItem('adminCharacteristics');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default characteristics if none exist
  const defaultCharacteristics = [
    {
      id: 'kind',
      label: '優しい',
      labelEn: 'Kind'
    },
    {
      id: 'funny',
      label: '面白い',
      labelEn: 'Funny'
    },
    {
      id: 'smart',
      label: '賢い',
      labelEn: 'Smart'
    },
    {
      id: 'caring',
      label: '思いやりがある',
      labelEn: 'Caring'
    },
    {
      id: 'energetic',
      label: '元気',
      labelEn: 'Energetic'
    },
    {
      id: 'calm',
      label: '落ち着いている',
      labelEn: 'Calm'
    },
    {
      id: 'supportive',
      label: '支えてくれる',
      labelEn: 'Supportive'
    },
    {
      id: 'romantic',
      label: 'ロマンチック',
      labelEn: 'Romantic'
    }
  ];
  
  localStorage.setItem('adminCharacteristics', JSON.stringify(defaultCharacteristics));
  return defaultCharacteristics;
};

export const getDemoVoices = () => {
  const stored = localStorage.getItem('demoVoices');
  return stored ? JSON.parse(stored).filter((v: any) => v.isSelected) : [];
};