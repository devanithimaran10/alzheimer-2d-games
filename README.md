# Memory Games for Alzheimer's Care

A collection of six therapeutic games designed specifically for Alzheimer's patients to help exercise different types of memory and cognitive functions.

## Games Included

1. **Daily Routine Sequencer** - Arrange steps of familiar activities in the correct order (procedural memory)
2. **Musical Time Travel** - Complete lyrics from classic songs (auditory & long-term memory)
3. **Memory Tray** - Remember items shown on a tray (working memory)
4. **Grocery Aisle Sorter** - Sort items into correct categories (semantic memory)
5. **Faces & Names** - Match photos to names or relationships (facial recognition)
6. **Spot the Odd One** - Find the item that's different (attention & visual processing)

## Design Principles

- **Large, clear visuals** - High contrast, easy-to-see elements
- **Gentle feedback** - No harsh "X" marks, gentle guidance instead
- **Accessible** - Large buttons, clear text, simple interactions
- **Positive reinforcement** - Encouraging messages and success feedback
- **Low pressure** - No time limits, ability to skip or reset

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── MainMenu.jsx          # Main menu with game selection
│   └── games/
│       ├── GameLayout.jsx     # Shared layout for all games
│       ├── DailyRoutine.jsx
│       ├── MusicalTimeTravel.jsx
│       ├── MemoryTray.jsx
│       ├── GroceryAisle.jsx
│       ├── FacesAndNames.jsx
│       └── SpotTheOddOne.jsx
├── App.jsx                    # Main app component with routing
└── main.jsx                   # Entry point
```

## Customization

### Adding Real Photos

For the **Faces & Names** game, replace the emoji placeholders with actual photos:
- Store photos in `public/images/`
- Update the `people` array in `FacesAndNames.jsx` to use image paths
- Use photos from when the patient knew the person (30+ years ago may be more recognizable)

### Adding Real Audio

For the **Musical Time Travel** game:
- Store audio files in `public/audio/`
- Update the `songs` array to include audio file paths
- Use the HTML5 Audio API or a library like `howler.js` for playback

### Adjusting Difficulty

Each game has configurable difficulty:
- **Memory Tray**: Toggle between 3 items (easy) and 5 items (hard)
- **Daily Routine**: Add more steps or simplify existing ones
- **Grocery Aisle**: Add more categories or items

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3 (no external UI libraries for maximum accessibility)

## License

This project is designed for therapeutic use with Alzheimer's patients.

