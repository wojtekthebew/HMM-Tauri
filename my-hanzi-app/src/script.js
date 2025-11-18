// ... (All your existing functions: loadDataFromFiles, saveState, openTab, etc.)

// ---------------------------------------------------------------------

/**
 * 🚀 Initialization Function
 * Called once the DOM is fully loaded.
 */
import {
    mkdir,
    writeTextFile,
    readTextFile,
    exists
} from "@tauri-apps/plugin-fs";

async function testTauriV2FileSystem() {
    console.log('🧪 Testing Tauri v2 File System...');

    try {
        // Create a directory
        await mkdir('test-dir', { recursive: true });
        console.log('✅ Directory creation works');

        // Write a file
        await writeTextFile('test-dir/test.json', JSON.stringify({
            test: 'Hello Tauri v2!'
        }));
        console.log('✅ File writing works');

        // Read a file
        const content = await readTextFile('test-dir/test.json');
        console.log('✅ File reading works:', JSON.parse(content));

        // Check existence
        const ok = await exists('test-dir/test.json');
        console.log('✅ File exists check works:', ok);

        console.log('🎉 All Tauri v2 FS tests passed!');
    } catch (err) {
        console.error('❌ Tauri v2 FS test failed:', err);
    }
}

/**
 * Sets up all necessary click, submit, and input change listeners.
 */
function setupEventListeners() {
    // Tab Navigation
    document.getElementById('tabCharactersBtn')?.addEventListener('click', (e) => openTab('characters', e.currentTarget));
    document.getElementById('tabActorsBtn')?.addEventListener('click', (e) => openTab('actors', e.currentTarget));
    document.getElementById('tabSetsBtn')?.addEventListener('click', (e) => openTab('sets', e.currentTarget));
    document.getElementById('tabPropsBtn')?.addEventListener('click', (e) => openTab('props', e.currentTarget));

    // Form Submissions
    document.getElementById('actorForm')?.addEventListener('submit', saveActor);
    document.getElementById('setForm')?.addEventListener('submit', saveSet);
    document.getElementById('propForm')?.addEventListener('submit', saveProp);
    // You'll need one for the main character form too, e.g.:
    // document.getElementById('characterForm')?.addEventListener('submit', saveCharacter); 
    
    // Quick Add Modal Submission
    document.getElementById('quickAddForm')?.addEventListener('submit', saveQuickAddItem);
    
    // Undo/Redo/Backup
    document.getElementById('undoBtn')?.addEventListener('click', undo);
    document.getElementById('redoBtn')?.addEventListener('click', redo);
    document.getElementById('manualBackupBtn')?.addEventListener('click', manualBackup);
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

    // Search and Advanced Search
    document.getElementById('characterSearchBtn')?.addEventListener('click', performAdvancedSearch);
    document.getElementById('clearSearchBtn')?.addEventListener('click', clearAdvancedSearch);
    document.getElementById('toggleAdvancedSearchBtn')?.addEventListener('click', toggleAdvancedSearch);
    
    // Cancel/Reset Buttons
    document.getElementById('actorCancelBtn')?.addEventListener('click', cancelActorEdit);
    document.getElementById('setCancelBtn')?.addEventListener('click', cancelSetEdit);
    document.getElementById('propCancelBtn')?.addEventListener('click', cancelPropEdit);
    // ... and other necessary listeners (image previews, search input changes, etc.)
}


// ---------------------------------------------------------------------
// ⬇️ KICK-OFF: Ensures the script runs only after the entire HTML is loaded.
// ---------------------------------------------------------------------

window.addEventListener('DOMContentLoaded', init);

