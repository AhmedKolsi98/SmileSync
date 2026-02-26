# SmileSync

**SmileSync** is a modern dental clinic management system designed to streamline the daily operations of dental practices. Built with a clean, professional interface, it provides comprehensive tools for patient management, appointment scheduling, dental charting, and prescriptions.

![SmileSync](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

### 1. Patient Management
- Complete patient records with personal information
- Medical history and clinical notes
- Search and filter patients easily
- Patient detail view with tabs for different sections

### 2. Appointment Scheduling (Agenda)
- Interactive calendar view
- Create, edit, and delete appointments
- Appointment status tracking
- Notes and observations per appointment

### 3. Dental Charting
- Interactive 2D dental chart visualization
- 3D dental arcade view
- Tooth status tracking with color coding:
  - **Healthy** (Green)
  - **Caries** (Red)
  - **Treated** (Blue)
  - **Extracted** (Gray)
  - **Devital** (Purple)
  - **Crown** (Cyan)
  - **Implant** (Yellow)
  - **Bridge** (Pink)
  - **Sealed** (Lime)
  - **Absent** (Dark)
- Detailed tooth information modal

### 4. Prescriptions (Ordonnances)
- Create and manage patient prescriptions
- Print-ready prescription format
- Medication tracking
- Notes and instructions

### 5. Dashboard
- Overview of clinic activity
- Quick access to recent patients
- Today's appointments summary
- Key metrics and statistics

---

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **JavaScript (ES6+)** - Client-side functionality
- **Google Fonts** - Typography (DM Mono, Syne, Instrument Serif)

---

## Project Structure

```
SmileSync/
|
|-- index.html          # Main application file
|-- README.md           # Project documentation
|
|-- styles/
    |-- base.css        # Reset and base styles
    |-- variables.css   # CSS custom properties
    |-- layout.css      # Layout and grid styles
    |-- components.css  # Reusable UI components
    |-- calendar.css    # Calendar/agenda styles
    |-- dental-chart.css# Dental chart visualization
    |-- features.css    # Feature-specific styles
    |-- utilities.css   # Utility classes
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Fonts)

### Installation

1. Clone or download the repository
2. Open `SmileSync/index.html` in your web browser

No build process or server required - the application runs entirely in the browser.

---

## Usage

### Navigation
Use the sidebar to navigate between different sections:
- **Dashboard** - Overview and quick actions
- **Patients** - Patient management
- **Agenda** - Appointment calendar
- **Ordonnances** - Prescription management

### Adding a Patient
1. Click the **+** button in the patients section
2. Fill in the patient information form
3. Save to add the patient to the system

### Managing Appointments
1. Go to the **Agenda** section
2. Click on a time slot or the **+** button
3. Select patient, set date/time, and add notes

### Dental Chart
1. Open a patient detail view
2. Navigate to the **Fiche Dentaire** tab
3. Click on any tooth to update its status
4. Choose from available tooth conditions

### Creating Prescriptions
1. Open a patient detail view
2. Go to the **Ordonnances** tab
3. Create a new prescription with medications and instructions

---

## Data Storage

All data is stored locally in the browser using **localStorage**. This means:
- Data persists between sessions
- No server or database required
- Data is specific to the browser used

> **Note:** Clearing browser data will remove all stored information.

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

---

## Customization

### Colors
Edit CSS variables in `styles/variables.css` to customize the color scheme:

```css
:root {
  --bg: #0b0d12;
  --accent: #3dffa0;
  --cyan: #00e5ff;
  /* ... more variables */
}
```

### Adding New Tooth States
To add new tooth conditions, update the `TOOTH_SC` and `TOOTH_SL` objects in `index.html`.

---

## License

This project is licensed under the MIT License.

---

## Authors

Developed for dental clinic management needs.

---

## Screenshots

The application features a dark theme with accent colors, providing a modern and professional look suitable for dental practice management.