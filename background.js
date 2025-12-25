/**
 * FC Watch Theme Manager - Background Service Worker
 * Handles extension lifecycle and message coordination
 */

// Extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🎬 FC Watch Theme Manager installed/updated:', details.reason);

    // Initialize storage with empty themes if first install
    if (details.reason === 'install') {
        chrome.storage.sync.set({ customThemes: [] });
        console.log('✨ Initialized custom themes storage');
    }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_THEMES') {
        // Get themes from storage and send back
        chrome.storage.sync.get(['customThemes'], (result) => {
            sendResponse({ themes: result.customThemes || [] });
        });
        return true; // Keep the message channel open for async response
    }

    if (message.type === 'SAVE_THEMES') {
        // Save themes to storage
        chrome.storage.sync.set({ customThemes: message.themes }, () => {
            sendResponse({ success: true });

            // Broadcast to all fc-watch.com tabs
            chrome.tabs.query({ url: ['*://fc-watch.com/*', '*://www.fc-watch.com/*'] }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'THEMES_UPDATED',
                        themes: message.themes
                    }).catch(() => {
                        // Tab might not have content script loaded
                    });
                });
            });
        });
        return true;
    }
});

// Log when service worker starts
console.log('🎬 FC Watch Theme Manager background service worker started');