// Add to script.js for testing
async function testTauriV2FileSystem() {
    console.log('🧪 Testing Tauri v2 File System...');
    
    try {
        // Test directory creation
        await TauriAPI.createDir('test-dir');
        console.log('✅ Directory creation works');
        
        // Test file writing
        await TauriAPI.writeFile('test-dir/test.json', JSON.stringify({
            test: 'Hello Tauri v2!'
        }));
        console.log('✅ File writing works');
        
        // Test file reading
        const content = await TauriAPI.readFile('test-dir/test.json');
        const data = JSON.parse(content);
        console.log('✅ File reading works:', data);
        
        // Test file existence check
        const exists = await TauriAPI.exists('test-dir/test.json');
        console.log('✅ File exists check works:', exists);
        
        console.log('🎉 All tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
}

// Run test on load (remove after confirming it works)
document.addEventListener('DOMContentLoaded', async () => {
    await testTauriV2FileSystem();
    
});

// Data Storage - load from JSON files first
const DATA = {
    ACTORS: [],
    SETS: [],
    PROPS: [],
    CHARACTERS: []
};

// File paths
const ACTOR_FILE = 'data/actors.json';
const SET_FILE = 'data/sets.json';
const PROP_FILE = 'data/props.json';
const CHARACTER_FILE = 'data/characters.json';
const IMAGE_DIR = 'data/images';
const BACKUP_DIR = 'data/backups';

const STORAGE_KEYS = {
    ACTORS: ACTOR_FILE,
    SETS: SET_FILE,
    PROPS: PROP_FILE,
    CHARACTERS: CHARACTER_FILE
};

// Tauri API bridge (assumes __TAURI__ is available)
// Tauri v2 API bridge
// Tauri v2 API bridge - UPDATED
const TauriAPI = {
    async writeFile(path, content) {
        // Check if running in Tauri
        if (window.__TAURI_INTERNALS__) {
            try {
                // Dynamically import Tauri modules
                const { writeTextFile } = await import('@tauri-apps/plugin-fs');
                const { appDataDir } = await import('@tauri-apps/api/path');
                
                const appDir = await appDataDir();
                const fullPath = `${appDir}${path}`;
                
                await writeTextFile(fullPath, content);
                console.log(`✅ Wrote to: ${fullPath}`);
            } catch (error) {
                console.error('❌ Tauri write error:', error);
                // Fallback to localStorage
                localStorage.setItem(path, content);
            }
        } else {
            console.warn('⚠️ Tauri not available, using localStorage');
            localStorage.setItem(path, content);
        }
    },
    
    async readFile(path) {
        if (window.__TAURI_INTERNALS__) {
            try {
                const { readTextFile } = await import('@tauri-apps/plugin-fs');
                const { appDataDir } = await import('@tauri-apps/api/path');
                
                const appDir = await appDataDir();
                const fullPath = `${appDir}${path}`;
                
                const content = await readTextFile(fullPath);
                console.log(`✅ Read from: ${fullPath}`);
                return content;
            } catch (error) {
                console.warn(`⚠️ Could not read ${path}, returning null`);
                return null;
            }
        } else {
            console.warn('⚠️ Tauri not available, using localStorage');
            return localStorage.getItem(path);
        }
    },
    
    async createDir(path) {
        if (window.__TAURI_INTERNALS__) {
            try {
                const { mkdir, exists } = await import('@tauri-apps/plugin-fs');
                const { appDataDir } = await import('@tauri-apps/api/path');
                
                const appDir = await appDataDir();
                const fullPath = `${appDir}${path}`;
                
                const dirExists = await exists(fullPath);
                if (!dirExists) {
                    await mkdir(fullPath, { recursive: true });
                    console.log(`✅ Created directory: ${fullPath}`);
                }
            } catch (error) {
                console.log('Directory operation:', error.message);
            }
        }
    },
    
    async exists(path) {
        if (window.__TAURI_INTERNALS__) {
            try {
                const { exists } = await import('@tauri-apps/plugin-fs');
                const { appDataDir } = await import('@tauri-apps/api/path');
                
                const appDir = await appDataDir();
                const fullPath = `${appDir}${path}`;
                
                return await exists(fullPath);
            } catch (error) {
                return false;
            }
        }
        return false;
    }
};

// Utility functions
function getNextId(items) {
    if (!items.length) return '1';
    const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
    return (maxId + 1).toString();
}

// Data Validation
function validateCharacterData(data) {
    const errors = [];
    
    if (!data.hanzi?.trim()) errors.push('Hanzi is required');
    if (!data.pinyin?.trim()) errors.push('Pinyin is required');
    if (!data.meaning?.trim()) errors.push('Meaning is required');
    if (!data.actor) errors.push('Actor is required');
    if (!data.set_location) errors.push('Set location is required');
    
    // Validate tone section exists in selected set
    const set = DATA.SETS.find(s => s.id === data.set_location);
    if (set && data.tone_section && !set.tone_sections?.[data.tone_section]) {
        errors.push('Invalid tone section for selected set');
    }
    
    // Validate actor exists
    if (data.actor && !DATA.ACTORS.find(a => a.id === data.actor)) {
        errors.push('Selected actor does not exist');
    }
    
    // Validate props exist
    if (data.props && Array.isArray(data.props)) {
        data.props.forEach(propId => {
            if (!DATA.PROPS.find(p => p.id === propId)) {
                errors.push(`Prop with ID ${propId} does not exist`);
            }
        });
    }
    
    return errors;
}

function validateActorData(data, excludeId = null) {
    const errors = [];
    
    if (!data.name?.trim()) errors.push('Actor name is required');
    
    if (isDuplicateName('ACTORS', data.name, excludeId)) {
        errors.push('An actor with this name already exists');
    }
    
    return errors;
}

function validateSetData(data, excludeId = null) {
    const errors = [];
    
    if (!data.name?.trim()) errors.push('Set name is required');
    
    if (isDuplicateName('SETS', data.name, excludeId)) {
        errors.push('A set with this name already exists');
    }
    
    if (data.tone_sections && typeof data.tone_sections !== 'object') {
        errors.push('Tone sections must be a valid object');
    }
    
    return errors;
}

function validatePropData(data, excludeId = null) {
    const errors = [];
    
    if (!data.name?.trim()) errors.push('Prop name is required');
    
    if (isDuplicateName('PROPS', data.name, excludeId)) {
        errors.push('A prop with this name already exists');
    }
    
    return errors;
}

// Check for duplicate names
function isDuplicateName(type, name, excludeId = null) {
    const dataArray = DATA[type];
    return dataArray.some(item => 
        item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId
    );
}

// Optimized image handling
async function optimizeImageStorage(fileInput, maxWidth = 800) {
    return new Promise((resolve) => {
        const file = fileInput.files[0];
        if (!file) {
            resolve(null);
            return;
        }
        
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = () => {
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        
        img.onerror = () => {
            showAlert('Failed to load image', 'error');
            resolve(null);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Preview image in form
async function previewImage(fileInput, previewElementId) {
    const file = fileInput.files[0];
    const previewEl = document.getElementById(previewElementId);
    if (file) {
        const optimizedImage = await optimizeImageStorage(fileInput);
        if (optimizedImage) {
            previewEl.innerHTML = `<img src="${optimizedImage}" style="max-width: 100%; border-radius: 4px;">`;
            fileInput.dataset.imageUrl = optimizedImage;
        }
    } else {
        previewEl.innerHTML = '';
    }
}

function normalizeSeedData(key, arr) {
    if (!Array.isArray(arr)) return [];
    if (key === STORAGE_KEYS.PROPS) {
        return arr.map(p => {
            if (typeof p.components === 'string') {
                const comps = p.components.split(',').map(s => s.trim()).filter(Boolean);
                p.components = comps.length ? comps : [p.components.trim() || ''];
            } else if (!Array.isArray(p.components)) {
                p.components = [];
            }
            if (!Array.isArray(p.used_by)) p.used_by = [];
            return p;
        });
    }
    if (key === STORAGE_KEYS.SETS) {
        return arr.map(s => {
            if (typeof s.tone_sections !== 'object' || s.tone_sections === null) s.tone_sections = {};
            if (!Array.isArray(s.characters)) s.characters = [];
            return s;
        });
    }
    if (key === STORAGE_KEYS.CHARACTERS) {
        return arr.map(c => {
            if (!Array.isArray(c.props)) c.props = Array.isArray(c.props) ? c.props : (c.props ? [c.props] : []);
            return c;
        });
    }
    if (key === STORAGE_KEYS.ACTORS) {
        return arr.map(a => {
            if (!Array.isArray(a.characters)) a.characters = [];
            return a;
        });
    }
    return arr;
}

// Save data to JSON files
async function saveDataToFile(dataType) {
    const filePath = STORAGE_KEYS[dataType];
    const data = DATA[dataType];
    
    try {
        const jsonContent = JSON.stringify(data, null, 2);
        await TauriAPI.writeFile(filePath, jsonContent);
        console.log(`Saved ${dataType} to ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error saving ${dataType}:`, error);
        showAlert(`Failed to save ${dataType}: ${error.message}`, 'error');
        return false;
    }
}

async function saveAllData() {
    try {
        await Promise.all([
            saveDataToFile('ACTORS'),
            saveDataToFile('SETS'),
            saveDataToFile('PROPS'),
            saveDataToFile('CHARACTERS')
        ]);
        return true;
    } catch (error) {
        console.error('Error saving all data:', error);
        return false;
    }
}

// Backup System
async function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${BACKUP_DIR}/backup_${timestamp}`;
    
    try {
        await TauriAPI.createDir(backupPath);
        
        await Promise.all([
            TauriAPI.writeFile(`${backupPath}/actors.json`, JSON.stringify(DATA.ACTORS, null, 2)),
            TauriAPI.writeFile(`${backupPath}/sets.json`, JSON.stringify(DATA.SETS, null, 2)),
            TauriAPI.writeFile(`${backupPath}/props.json`, JSON.stringify(DATA.PROPS, null, 2)),
            TauriAPI.writeFile(`${backupPath}/characters.json`, JSON.stringify(DATA.CHARACTERS, null, 2))
        ]);
        
        console.log(`Backup created at ${backupPath}`);
        return true;
    } catch (error) {
        console.error('Error creating backup:', error);
        return false;
    }
}

// Auto-backup every 5 minutes
let backupInterval;
function startAutoBackup(intervalMinutes = 5) {
    stopAutoBackup(); // Clear any existing interval
    backupInterval = setInterval(async () => {
        await createBackup();
        showAlert('Auto-backup completed', 'success');
    }, intervalMinutes * 60 * 1000);
    console.log(`Auto-backup started (every ${intervalMinutes} minutes)`);
}

function stopAutoBackup() {
    if (backupInterval) {
        clearInterval(backupInterval);
        backupInterval = null;
    }
}

// Manual backup button
async function manualBackup() {
    showAlert('Creating backup...', 'success');
    const success = await createBackup();
    if (success) {
        showAlert('Backup created successfully!', 'success');
    } else {
        showAlert('Failed to create backup', 'error');
    }
}

// Load data from JSON files
async function loadDataFromFiles() {
    console.log("🔄 Starting to load data from files...");
    
    const files = [
        { file: ACTOR_FILE, key: 'ACTORS' },
        { file: SET_FILE, key: 'SETS' },
        { file: PROP_FILE, key: 'PROPS' },
        { file: CHARACTER_FILE, key: 'CHARACTERS' }
    ];

    let allLoaded = true;
    
    for (const { file, key } of files) {
        try {
            console.log(`📁 Attempting to load: ${file}`);
            const content = await TauriAPI.readFile(file);
            
            if (content) {
                console.log(`✅ Successfully read ${file}, content length: ${content.length}`);
                let data = JSON.parse(content);
                data = normalizeSeedData(file, data);
                DATA[key] = data;
                console.log(`📊 Loaded ${data.length} ${key} from ${file}`);
            } else {
                console.warn(`❌ No content found for ${file}, initializing empty array`);
                DATA[key] = [];
                allLoaded = false;
                
                // Create empty file if it doesn't exist
                await TauriAPI.writeFile(file, JSON.stringify([], null, 2));
                console.log(`📝 Created empty ${file}`);
            }
        } catch (e) {
            console.error(`💥 Error loading ${file}:`, e);
            DATA[key] = [];
            allLoaded = false;
            
            // Create empty file on error
            try {
                await TauriAPI.writeFile(file, JSON.stringify([], null, 2));
                console.log(`📝 Created empty ${file} after error`);
            } catch (writeError) {
                console.error(`💥 Failed to create ${file}:`, writeError);
            }
        }
    }
    
    if (allLoaded) {
        console.log("🎉 All data files loaded successfully!");
    } else {
        console.warn("⚠️ Some data files failed to load, using empty arrays");
    }
    
    // Initialize data directories
    await initializeDataDirectories();
}

async function initializeDataDirectories() {
    console.log("📁 Initializing data directories...");
    try {
        await TauriAPI.createDir('data');
        await TauriAPI.createDir('data/images');
        await TauriAPI.createDir('data/backups');
        console.log("✅ Data directories initialized");
    } catch (error) {
        console.error("❌ Failed to create data directories:", error);
    }
}

// Undo/Redo System
const HISTORY = {
    past: [],
    present: JSON.parse(JSON.stringify(DATA)),
    future: [],
    maxSteps: 20
};

async function saveState() {
    HISTORY.past.push(JSON.parse(JSON.stringify(HISTORY.present)));
    HISTORY.present = JSON.parse(JSON.stringify(DATA));
    HISTORY.future = [];
    
    if (HISTORY.past.length > HISTORY.maxSteps) {
        HISTORY.past.shift();
    }
    
    // Save to files
    await saveAllData();
    
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    document.getElementById('undoBtn').disabled = HISTORY.past.length === 0;
    document.getElementById('redoBtn').disabled = HISTORY.future.length === 0;
}

async function undo() {
    if (HISTORY.past.length === 0) return;
    
    HISTORY.future.unshift(JSON.parse(JSON.stringify(HISTORY.present)));
    HISTORY.present = HISTORY.past.pop();
    Object.assign(DATA, HISTORY.present);
    
    await saveAllData();
    refreshLists();
    refreshCharacterForm();
    updateUndoRedoButtons();
    showAlert('Undo completed');
}

async function redo() {
    if (HISTORY.future.length === 0) return;
    
    HISTORY.past.push(JSON.parse(JSON.stringify(HISTORY.present)));
    HISTORY.present = HISTORY.future.shift();
    Object.assign(DATA, HISTORY.present);
    
    await saveAllData();
    refreshLists();
    refreshCharacterForm();
    updateUndoRedoButtons();
    showAlert('Redo completed');
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Utility Functions
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Character Counter Functions
function getCharacterCountForActor(actorId) {
    return DATA.CHARACTERS.filter(char => char.actor === actorId).length;
}

function getCharacterCountForSet(setId) {
    return DATA.CHARACTERS.filter(char => char.set_location === setId).length;
}

function getCharacterCountForProp(propId) {
    return DATA.CHARACTERS.filter(char => char.props.includes(propId)).length;
}

// Tab Management
function openTab(tabName, clickedButton) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    setTimeout(() => {
        const firstInput = document.querySelector(`#${tabName} input, #${tabName} select, #${tabName} textarea`);
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    if (tabName === 'characters') {
        refreshCharacterForm();
        refreshAdvancedSearchOptions();
    }
    refreshLists();
}

// Quick Add Modal Functions
let currentQuickAddType = '';

function openQuickAddModal(type) {
    currentQuickAddType = type;
    const modal = document.getElementById('quickAddModal');
    const title = document.getElementById('quickAddModalTitle');
    const formContent = document.getElementById('quickAddFormContent');
    
    title.textContent = `Quick Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    formContent.innerHTML = getQuickAddFormHTML(type);
    
    modal.style.display = 'block';
    
    setTimeout(() => {
        const firstInput = formContent.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeQuickAddModal() {
    document.getElementById('quickAddModal').style.display = 'none';
    document.getElementById('quickAddForm').reset();
}

function getQuickAddFormHTML(type) {
    switch(type) {
        case 'actor':
            return `
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Pinyin Initial:</label>
                    <input type="text" name="pinyin">
                </div>
            `;
        case 'set':
            return `
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Tone Sections (JSON):</label>
                    <textarea name="tones" rows="3" placeholder='{"1": "Area 1", "2": "Area 2"}'></textarea>
                </div>
            `;
        case 'prop':
            return `
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Category:</label>
                    <select name="category">
                        <option value="general">General</option>
                        <option value="weapon">Weapon</option>
                        <option value="clothing">Clothing</option>
                        <option value="artifact">Artifact</option>
                        <option value="document">Document</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Components:</label>
                    <input type="text" name="components" placeholder="comma separated">
                </div>
            `;
        default:
            return '';
    }
}

async function saveQuickAddItem(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    let newItem;
    let errors = [];
    
    switch(currentQuickAddType) {
        case 'actor':
            newItem = {
                id: getNextId(DATA.ACTORS),
                name: formData.get('name'),
                PinyinInitial: formData.get('pinyin'),
                image: '',
                characters: []
            };
            errors = validateActorData(newItem);
            if (errors.length === 0) {
                DATA.ACTORS.push(newItem);
            }
            break;
            
        case 'set':
            let toneSections = {};
            try {
                const tonesInput = formData.get('tones').trim();
                if (tonesInput) {
                    toneSections = JSON.parse(tonesInput);
                }
            } catch (e) {
                errors.push('Invalid JSON format for Tone Sections');
                break;
            }
            
            newItem = {
                id: getNextId(DATA.SETS),
                name: formData.get('name'),
                tone_sections: toneSections,
                image: '',
                characters: []
            };
            errors = validateSetData(newItem);
            if (errors.length === 0) {
                DATA.SETS.push(newItem);
            }
            break;
            
        case 'prop':
            newItem = {
                id: getNextId(DATA.PROPS),
                name: formData.get('name'),
                category: formData.get('category'),
                components: formData.get('components').split(',').map(c => c.trim()).filter(c => c !== ''),
                image: '',
                used_by: []
            };
            errors = validatePropData(newItem);
            if (errors.length === 0) {
                DATA.PROPS.push(newItem);
            }
            break;
    }
    
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }
    
    await saveState();
    refreshLists();
    refreshCharacterForm();
    closeQuickAddModal();
    showAlert(`${currentQuickAddType.charAt(0).toUpperCase() + currentQuickAddType.slice(1)} added successfully`);
    
    const actualId = newItem.id;
    document.getElementById(`char${currentQuickAddType.charAt(0).toUpperCase() + currentQuickAddType.slice(1)}`).value = actualId;
    
    if (currentQuickAddType === 'set') {
        updateToneSections();
    }
}

// Advanced Search Functions
function toggleAdvancedSearch() {
    const advancedSearch = document.getElementById('characterAdvancedSearch');
    advancedSearch.style.display = advancedSearch.style.display === 'none' ? 'block' : 'none';
}

function refreshAdvancedSearchOptions() {
    const actorSelect = document.getElementById('searchActor');
    const setSelect = document.getElementById('searchSet');
    const propSelect = document.getElementById('searchProp');
    
    actorSelect.innerHTML = '<option value="">Any Actor</option>';
    setSelect.innerHTML = '<option value="">Any Set</option>';
    propSelect.innerHTML = '<option value="">Any Prop</option>';
    
    DATA.ACTORS.forEach(actor => {
        const option = document.createElement('option');
        option.value = actor.id;
        option.textContent = actor.name;
        actorSelect.appendChild(option);
    });
    
    DATA.SETS.forEach(set => {
        const option = document.createElement('option');
        option.value = set.id;
        option.textContent = set.name;
        setSelect.appendChild(option);
    });
    
    DATA.PROPS.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop.id;
        option.textContent = prop.name;
        propSelect.appendChild(option);
    });
}

function performAdvancedSearch() {
    const hanzi = document.getElementById('searchHanzi').value.toLowerCase();
    const pinyin = document.getElementById('searchPinyin').value.toLowerCase();
    const meaning = document.getElementById('searchMeaning').value.toLowerCase();
    const actor = document.getElementById('searchActor').value;
    const set = document.getElementById('searchSet').value;
    const prop = document.getElementById('searchProp').value;
    
    const filteredCharacters = DATA.CHARACTERS.filter(character => {
        if (hanzi && !character.hanzi.toLowerCase().includes(hanzi)) return false;
        if (pinyin && !character.pinyin.toLowerCase().includes(pinyin)) return false;
        if (meaning && !character.meaning.toLowerCase().includes(meaning)) return false;
        if (actor && character.actor !== actor) return false;
        if (set && character.set_location !== set) return false;
        if (prop && !character.props.includes(prop)) return false;
        return true;
    });
    
    displayCharacters(filteredCharacters);
}

function clearAdvancedSearch() {
    document.getElementById('searchHanzi').value = '';
    document.getElementById('searchPinyin').value = '';
    document.getElementById('searchMeaning').value = '';
    document.getElementById('searchActor').value = '';
    document.getElementById('searchSet').value = '';
    document.getElementById('searchProp').value = '';
    displayCharacters();
}

// Keyboard Navigation Setup
function setupKeyboardNavigation() {
    const searchBoxes = ['actorSearch', 'setSearch', 'propSearch', 'characterSearch'];
    searchBoxes.forEach(id => {
        const searchBox = document.getElementById(id);
        if (searchBox) {
            searchBox.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    searchBox.value = '';
                    if (id === 'actorSearch') searchActors();
                    else if (id === 'setSearch') searchSets();
                    else if (id === 'propSearch') searchProps();
                    else if (id === 'characterSearch') searchCharacters();
                }
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickAddModal();
        }
        
        // Ctrl+S to save/backup
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            manualBackup();
        }
    });
}

// Actor Functions
async function saveActor(event) {
    event.preventDefault();
    const actorId = document.getElementById('actorId').value;
    const actorName = document.getElementById('actorName').value;
    
    const actorData = {
        name: actorName,
        PinyinInitial: document.getElementById('actorPinyin').value,
        image: document.getElementById('actorImage').dataset.imageUrl || '',
        characters: []
    };
    
    const errors = validateActorData(actorData, actorId);
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }
    
    if (actorId) {
        const index = DATA.ACTORS.findIndex(a => a.id === actorId);
        if (index !== -1) {
            actorData.id = actorId;
            actorData.characters = DATA.ACTORS[index].characters;
            DATA.ACTORS[index] = actorData;
            showAlert('Actor updated successfully');
        }
    } else {
        const newActor = {
            id: getNextId(DATA.ACTORS),
            ...actorData
        };
        DATA.ACTORS.push(newActor);
        showAlert('Actor added successfully');
    }
    
    await saveState();
    resetActorForm();
    refreshLists();
}

function editActor(id) {
    const actor = DATA.ACTORS.find(a => a.id === id);
    if (actor) {
        document.getElementById('actorId').value = actor.id;
        document.getElementById('actorName').value = actor.name;
        document.getElementById('actorPinyin').value = actor.PinyinInitial || '';
        if (actor.image) {
            document.getElementById('actorImagePreview').innerHTML = `<img src="${actor.image}" style="max-width: 100%; border-radius: 4px;">`;
            document.getElementById('actorImage').dataset.imageUrl = actor.image;
        }
        document.getElementById('actorFormTitle').textContent = 'Edit Actor';
        document.getElementById('actorSubmitBtn').textContent = 'Update Actor';
        document.getElementById('actorCancelBtn').style.display = 'inline-block';
        document.getElementById('actorName').focus();
    }
}

function cancelActorEdit() {
    resetActorForm();
}

function resetActorForm() {
    document.getElementById('actorForm').reset();
    document.getElementById('actorId').value = '';
    document.getElementById('actorImage').dataset.imageUrl = '';
    document.getElementById('actorImagePreview').innerHTML = '';
    document.getElementById('actorFormTitle').textContent = 'Add New Actor';
    document.getElementById('actorSubmitBtn').textContent = 'Add Actor';
    document.getElementById('actorCancelBtn').style.display = 'none';
    document.getElementById('actorName').focus();
}

async function deleteActor(id) {
    if (confirm('Are you sure you want to delete this actor?')) {
        DATA.ACTORS = DATA.ACTORS.filter(actor => actor.id !== id);
        await saveState();
        showAlert('Actor deleted successfully');
        refreshLists();
    }
}

function searchActors() {
    const searchTerm = document.getElementById('actorSearch').value.toLowerCase();
    const filteredActors = DATA.ACTORS.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm) || 
        (actor.PinyinInitial && actor.PinyinInitial.toLowerCase().includes(searchTerm))
    );
    displayActors(filteredActors);
}

// Set Functions
async function saveSet(event) {
    event.preventDefault();
    const setId = document.getElementById('setId').value;
    const setName = document.getElementById('setName').value;
    
    let toneSections = {};
    try {
        const input = document.getElementById('setTones').value.trim();
        if (input) {
            toneSections = JSON.parse(input);
        }
    } catch (e) {
        showAlert('Invalid JSON format for Tone Sections', 'error');
        return;
    }

    const setData = {
        name: setName,
        tone_sections: toneSections,
        image: document.getElementById('setImage').dataset.imageUrl || '',
        characters: []
    };
    
    const errors = validateSetData(setData, setId);
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }
    
    if (setId) {
        const index = DATA.SETS.findIndex(s => s.id === setId);
        if (index !== -1) {
            setData.id = setId;
            setData.characters = DATA.SETS[index].characters;
            DATA.SETS[index] = setData;
            showAlert('Set updated successfully');
        }
    } else {
        const newSet = {
            id: getNextId(DATA.SETS),
            ...setData
        };
        DATA.SETS.push(newSet);
        showAlert('Set added successfully');
    }
    
    await saveState();
    resetSetForm();
    refreshLists();
}

function editSet(id) {
    const set = DATA.SETS.find(s => s.id === id);
    if (set) {
        document.getElementById('setId').value = set.id;
        document.getElementById('setName').value = set.name;
        document.getElementById('setTones').value = JSON.stringify(set.tone_sections || {}, null, 2);
        if (set.image) {
            document.getElementById('setImagePreview').innerHTML = `<img src="${set.image}" style="max-width: 100%; border-radius: 4px;">`;
            document.getElementById('setImage').dataset.imageUrl = set.image;
        }
        document.getElementById('setFormTitle').textContent = 'Edit Set';
        document.getElementById('setSubmitBtn').textContent = 'Update Set';
        document.getElementById('setCancelBtn').style.display = 'inline-block';
        document.getElementById('setName').focus();
    }
}

function cancelSetEdit() {
    resetSetForm();
}

function resetSetForm() {
    document.getElementById('setForm').reset();
    document.getElementById('setId').value = '';
    document.getElementById('setImage').dataset.imageUrl = '';
    document.getElementById('setImagePreview').innerHTML = '';
    document.getElementById('setFormTitle').textContent = 'Add New Set';
    document.getElementById('setSubmitBtn').textContent = 'Add Set';
    document.getElementById('setCancelBtn').style.display = 'none';
    document.getElementById('setName').focus();
}

async function deleteSet(id) {
    if (confirm('Are you sure you want to delete this set?')) {
        DATA.SETS = DATA.SETS.filter(set => set.id !== id);
        await saveState();
        showAlert('Set deleted successfully');
        refreshLists();
    }
}

function searchSets() {
    const searchTerm = document.getElementById('setSearch').value.toLowerCase();
    const filteredSets = DATA.SETS.filter(set => 
        set.name.toLowerCase().includes(searchTerm)
    );
    displaySets(filteredSets);
}

// Prop Functions
async function saveProp(event) {
    event.preventDefault();
    const propId = document.getElementById('propId').value;
    const propName = document.getElementById('propName').value;
    
    const propData = {
        name: propName,
        category: document.getElementById('propCategory').value,
        components: document.getElementById('propComponents').value
            .split(',')
            .map(c => c.trim())
            .filter(c => c !== ''),
        image: document.getElementById('propImage').dataset.imageUrl || '',
        used_by: []
    };
    
    const errors = validatePropData(propData, propId);
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }
    
    if (propId) {
        const index = DATA.PROPS.findIndex(p => p.id === propId);
        if (index !== -1) {
            propData.id = propId;
            propData.used_by = DATA.PROPS[index].used_by;
            DATA.PROPS[index] = propData;
            showAlert('Prop updated successfully');
        }
    } else {
        const newProp = {
            id: getNextId(DATA.PROPS),
            ...propData
        };
        DATA.PROPS.push(newProp);
        showAlert('Prop added successfully');
    }
    
    await saveState();
    resetPropForm();
    refreshLists();
}

function editProp(id) {
    const prop = DATA.PROPS.find(p => p.id === id);
    if (prop) {
        document.getElementById('propId').value = prop.id;
        document.getElementById('propName').value = prop.name;
        document.getElementById('propCategory').value = prop.category;
        document.getElementById('propComponents').value = prop.components ? prop.components.join(', ') : '';
        if (prop.image) {
            document.getElementById('propImagePreview').innerHTML = `<img src="${prop.image}" style="max-width: 100%; border-radius: 4px;">`;
            document.getElementById('propImage').dataset.imageUrl = prop.image;
        }
        document.getElementById('propFormTitle').textContent = 'Edit Prop';
        document.getElementById('propSubmitBtn').textContent = 'Update Prop';
        document.getElementById('propCancelBtn').style.display = 'inline-block';
        document.getElementById('propName').focus();
    }
}

function cancelPropEdit() {
    resetPropForm();
}

function resetPropForm() {
    document.getElementById('propForm').reset();
    document.getElementById('propId').value = '';
    document.getElementById('propImage').dataset.imageUrl = '';
    document.getElementById('propImagePreview').innerHTML = '';
    document.getElementById('propCategory').value = 'general';
    document.getElementById('propFormTitle').textContent = 'Add New Prop';
    document.getElementById('propSubmitBtn').textContent = 'Add Prop';
    document.getElementById('propCancelBtn').style.display = 'none';
    document.getElementById('propName').focus();
}

async function deleteProp(id) {
    if (confirm('Are you sure you want to delete this prop?')) {
        DATA.PROPS = DATA.PROPS.filter(prop => prop.id !== id);
        await saveState();
        showAlert('Prop deleted successfully');
        refreshLists();
    }
}

function searchProps() {
    const searchTerm = document.getElementById('propSearch').value.toLowerCase();
    const filteredProps = DATA.PROPS.filter(prop => 
        prop.name.toLowerCase().includes(searchTerm) || 
        prop.category.toLowerCase().includes(searchTerm)
    );
    displayProps(filteredProps);
}

// Character Functions
function refreshCharacterForm() {
    const actorSelect = document.getElementById('charActor');
    const setSelect = document.getElementById('charSet');
    const propsSelect = document.getElementById('charProps');
    
    actorSelect.innerHTML = '<option value="">Select Actor</option>';
    setSelect.innerHTML = '<option value="">Select Set</option>';
    propsSelect.innerHTML = '';
    
    DATA.ACTORS.forEach(actor => {
        const option = document.createElement('option');
        option.value = actor.id;
        option.textContent = actor.name;
        actorSelect.appendChild(option);
    });
    
    DATA.SETS.forEach(set => {
        const option = document.createElement('option');
        option.value = set.id;
        option.textContent = set.name;
        setSelect.appendChild(option);
    });
    
    DATA.PROPS.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop.id;
        option.textContent = prop.name;
        propsSelect.appendChild(option);
    });
    
    updateToneSections();
}

function updateToneSections() {
    const setSelect = document.getElementById('charSet');
    const toneSectionSelect = document.getElementById('charToneSection');
    const selectedSetId = setSelect.value;
    
    toneSectionSelect.innerHTML = '';
    
    if (!selectedSetId) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Select a set location first';
        toneSectionSelect.appendChild(option);
        return;
    }
    
    const selectedSet = DATA.SETS.find(set => set.id === selectedSetId);
    
    if (!selectedSet || !selectedSet.tone_sections || Object.keys(selectedSet.tone_sections).length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No tone sections defined for this set';
        toneSectionSelect.appendChild(option);
        return;
    }
    
    Object.entries(selectedSet.tone_sections).forEach(([sectionNumber, sectionName]) => {
        const option = document.createElement('option');
        option.value = sectionNumber;
        option.textContent = `${sectionNumber}: ${sectionName}`;
        toneSectionSelect.appendChild(option);
    });
}

async function saveCharacter(event) {
    event.preventDefault();
    const characterId = document.getElementById('characterId').value;
    const selectedProps = Array.from(document.getElementById('charProps').selectedOptions).map(opt => opt.value);
    
    const characterData = {
        hanzi: document.getElementById('charHanzi').value,
        pinyin: document.getElementById('charPinyin').value,
        meaning: document.getElementById('charMeaning').value,
        actor: document.getElementById('charActor').value,
        set_location: document.getElementById('charSet').value,
        tone_section: document.getElementById('charToneSection').value,
        props: selectedProps,
        plot: document.getElementById('charPlot').value,
        image: document.getElementById('charImage').dataset.imageUrl || '',
        memory_scene: "",
        audio_file: ""
    };
    
    const errors = validateCharacterData(characterData);
    if (errors.length > 0) {
        showAlert(errors.join(', '), 'error');
        return;
    }
    
    if (characterId) {
        const index = DATA.CHARACTERS.findIndex(c => c.id === characterId);
        if (index !== -1) {
            characterData.id = characterId;
            DATA.CHARACTERS[index] = characterData;
            showAlert('Character updated successfully');
        }
    } else {
        const newCharacter = {
            id: getNextId(DATA.CHARACTERS),
            ...characterData
        };
        DATA.CHARACTERS.push(newCharacter);
        showAlert('Character added successfully');
    }
    
    await saveState();
    resetCharacterForm();
    refreshLists();
}

function editCharacter(id) {
    const character = DATA.CHARACTERS.find(c => c.id === id);
    if (character) {
        document.getElementById('characterId').value = character.id;
        document.getElementById('charHanzi').value = character.hanzi;
        document.getElementById('charPinyin').value = character.pinyin;
        document.getElementById('charMeaning').value = character.meaning;
        document.getElementById('charActor').value = character.actor;
        document.getElementById('charSet').value = character.set_location;
        document.getElementById('charPlot').value = character.plot || '';
        if (character.image) {
            document.getElementById('charImagePreview').innerHTML = `<img src="${character.image}" style="max-width: 100%; border-radius: 4px;">`;
            document.getElementById('charImage').dataset.imageUrl = character.image;
        }
        
        updateToneSections();
        
        setTimeout(() => {
            document.getElementById('charToneSection').value = character.tone_section || '';
        }, 100);
        
        const propsSelect = document.getElementById('charProps');
        Array.from(propsSelect.options).forEach(option => {
            option.selected = character.props.includes(option.value);
        });
        
        document.getElementById('characterFormTitle').textContent = 'Edit Character';
        document.getElementById('characterSubmitBtn').textContent = 'Update Character';
        document.getElementById('characterCancelBtn').style.display = 'inline-block';
        document.getElementById('charHanzi').focus();
    }
}

function cancelCharacterEdit() {
    resetCharacterForm();
}

function resetCharacterForm() {
    document.getElementById('characterForm').reset();
    document.getElementById('characterId').value = '';
    document.getElementById('charImage').dataset.imageUrl = '';
    document.getElementById('charImagePreview').innerHTML = '';
    document.getElementById('characterFormTitle').textContent = 'Add New Character';
    document.getElementById('characterSubmitBtn').textContent = 'Add Character';
    document.getElementById('characterCancelBtn').style.display = 'none';
    refreshCharacterForm();
    document.getElementById('charHanzi').focus();
}

async function deleteCharacter(id) {
    if (confirm('Are you sure you want to delete this character?')) {
        DATA.CHARACTERS = DATA.CHARACTERS.filter(char => char.id !== id);
        await saveState();
        showAlert('Character deleted successfully');
        refreshLists();
    }
}

function searchCharacters() {
    const searchTerm = document.getElementById('characterSearch').value.toLowerCase();
    
    const filteredCharacters = DATA.CHARACTERS.filter(character => {
        const actor = DATA.ACTORS.find(a => a.id === character.actor);
        const set = DATA.SETS.find(s => s.id === character.set_location);
        
        return character.hanzi.toLowerCase().includes(searchTerm) ||
               character.pinyin.toLowerCase().includes(searchTerm) ||
               character.meaning.toLowerCase().includes(searchTerm) ||
               (actor && actor.name.toLowerCase().includes(searchTerm)) ||
               (set && set.name.toLowerCase().includes(searchTerm));
    });
    
    displayCharacters(filteredCharacters);
}

// Display Functions
function refreshLists() {
    displayActors();
    displaySets();
    displayProps();
    displayCharacters();
}

function displayActors(actorsToDisplay = null) {
    const actors = actorsToDisplay || DATA.ACTORS;
    const targetContainer = document.getElementById('actorsList');
    
    if (actors.length === 0) {
        targetContainer.innerHTML = '<div class="empty-state">No actors found. Add your first actor above.</div>';
        return;
    }
    
    targetContainer.innerHTML = actors.map(actor => {
        const charCount = getCharacterCountForActor(actor.id);
        return `
            <div class="item-card">
                ${actor.image ? `<img src="${actor.image}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
                <h4>${actor.name} <span class="character-count">${charCount}</span></h4>
                <p>Pinyin: ${actor.PinyinInitial || 'N/A'}</p>
                <p>Characters: ${charCount}</p>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editActor('${actor.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteActor('${actor.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function displaySets(setsToDisplay = null) {
    const sets = setsToDisplay || DATA.SETS;
    const targetContainer = document.getElementById('setsList');
    
    if (sets.length === 0) {
        targetContainer.innerHTML = '<div class="empty-state">No sets found. Add your first set above.</div>';
        return;
    }
    
    targetContainer.innerHTML = sets.map(set => {
        const charCount = getCharacterCountForSet(set.id);
        const toneSections = set.tone_sections || {};
        return `
            <div class="item-card">
                ${set.image ? `<img src="${set.image}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
                <h4>${set.name} <span class="character-count">${charCount}</span></h4>
                <p>Tone Sections: ${Object.keys(toneSections).length}</p>
                <p>Characters: ${charCount}</p>
                <div class="tone-sections">
                    ${Object.entries(toneSections).map(([key, value]) => 
                        `<span class="tone-section-item">${key}: ${value}</span>`
                    ).join('')}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editSet('${set.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteSet('${set.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function displayProps(propsToDisplay = null) {
    const props = propsToDisplay || DATA.PROPS;
    const targetContainer = document.getElementById('propsList');
    
    if (props.length === 0) {
        targetContainer.innerHTML = '<div class="empty-state">No props found. Add your first prop above.</div>';
        return;
    }
    
    targetContainer.innerHTML = props.map(prop => {
        const charCount = getCharacterCountForProp(prop.id);
        return `
            <div class="item-card">
                ${prop.image ? `<img src="${prop.image}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
                <h4>${prop.name} <span class="character-count">${charCount}</span></h4>
                <p>Category: ${prop.category}</p>
                <p>Components: ${prop.components ? prop.components.join(', ') : 'None'}</p>
                <p>Used by: ${charCount} characters</p>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editProp('${prop.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProp('${prop.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function displayCharacters(charactersToDisplay = null) {
    const characters = charactersToDisplay || DATA.CHARACTERS;
    const targetContainer = document.getElementById('charactersList');
    
    if (characters.length === 0) {
        targetContainer.innerHTML = '<div class="empty-state">No characters found. Add your first character above.</div>';
        return;
    }
    
    targetContainer.innerHTML = characters.map(character => {
        const actor = DATA.ACTORS.find(a => a.id === character.actor);
        const set = DATA.SETS.find(s => s.id === character.set_location);
        const characterProps = DATA.PROPS.filter(p => character.props.includes(p.id));
        
        let toneSectionDisplay = character.tone_section;
        if (set && set.tone_sections && set.tone_sections[character.tone_section]) {
            toneSectionDisplay = `${character.tone_section}: ${set.tone_sections[character.tone_section]}`;
        }
        
        return `    
            <div class="item-card">
                ${character.image ? `<img src="${character.image}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
                <h4>${character.hanzi}</h4>
                <p>Pinyin: ${character.pinyin}</p>
                <p>Meaning: ${character.meaning}</p>
                <p>Actor: ${actor ? actor.name : 'N/A'}</p>
                <p>Set: ${set ? set.name : 'N/A'}</p>
                <p>Tone Section: ${toneSectionDisplay || 'N/A'}</p>
                <p>Props: ${characterProps.length > 0 ? characterProps.map(p => p.name).join(', ') : 'None'}</p>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editCharacter('${character.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCharacter('${character.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}