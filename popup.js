/**
 * FC Watch Theme Manager - Popup Script
 * Handles theme CRUD operations and UI interactions
 */

// DOM Elements
const themeList = document.getElementById('themeList');
const themeCount = document.getElementById('themeCount');
const emptyState = document.getElementById('emptyState');
const addThemeBtn = document.getElementById('addThemeBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const themeForm = document.getElementById('themeForm');
const cancelBtn = document.getElementById('cancelBtn');

// Form fields
const themeNameInput = document.getElementById('themeName');
const cardPatternInput = document.getElementById('cardPattern');
const effectTypeSelect = document.getElementById('effectType');
const themeEnabledCheck = document.getElementById('themeEnabled');
const themeIdInput = document.getElementById('themeId');

// Effect icons mapping
const effectIcons = {
    'dream': '🏆',
    'silver': '🥈',
    'bronze': '🥉',
    'fw-icon': '🔥',
    'icon-26': '⭐',
    'halloween': '🎃',
    'futmas': '🎄',
    'vintage': '📽️',
    'standard': '⚡'
};

// Load themes on popup open
document.addEventListener('DOMContentLoaded', loadThemes);

// Event Listeners
addThemeBtn.addEventListener('click', () => openModal());
modalClose.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
themeForm.addEventListener('submit', handleFormSubmit);

/**
 * Load themes from Chrome storage and render
 */
async function loadThemes() {
    try {
        const result = await chrome.storage.sync.get(['customThemes']);
        const themes = result.customThemes || [];
        renderThemes(themes);
    } catch (error) {
        console.error('Error loading themes:', error);
        renderThemes([]);
    }
}

/**
 * Render themes list
 */
function renderThemes(themes) {
    // Update count
    themeCount.textContent = `${themes.length} theme${themes.length !== 1 ? 's' : ''}`;

    // Clear list
    themeList.innerHTML = '';

    if (themes.length === 0) {
        // Show empty state
        themeList.innerHTML = `
      <div class="empty-state" id="emptyState">
        <span class="empty-icon">✨</span>
        <p>No custom themes yet</p>
        <span class="empty-hint">Add a theme to get started</span>
      </div>
    `;
        return;
    }

    // Render each theme
    themes.forEach((theme, index) => {
        const themeItem = createThemeElement(theme, index);
        themeList.appendChild(themeItem);
    });
}

/**
 * Create a theme list item element
 */
function createThemeElement(theme, index) {
    const item = document.createElement('div');
    item.className = `theme-item ${theme.enabled ? '' : 'disabled'}`;
    item.dataset.index = index;

    const icon = effectIcons[theme.effectType] || '⚡';

    item.innerHTML = `
    <div class="theme-icon ${theme.effectType}">${icon}</div>
    <div class="theme-info">
      <div class="theme-name">${escapeHtml(theme.name)}</div>
      <div class="theme-pattern">${escapeHtml(theme.pattern)}</div>
    </div>
    <div class="theme-actions">
      <button class="action-btn edit" title="Edit">✏️</button>
      <button class="action-btn delete" title="Delete">🗑️</button>
    </div>
  `;

    // Event listeners
    item.querySelector('.edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(theme, index);
    });

    item.querySelector('.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTheme(index);
    });

    // Toggle enabled on item click
    item.addEventListener('click', () => toggleTheme(index));

    return item;
}

/**
 * Open modal for add/edit
 */
function openModal(theme = null, index = -1) {
    if (theme) {
        // Edit mode
        modalTitle.textContent = 'Edit Theme';
        themeNameInput.value = theme.name;
        cardPatternInput.value = theme.pattern;
        effectTypeSelect.value = theme.effectType;
        themeEnabledCheck.checked = theme.enabled;
        themeIdInput.value = index;
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Theme';
        themeForm.reset();
        themeEnabledCheck.checked = true;
        themeIdInput.value = '';
    }

    modalOverlay.classList.add('active');
    themeNameInput.focus();
}

/**
 * Close modal
 */
function closeModal() {
    modalOverlay.classList.remove('active');
    themeForm.reset();
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const theme = {
        name: themeNameInput.value.trim(),
        pattern: cardPatternInput.value.trim(),
        effectType: effectTypeSelect.value,
        enabled: themeEnabledCheck.checked
    };

    // Validate
    if (!theme.name || !theme.pattern || !theme.effectType) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const result = await chrome.storage.sync.get(['customThemes']);
        let themes = result.customThemes || [];

        const editIndex = themeIdInput.value;
        if (editIndex !== '') {
            // Update existing
            themes[parseInt(editIndex)] = theme;
        } else {
            // Add new
            themes.push(theme);
        }

        // Save to storage
        await chrome.storage.sync.set({ customThemes: themes });

        // Notify content script
        notifyContentScript(themes);

        // Refresh UI
        renderThemes(themes);
        closeModal();
    } catch (error) {
        console.error('Error saving theme:', error);
        alert('Error saving theme. Please try again.');
    }
}

/**
 * Delete a theme
 */
async function deleteTheme(index) {
    if (!confirm('Are you sure you want to delete this theme?')) {
        return;
    }

    try {
        const result = await chrome.storage.sync.get(['customThemes']);
        let themes = result.customThemes || [];

        themes.splice(index, 1);

        await chrome.storage.sync.set({ customThemes: themes });

        // Notify content script
        notifyContentScript(themes);

        renderThemes(themes);
    } catch (error) {
        console.error('Error deleting theme:', error);
        alert('Error deleting theme. Please try again.');
    }
}

/**
 * Toggle theme enabled state
 */
async function toggleTheme(index) {
    try {
        const result = await chrome.storage.sync.get(['customThemes']);
        let themes = result.customThemes || [];

        themes[index].enabled = !themes[index].enabled;

        await chrome.storage.sync.set({ customThemes: themes });

        // Notify content script
        notifyContentScript(themes);

        renderThemes(themes);
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

/**
 * Notify content script of theme changes
 */
async function notifyContentScript(themes) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && (tab.url.includes('fc-watch.com'))) {
            await chrome.tabs.sendMessage(tab.id, {
                type: 'THEMES_UPDATED',
                themes: themes
            });
        }
    } catch (error) {
        // Content script might not be loaded, that's ok
        console.log('Could not notify content script:', error.message);
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
