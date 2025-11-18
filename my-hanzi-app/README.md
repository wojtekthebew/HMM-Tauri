# Structured Mnemonic Generator - Enhanced Version

A comprehensive tool for creating and managing mnemonic systems for language learning, featuring automatic file persistence, backup system, optimized image handling, and data validation.

## 🎯 Key Features

### 1. **Automatic File Persistence**
- All data automatically saves to JSON files in the `data/` directory
- Changes are written to disk immediately after any create, update, or delete operation
- Files are updated through Tauri's file system API
- Fallback to localStorage if Tauri API is unavailable

### 2. **Backup System**
- **Auto-backup**: Automatic backups every 5 minutes
- **Manual backup**: Click the "💾 Backup Now" button or press `Ctrl+S`
- Backups are stored in `data/backups/` with timestamps
- Each backup includes all four JSON files (actors, sets, props, characters)

### 3. **Image Optimization**
- Images are automatically optimized to 800px width
- Reduced file sizes with 80% JPEG quality
- Base64 encoding for easy storage in JSON files
- Live preview when uploading images

### 4. **Data Validation**
- Comprehensive validation for all data types
- Duplicate name checking
- Required field enforcement
- Cross-reference validation (actors, sets, props must exist)
- User-friendly error messages

### 5. **Undo/Redo System**
- Track up to 20 previous states
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Y` (redo)
- Visual indicators showing when undo/redo is available

## 📁 File Structure

```
project/
├── data/
│   ├── actors.json         # Actor definitions
│   ├── sets.json          # Set locations
│   ├── props.json         # Props/objects
│   ├── characters.json    # Character mnemonics
│   └── backups/           # Automatic backups
│       └── backup_YYYY-MM-DDTHH-MM-SS/
│           ├── actors.json
│           ├── sets.json
│           ├── props.json
│           └── characters.json
├── index.html
├── script.js
├── styles.css
└── README.md
```

## 🚀 Tauri Integration Setup

### Prerequisites
1. Rust installed (https://rustup.rs/)
2. Node.js and npm
3. Tauri CLI: `npm install -g @tauri-apps/cli`

### Tauri Configuration

In your `src-tauri/tauri.conf.json`, add file system permissions:

```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "createDir": true,
        "scope": ["$APP/*", "$APPDATA/*"]
      }
    }
  }
}
```

### Running the Application

```bash
# Development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## 💻 Usage Guide

### Adding Actors
1. Navigate to the "Actors" tab
2. Fill in the name and optional Pinyin initial
3. Optionally upload an image
4. Click "Add Actor" or press Enter

### Creating Set Locations
1. Go to "Sets" tab
2. Enter set name
3. Define tone sections in JSON format:
   ```json
   {
     "1": "Kitchen",
     "2": "Bedroom",
     "3": "Garden",
     "4": "Bathroom"
   }
   ```
4. Upload an optional image
5. Submit the form

### Managing Props
1. Switch to "Props" tab
2. Enter prop name and select category
3. Add components (comma-separated)
4. Upload image if desired
5. Save the prop

### Creating Characters (Mnemonics)
1. Open "Characters" tab
2. Fill in required fields:
   - **Hanzi**: The Chinese character
   - **Pinyin**: Romanization
   - **Meaning**: English translation
   - **Actor**: Choose from list or quick-add
   - **Set Location**: Where the scene occurs
   - **Tone Section**: Specific area within the set
3. Select multiple props (use Ctrl/Cmd for multi-select)
4. Write your mnemonic story in the Plot field
5. Add an image if available
6. Submit to save

### Quick Add Feature
- Click the "+" button next to Actor, Set, or Prop dropdowns
- Fill in basic info in the modal
- Item is immediately added and selected

### Advanced Search
- Click "Advanced Search" in the Characters tab
- Filter by any combination of:
  - Hanzi text
  - Pinyin
  - Meaning
  - Associated actor
  - Set location
  - Props used

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Manual backup |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Y` | Redo action |
| `Escape` | Clear search box / Close modal |
| `Enter` | Submit form (except in textareas) |
| `Shift+Enter` | New line in textarea |
| `Ctrl+Enter` | Submit form from textarea |

## 🔧 API Functions

### TauriAPI Bridge
```javascript
// Write file
await TauriAPI.writeFile(path, content);

// Read file
const content = await TauriAPI.readFile(path);

// Create directory
await TauriAPI.createDir(path);
```

### Data Management
```javascript
// Save all data to files
await saveAllData();

// Save specific data type
await saveDataToFile('ACTORS');

// Create manual backup
await manualBackup();
```

### Validation
```javascript
// Validate character data
const errors = validateCharacterData(characterData);
if (errors.length > 0) {
  // Handle errors
}
```

## 🎨 Theming

Toggle between light and dark themes using the "🌓 Toggle Theme" button. Theme preference is saved to localStorage and persists across sessions.

## 📊 Data Format Examples

### Actor
```json
{
  "id": "1",
  "name": "Brad Pitt",
  "PinyinInitial": "b",
  "image": "data:image/jpeg;base64,...",
  "characters": ["1", "5"]
}
```

### Set
```json
{
  "id": "1",
  "name": "Gamelan",
  "tone_sections": {
    "1": "Tempat rokok",
    "2": "Kitchen",
    "3": "Bedroom"
  },
  "image": "",
  "characters": ["1"]
}
```

### Character
```json
{
  "id": "1",
  "hanzi": "儿",
  "pinyin": "Er",
  "meaning": "Child",
  "actor": "47",
  "set_location": "1",
  "tone_section": "2",
  "props": ["1"],
  "plot": "Shaq eats a Banana and turns into a child",
  "image": "",
  "memory_scene": "",
  "audio_file": ""
}
```

## 🐛 Troubleshooting

### Data not persisting
- Ensure Tauri file system permissions are configured
- Check console for error messages
- Verify `data/` directory exists and is writable

### Images not loading
- Check file size (should be under 5MB after optimization)
- Ensure browser supports canvas API
- Verify image format is supported (JPEG, PNG, GIF, WebP)

### Backup failing
- Ensure `data/backups/` directory exists
- Check available disk space
- Verify write permissions

### Undo/Redo not working
- Only tracks 20 states maximum
- Refreshing page clears history
- Check if undo/redo buttons are enabled

## 🔐 Data Privacy

- All data is stored locally on your device
- No cloud synchronization or external servers
- Images are base64-encoded and stored in JSON files
- Backups remain on your local machine

## 📝 Best Practices

1. **Regular Backups**: Even with auto-backup, manually backup before major changes
2. **Image Sizes**: Keep images reasonable (under 2MB before optimization)
3. **Organized Naming**: Use consistent naming conventions for easy searching
4. **Tone Sections**: Plan your set layouts before adding many characters
5. **Props Reuse**: Create reusable props that work across multiple characters

## 🛠️ Development

### Adding New Features
1. Update DATA object structure if needed
2. Add validation functions
3. Implement UI components
4. Add save/load logic
5. Update this README

### Testing
- Test file persistence by checking JSON files
- Verify backups are created correctly
- Test undo/redo with various operations
- Validate error handling for invalid data
- Check cross-platform compatibility

## 📄 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

Feel free to fork and modify for your specific needs. Key areas for enhancement:
- Export/import functionality
- Print-friendly views
- Spaced repetition integration
- Audio file support
- Multi-language support

---

**Version**: 2.0  
**Last Updated**: November 2025  
**Requires**: Tauri v1.x or higher