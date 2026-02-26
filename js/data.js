// ══════════════════════════════════════════════════════════
// GLOBAL STATE & DATA
// ══════════════════════════════════════════════════════════

// App global state
const APP = {
  role: 'dentiste',
  user: 'Dr. Ben Abdallah Rebai',
  today: new Date(2025, 5, 18), // June 18 2025
  currentPage: 'dashboard',
  calView: 'monthly',
  calDate: new Date(2025, 5, 1),
  sidebarCollapsed: false,
};

// Patients data
const PATIENTS = [
  {
    id: 1, nom: 'Jalel', prenom: 'Derbel', dob: '12/04/1987', tel: '22 345 678', email: 'jalel.derbel@gmail.com', sexe: 'M', groupe: 'A+',
    antecedents: { med: ['Hypertension', 'Diabète type 2'], chir: ['Appendicectomie 2015'], allergies: ['Amoxicilline', 'Latex'], anesthesie: 'Nécessite dosage réduit' },
    teeth: { 16: 'crown', 26: 'crown', 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 17: 'bridge', 27: 'bridge', 14: 'caries', 34: 'caries', 44: 'caries', 22: 'devitalized', 35: 'sealed', 45: 'implant' },
    notes: 'Patient anxieux, prévoir prémédication si intervention longue.'
  },
  {
    id: 2, nom: 'Leila', prenom: 'Mansouri', dob: '08/07/1994', tel: '55 678 901', email: 'l.mansouri@hotmail.fr', sexe: 'F', groupe: 'O-',
    antecedents: { med: ['Asthme'], chir: [], allergies: ['AINS'], anesthesie: '' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 16: 'crown', 46: 'crown', 15: 'caries', 35: 'caries' },
    notes: ''
  },
  {
    id: 3, nom: 'Mohamed', prenom: 'Trabelsi', dob: '22/01/1975', tel: '98 123 456', email: 'm.trabelsi@gmail.com', sexe: 'M', groupe: 'B+',
    antecedents: { med: ['Cardiopathie - sous anticoagulants'], chir: ['Bypass 2019'], allergies: ['Pénicilline'], anesthesie: 'Consulter cardiologue avant chirurgie' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 11: 'crown', 21: 'crown', 12: 'devitalized', 22: 'devitalized', 36: 'absent', 46: 'absent' },
    notes: 'Anticoagulation: INR à surveiller. Arrêt Warfarine 5j avant extraction.'
  },
  {
    id: 4, nom: 'Sonia', prenom: 'Jaber', dob: '15/03/2001', tel: '25 789 012', email: 'sonia.j@gmail.com', sexe: 'F', groupe: 'A-',
    antecedents: { med: [], chir: [], allergies: [], anesthesie: '' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent' },
    notes: 'Patiente jeune, bonne hygiène buccale.'
  },
  {
    id: 5, nom: 'Rami', prenom: 'Chaabane', dob: '30/11/1969', tel: '71 234 567', email: 'r.chaabane@orange.tn', sexe: 'M', groupe: 'AB+',
    antecedents: { med: ['Ostéoporose - Bisphosphonates'], chir: [], allergies: ['Clindamycine'], anesthesie: '' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 14: 'caries', 24: 'caries', 34: 'caries', 44: 'caries', 17: 'absent', 27: 'absent', 16: 'crown' },
    notes: 'Bisphosphonates: risque ostéonécrose, éviter extractions si possible.'
  },
  {
    id: 6, nom: 'Amira', prenom: 'Khelifi', dob: '05/09/1990', tel: '52 901 234', email: 'amira.k@gmail.com', sexe: 'F', groupe: 'O+',
    antecedents: { med: [], chir: ['Thyroïdectomie 2022'], allergies: [], anesthesie: '' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 25: 'implant', 35: 'implant' },
    notes: ''
  },
  {
    id: 7, nom: 'Hedi', prenom: 'Bouaziz', dob: '18/06/1958', tel: '99 567 890', email: 'hedi.b@yahoo.fr', sexe: 'M', groupe: 'B-',
    antecedents: { med: ['Insuffisance rénale chronique', 'HTA'], chir: [], allergies: ['Tétracyclines', 'AINS'], anesthesie: 'Adapter doses selon DFG' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 17: 'absent', 27: 'absent', 37: 'absent', 47: 'absent', 16: 'crown', 26: 'crown', 36: 'crown', 46: 'crown', 11: 'devitalized', 21: 'devitalized' },
    notes: 'Dialyse 3x/semaine (Lun/Mer/Ven). Préférer RDV Mardi ou Jeudi.'
  },
  {
    id: 8, nom: 'Nour', prenom: 'Ayari', dob: '27/02/2008', tel: '23 456 789', email: 'nour.ayari@gmail.com', sexe: 'F', groupe: 'A+',
    antecedents: { med: [], chir: [], allergies: [], anesthesie: '' },
    teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent', 16: 'sealed', 26: 'sealed', 36: 'sealed', 46: 'sealed' },
    notes: 'Patiente mineure. Consentement parental requis.'
  },
];

// Appointments data
const APPOINTMENTS = [
  { id: 1, patientId: 1, date: '2025-06-18', time: '08:30', duration: 60, type: 'checkup', status: 'confirmed', notes: 'Bilan annuel', dentiste: 'Dr. Benali' },
  { id: 2, patientId: 2, date: '2025-06-18', time: '09:45', duration: 45, type: 'caries', status: 'confirmed', notes: 'Soins dent 15', dentiste: 'Dr. Benali' },
  { id: 3, patientId: 3, date: '2025-06-18', time: '11:00', duration: 30, type: 'detartrage', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
  { id: 4, patientId: 4, date: '2025-06-18', time: '14:00', duration: 45, type: 'orthodontie', status: 'waiting', notes: 'Première consultation', dentiste: 'Dr. Benali' },
  { id: 5, patientId: 5, date: '2025-06-18', time: '15:30', duration: 60, type: 'extraction', status: 'confirmed', notes: 'Dent 17', dentiste: 'Dr. Benali' },
  { id: 6, patientId: 6, date: '2025-06-18', time: '17:00', duration: 45, type: 'implant', status: 'confirmed', notes: 'Contrôle implant 25', dentiste: 'Dr. Benali' },
  { id: 7, patientId: 7, date: '2025-06-19', time: '09:00', duration: 60, type: 'prothese', status: 'confirmed', notes: 'Couronne 16', dentiste: 'Dr. Benali' },
  { id: 8, patientId: 8, date: '2025-06-19', time: '10:30', duration: 30, type: 'checkup', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
  { id: 9, patientId: 1, date: '2025-06-19', time: '14:00', duration: 45, type: 'caries', status: 'waiting', notes: 'Soins dent 14', dentiste: 'Dr. Benali' },
  { id: 10, patientId: 2, date: '2025-06-20', time: '09:00', duration: 60, type: 'detartrage', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
  { id: 11, patientId: 3, date: '2025-06-16', time: '10:00', duration: 45, type: 'caries', status: 'cancelled', notes: 'Annulé - report demandé', dentiste: 'Dr. Benali' },
  { id: 12, patientId: 4, date: '2025-06-17', time: '14:30', duration: 30, type: 'checkup', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
  { id: 13, patientId: 5, date: '2025-06-23', time: '09:00', duration: 90, type: 'extraction', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
  { id: 14, patientId: 6, date: '2025-06-24', time: '11:00', duration: 60, type: 'implant', status: 'waiting', notes: '', dentiste: 'Dr. Benali' },
  { id: 15, patientId: 7, date: '2025-06-25', time: '15:00', duration: 45, type: 'prothese', status: 'confirmed', notes: '', dentiste: 'Dr. Benali' },
];

// Prescriptions (Ordonnances) data
const ORDONNANCES = [
  {
    id: 1, patientId: 1, date: '2025-06-01', medicaments: [
      { nom: 'Amoxicilline 1g', posologie: '1 cp matin et soir', duree: '7 jours', quantite: '14 cps' },
      { nom: 'Ibuprofène 400mg', posologie: '1 cp toutes les 8h si douleur', duree: '5 jours', quantite: '15 cps' },
    ], notes: 'À prendre en mangeant. Éviter alcool.', dentiste: 'Dr. Benali'
  },
  {
    id: 2, patientId: 2, date: '2025-06-10', medicaments: [
      { nom: 'Paracétamol 1g', posologie: '1 cp toutes les 6h max', duree: '3 jours', quantite: '12 cps' },
      { nom: 'Chlorhexidine bain de bouche 0.2%', posologie: 'Bain de bouche 2x/j 30s', duree: '10 jours', quantite: '1 flacon' },
    ], notes: '', dentiste: 'Dr. Benali'
  },
  {
    id: 3, patientId: 3, date: '2025-06-12', medicaments: [
      { nom: 'Clindamycine 300mg', posologie: '1 cp 3x/j', duree: '7 jours', quantite: '21 cps' },
      { nom: 'Prednisone 20mg', posologie: '1 cp le matin', duree: '5 jours', quantite: '5 cps' },
    ], notes: 'Surveillance INR. Allergie pénicilline confirmée.', dentiste: 'Dr. Benali'
  },
  {
    id: 4, patientId: 5, date: '2025-06-15', medicaments: [
      { nom: 'Paracétamol 500mg', posologie: '2 cps toutes les 6h max', duree: '5 jours', quantite: '30 cps' },
    ], notes: 'Post-extraction dent 17.', dentiste: 'Dr. Benali'
  },
];

// Periodontal data (for dental chart)
const PARO_DATA = {};

// Treatment history
const TREATMENTS = {
  1: [
    { date: '2025-06-01', dent: 14, type: 'Carie', desc: 'Obturation résine composite', dentiste: 'Dr. Benali' },
    { date: '2025-03-15', dent: 16, type: 'Couronne', desc: 'Pose couronne céramique', dentiste: 'Dr. Benali' },
    { date: '2024-11-20', dent: 18, type: 'Extraction', desc: 'Extraction dent de sagesse supérieure droite', dentiste: 'Dr. Benali' },
    { date: '2024-06-10', dent: null, type: 'Détartrage', desc: 'Détartrage + polissage complet', dentiste: 'Dr. Benali' },
  ],
  2: [
    { date: '2025-06-10', dent: 15, type: 'Carie', desc: 'Obturation amalgame', dentiste: 'Dr. Benali' },
    { date: '2025-01-20', dent: 16, type: 'Couronne', desc: 'Couronne zircone', dentiste: 'Dr. Benali' },
  ],
  3: [
    { date: '2025-06-12', dent: 12, type: 'Dévitalisation', desc: 'Traitement endodontique mono-canalaire', dentiste: 'Dr. Benali' },
    { date: '2024-09-05', dent: 36, type: 'Extraction', desc: 'Extraction dent fracturée', dentiste: 'Dr. Benali' },
  ],
};

// Notifications
const NOTIFICATIONS = [
  { icon: '🦷', title: 'RDV dans 30 min', sub: 'Jalel Derbel — 08:30 — Bilan' },
  { icon: '⚠️', title: 'Allergie signalée', sub: 'Mohamed Trabelsi — Pénicilline' },
  { icon: '📋', title: 'Ordonnance expirée', sub: 'Sonia Jaber — Fluor' },
  { icon: '🗓️', title: 'RDV annulé', sub: 'Mohamed Trabelsi — Hier 10:00' },
  { icon: '💊', title: 'Rappel médicament', sub: 'Rami Chaabane — Bisphosphonates' },
];

// Selected role for login
let selectedRole = 'dentiste';

// Chart built flags
const chartFaceBuilt = {};
const chartParoBuilt = {};
