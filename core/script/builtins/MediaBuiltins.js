/**
 * MediaBuiltins - Media player control functions for RetroScript
 * Provides programmatic control over Winamp/media player
 */

export function registerMediaBuiltins(interpreter) {
    const EventBus = interpreter.context.EventBus;
    const CommandBus = interpreter.context.CommandBus;

    /**
     * Helper to find active media player window
     */
    function findMediaWindow(windowId) {
        if (windowId) {
            const el = document.getElementById(`window-${windowId}`);
            return el ? windowId : null;
        }
        // Find Winamp window
        const winamp = document.querySelector('[id^="window-winamp"]');
        if (winamp) {
            return winamp.id.replace('window-', '');
        }
        return null;
    }

    /**
     * Play media
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaPlay()
     */
    interpreter.registerBuiltin('mediaPlay', async (windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                console.warn('[MediaBuiltins] No media player window found');
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:media:play', {
                    windowId: targetWindow
                });
            }

            if (EventBus) {
                EventBus.emit('media:play', {
                    track: 'current',
                    position: 0
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaPlay error:', error);
            return false;
        }
    });

    /**
     * Pause media playback
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaPause()
     */
    interpreter.registerBuiltin('mediaPause', async (windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:media:pause', {
                    windowId: targetWindow
                });
            }

            if (EventBus) {
                EventBus.emit('media:pause', {
                    track: 'current',
                    position: 0
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaPause error:', error);
            return false;
        }
    });

    /**
     * Stop media playback
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaStop()
     */
    interpreter.registerBuiltin('mediaStop', async (windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:media:stop', {
                    windowId: targetWindow
                });
            }

            if (EventBus) {
                EventBus.emit('media:stop', {
                    track: null
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaStop error:', error);
            return false;
        }
    });

    /**
     * Play next track
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaNext()
     */
    interpreter.registerBuiltin('mediaNext', async (windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:media:next', {
                    windowId: targetWindow
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaNext error:', error);
            return false;
        }
    });

    /**
     * Play previous track
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaPrevious()
     */
    interpreter.registerBuiltin('mediaPrevious', async (windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            if (CommandBus) {
                await CommandBus.dispatch('command:media:previous', {
                    windowId: targetWindow
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaPrevious error:', error);
            return false;
        }
    });

    /**
     * Set media player volume
     * @param {number} volume - Volume level (0-100)
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaSetVolume(75)
     */
    interpreter.registerBuiltin('mediaSetVolume', async (volume, windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            const vol = Math.max(0, Math.min(100, Number(volume)));

            if (CommandBus) {
                await CommandBus.dispatch('command:media:setVolume', {
                    windowId: targetWindow,
                    volume: vol
                });
            }

            if (EventBus) {
                EventBus.emit('media:volume:change', {
                    volume: vol,
                    muted: false
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaSetVolume error:', error);
            return false;
        }
    });

    /**
     * Set playback position
     * @param {number} seconds - Position in seconds
     * @param {string} windowId - Optional media player window ID
     * @returns {boolean} True if successful
     * @example
     *   mediaSetPosition(60)  // Seek to 1 minute
     */
    interpreter.registerBuiltin('mediaSetPosition', async (seconds, windowId) => {
        try {
            const targetWindow = findMediaWindow(windowId);
            if (!targetWindow) {
                return false;
            }

            const pos = Math.max(0, Number(seconds));

            if (CommandBus) {
                await CommandBus.dispatch('command:media:setPosition', {
                    windowId: targetWindow,
                    position: pos
                });
            }

            if (EventBus) {
                EventBus.emit('media:position:change', {
                    position: pos,
                    duration: 0
                });
            }

            return true;
        } catch (error) {
            console.error('[MediaBuiltins] mediaSetPosition error:', error);
            return false;
        }
    });
}
