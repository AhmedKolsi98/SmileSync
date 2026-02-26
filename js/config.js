// ══════════════════════════════════════════════════════════
// CONFIGURATION & CONSTANTS
// ══════════════════════════════════════════════════════════

// Page titles
const PAGE_TITLES = { 
  dashboard: 'Tableau de bord', 
  patients: 'Patients', 
  agenda: 'Agenda', 
  ordonnances: 'Ordonnances' 
};

// Appointment type labels
const TYPE_LABELS = { 
  checkup: 'Bilan', 
  caries: 'Soins caries', 
  detartrage: 'Détartrage', 
  extraction: 'Extraction', 
  implant: 'Implant', 
  orthodontie: 'Orthodontie', 
  prothese: 'Prothèse' 
};

// Appointment type CSS classes
const TYPE_CLASSES = { 
  checkup: 'type-checkup', 
  caries: 'type-caries', 
  detartrage: 'type-detartrage', 
  extraction: 'type-extraction', 
  implant: 'type-implant', 
  orthodontie: 'type-orthodontie', 
  prothese: 'type-prothese' 
};

// Appointment status labels
const STATUS_LABELS_RDV = { 
  confirmed: 'Confirmé', 
  waiting: 'En attente', 
  cancelled: 'Annulé' 
};

// Appointment status colors
const STATUS_COLORS_RDV = { 
  confirmed: 'badge-green', 
  waiting: 'badge-yellow', 
  cancelled: 'badge-red' 
};

// Tooth status colors (for dental chart)
const TOOTH_SC = { 
  healthy: '#3dffa0', 
  caries: '#ff4d6d', 
  treated: '#4d9fff', 
  extracted: '#3a3f58', 
  devitalized: '#9f7aea', 
  crown: '#00e5ff', 
  implant: '#ffb830', 
  bridge: '#f472b6', 
  sealed: '#b0ff4f', 
  absent: '#22273a' 
};

// Tooth status labels
const TOOTH_SL = { 
  healthy: 'Sain', 
  caries: 'Carie', 
  treated: 'Traité', 
  extracted: 'Extrait', 
  devitalized: 'Dévitalisé', 
  crown: 'Couronne', 
  implant: 'Implant', 
  bridge: 'Bridge', 
  sealed: 'Scellée', 
  absent: 'Absent' 
};

// Tooth status backgrounds
const TOOTH_SB = { 
  healthy: { bg: 'rgba(61,255,160,.15)', c: '#3dffa0' }, 
  caries: { bg: 'rgba(255,77,109,.15)', c: '#ff4d6d' }, 
  treated: { bg: 'rgba(77,159,255,.15)', c: '#4d9fff' }, 
  extracted: { bg: 'rgba(58,63,88,.3)', c: '#9aa3be' }, 
  devitalized: { bg: 'rgba(159,122,234,.15)', c: '#9f7aea' }, 
  crown: { bg: 'rgba(0,229,255,.15)', c: '#00e5ff' }, 
  implant: { bg: 'rgba(255,184,48,.15)', c: '#ffb830' }, 
  bridge: { bg: 'rgba(244,114,182,.15)', c: '#f472b6' }, 
  sealed: { bg: 'rgba(176,255,79,.15)', c: '#b0ff4f' }, 
  absent: { bg: 'rgba(34,39,58,.3)', c: '#545c7a' } 
};

// Tooth names (FDI notation)
const TOOTH_NAMES = { 
  18: '3e Molaire', 17: '2e Molaire', 16: '1re Molaire', 15: '2e Prémolaire', 
  14: '1re Prémolaire', 13: 'Canine', 12: 'Inc. latérale', 11: 'Inc. centrale', 
  21: 'Inc. centrale', 22: 'Inc. latérale', 23: 'Canine', 24: '1re Prémolaire', 
  25: '2e Prémolaire', 26: '1re Molaire', 27: '2e Molaire', 28: '3e Molaire', 
  48: '3e Molaire', 47: '2e Molaire', 46: '1re Molaire', 45: '2e Prémolaire', 
  44: '1re Prémolaire', 43: 'Canine', 42: 'Inc. latérale', 41: 'Inc. centrale', 
  31: 'Inc. centrale', 32: 'Inc. latérale', 33: 'Canine', 34: '1re Prémolaire', 
  35: '2e Prémolaire', 36: '1re Molaire', 37: '2e Molaire', 38: '3e Molaire' 
};

// Tooth arcade positions (upper and lower)
const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
