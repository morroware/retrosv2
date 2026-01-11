/**
 * NotepadBuiltins - Notepad text manipulation functions for RetroScript
 * Provides programmatic text editing and search capabilities
 */

export function registerNotepadBuiltins(interpreter) {
    const CommandBus = interpreter.context.CommandBus;
    const EventBus = interpreter.context.EventBus;

    /**
     * Helper to find active Notepad window
     */
    function findNotepadWindow(windowId) {
        if (windowId) {
            const el = document.getElementById(`window-notepad-${windowId}`);
            return el ? `notepad-${windowId}` : null;
        }
        // Find any open notepad window
        const windows = document.querySelectorAll('[id^="window-notepad-"]');
        if (windows.length > 0) {
            return windows[0].id.replace('window-', '');
        }
        return null;
    }

    /**
     * Get text content from Notepad
     * @param {string} windowId - Optional Notepad window ID
     * @returns {Promise<string|null>} The text content or null if not found
     * @example
     *   let text = await notepadGetText()
     *   print "Content: " + text
     */
    interpreter.registerBuiltin('notepadGetText', async (windowId) => {
        try {
            const targetWindow = findNotepadWindow(windowId);
            if (!targetWindow) {
                console.warn('[NotepadBuiltins] No Notepad window found');
                return null;
            }

            if (CommandBus) {
                const result = await CommandBus.query('query:notepad:getText', {
                    windowId: targetWindow
                });
                return result?.text || null;
            }

            return null;
        } catch (error) {
            console.error('[NotepadBuiltins] notepadGetText error:', error);
            return null;
        }
    });

    /**
     * Set text content in Notepad
     * @param {string} text - The text to set
     * @param {string} windowId - Optional Notepad window ID
     * @returns {boolean} True if successful
     * @example
     *   notepadSetText("Hello from RetroScript!")
     */
    interpreter.registerBuiltin('notepadSetText', async (text, windowId) => {
        try {
            const targetWindow = findNotepadWindow(windowId);
            if (!targetWindow) {
                console.warn('[NotepadBuiltins] No Notepad window found');
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:notepad:setText', {
                    windowId: targetWindow,
                    text: String(text)
                });

                if (EventBus) {
                    EventBus.emit('notepad:content:change', {
                        windowId: targetWindow,
                        length: String(text).length,
                        modified: true
                    });
                }

                return true;
            }

            return false;
        } catch (error) {
            console.error('[NotepadBuiltins] notepadSetText error:', error);
            return false;
        }
    });

    /**
     * Append text to Notepad
     * @param {string} text - The text to append
     * @param {string} windowId - Optional Notepad window ID
     * @returns {boolean} True if successful
     * @example
     *   notepadAppend("\nNew line added")
     */
    interpreter.registerBuiltin('notepadAppend', async (text, windowId) => {
        try {
            const currentText = await interpreter.getBuiltin('notepadGetText')(windowId);
            if (currentText === null) {
                return false;
            }

            const newText = currentText + String(text);
            return await interpreter.getBuiltin('notepadSetText')(newText, windowId);
        } catch (error) {
            console.error('[NotepadBuiltins] notepadAppend error:', error);
            return false;
        }
    });

    /**
     * Create new Notepad window
     * @param {string} initialText - Optional initial text content
     * @returns {Promise<boolean>} True if successful
     * @example
     *   await notepadNew("Initial content")
     */
    interpreter.registerBuiltin('notepadNew', async (initialText) => {
        try {
            if (CommandBus) {
                await CommandBus.dispatch('command:notepad:new', {
                    text: initialText ? String(initialText) : ''
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('[NotepadBuiltins] notepadNew error:', error);
            return false;
        }
    });

    /**
     * Save Notepad content to file
     * @param {string} filename - The filename to save as
     * @param {string} windowId - Optional Notepad window ID
     * @returns {Promise<boolean>} True if successful
     * @example
     *   await notepadSave("myfile.txt")
     */
    interpreter.registerBuiltin('notepadSave', async (filename, windowId) => {
        try {
            const targetWindow = findNotepadWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:notepad:save', {
                    windowId: targetWindow,
                    filename: String(filename)
                });
                return true;
            }

            return false;
        } catch (error) {
            console.error('[NotepadBuiltins] notepadSave error:', error);
            return false;
        }
    });

    /**
     * Get available Notepad windows
     * @returns {array} Array of Notepad window IDs
     * @example
     *   let windows = notepadGetWindows()
     *   for let w in windows {
     *       print "Notepad window: " + w
     *   }
     */
    interpreter.registerBuiltin('notepadGetWindows', () => {
        const windows = document.querySelectorAll('[id^="window-notepad-"]');
        return Array.from(windows).map(w => w.id.replace('window-notepad-', ''));
    });
}
