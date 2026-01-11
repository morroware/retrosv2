/**
 * ClipboardBuiltins - Clipboard operations for RetroScript
 * Provides programmatic access to the system clipboard with event emissions
 */

export function registerClipboardBuiltins(interpreter) {
    const EventBus = interpreter.context.EventBus;

    /**
     * Read text from the clipboard
     * @returns {Promise<string|null>} The clipboard text, or null if unavailable/error
     * @example
     *   let text = await clipboardRead()
     *   print "Clipboard: " + text
     */
    interpreter.registerBuiltin('clipboardRead', async () => {
        try {
            if (!navigator.clipboard || !navigator.clipboard.readText) {
                console.warn('[ClipboardBuiltins] Clipboard API not available');
                return null;
            }

            const text = await navigator.clipboard.readText();

            // Emit clipboard:text:read event
            if (EventBus) {
                EventBus.emit('clipboard:text:read', {
                    text: text,
                    source: 'script-engine',
                    timestamp: Date.now()
                });
            }

            return text;
        } catch (error) {
            console.error('[ClipboardBuiltins] Failed to read clipboard:', error);

            // Emit error event if needed
            if (EventBus) {
                EventBus.emit('system:error', {
                    source: 'clipboard',
                    operation: 'read',
                    error: error.message
                });
            }

            return null;
        }
    });

    /**
     * Write text to the clipboard
     * @param {string} text - The text to write to clipboard
     * @returns {Promise<boolean>} True if successful, false otherwise
     * @example
     *   let success = await clipboardWrite("Hello from RetroScript!")
     *   if success {
     *       print "Text copied to clipboard"
     *   }
     */
    interpreter.registerBuiltin('clipboardWrite', async (text) => {
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                console.warn('[ClipboardBuiltins] Clipboard API not available');
                return false;
            }

            const textStr = String(text);

            // Read previous clipboard content (if possible)
            let previousText = null;
            try {
                previousText = await navigator.clipboard.readText();
            } catch (e) {
                // Permission might not be granted for reading, that's okay
            }

            // Write to clipboard
            await navigator.clipboard.writeText(textStr);

            // Emit clipboard:text:write event
            if (EventBus) {
                EventBus.emit('clipboard:text:write', {
                    text: textStr,
                    previousText: previousText,
                    source: 'script-engine'
                });

                // Also emit clipboard:data:change event
                EventBus.emit('clipboard:data:change', {
                    type: 'text',
                    hasData: true,
                    source: 'script-engine'
                });
            }

            return true;
        } catch (error) {
            console.error('[ClipboardBuiltins] Failed to write clipboard:', error);

            // Emit error event
            if (EventBus) {
                EventBus.emit('system:error', {
                    source: 'clipboard',
                    operation: 'write',
                    error: error.message
                });
            }

            return false;
        }
    });

    /**
     * Alias for clipboardWrite for backwards compatibility
     * @param {string} text - The text to copy to clipboard
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    interpreter.registerBuiltin('copyToClipboard', async (text) => {
        // Directly call the clipboardWrite builtin through the interpreter's builtins map
        const clipboardWrite = interpreter.builtins.get('clipboardWrite');
        if (clipboardWrite) {
            return await clipboardWrite(text);
        }
        console.error('[ClipboardBuiltins] clipboardWrite builtin not found');
        return false;
    });

    /**
     * Check if clipboard API is available
     * @returns {boolean} True if clipboard operations are supported
     * @example
     *   if clipboardAvailable() {
     *       await clipboardWrite("test")
     *   }
     */
    interpreter.registerBuiltin('clipboardAvailable', () => {
        return !!(navigator.clipboard &&
                  navigator.clipboard.readText &&
                  navigator.clipboard.writeText);
    });
}
