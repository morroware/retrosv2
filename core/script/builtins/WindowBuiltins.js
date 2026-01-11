/**
 * WindowBuiltins - Window management and positioning functions for RetroScript
 * Provides programmatic control over window positions, sizes, and bounds
 */

export function registerWindowBuiltins(interpreter) {
    const EventBus = interpreter.context.EventBus;
    const StateManager = interpreter.context.StateManager;

    /**
     * Set window position
     * @param {string} windowId - The window ID (e.g., 'window-notepad-1' or just 'notepad-1')
     * @param {number} x - X position in pixels
     * @param {number} y - Y position in pixels
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   setWindowPosition("notepad-1", 100, 100)
     */
    interpreter.registerBuiltin('setWindowPosition', (windowId, x, y) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                console.warn(`[WindowBuiltins] Window not found: ${id}`);
                return false;
            }

            const previousX = parseInt(windowEl.style.left) || 0;
            const previousY = parseInt(windowEl.style.top) || 0;
            const newX = Number(x);
            const newY = Number(y);

            windowEl.style.left = `${newX}px`;
            windowEl.style.top = `${newY}px`;

            // Emit window:move event
            if (EventBus) {
                EventBus.emit('window:move', {
                    id: id,
                    x: newX,
                    y: newY,
                    previousX: previousX,
                    previousY: previousY
                });
            }

            return true;
        } catch (error) {
            console.error('[WindowBuiltins] setWindowPosition error:', error);
            return false;
        }
    });

    /**
     * Set window size
     * @param {string} windowId - The window ID
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   setWindowSize("notepad-1", 800, 600)
     */
    interpreter.registerBuiltin('setWindowSize', (windowId, width, height) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                console.warn(`[WindowBuiltins] Window not found: ${id}`);
                return false;
            }

            const previousWidth = parseInt(windowEl.style.width) || 0;
            const previousHeight = parseInt(windowEl.style.height) || 0;
            const newWidth = Number(width);
            const newHeight = Number(height);

            windowEl.style.width = `${newWidth}px`;
            windowEl.style.height = `${newHeight}px`;

            // Emit window:resize event
            if (EventBus) {
                EventBus.emit('window:resize', {
                    id: id,
                    width: newWidth,
                    height: newHeight
                });
            }

            return true;
        } catch (error) {
            console.error('[WindowBuiltins] setWindowSize error:', error);
            return false;
        }
    });

    /**
     * Set window bounds (position and size together)
     * @param {string} windowId - The window ID
     * @param {number} x - X position in pixels
     * @param {number} y - Y position in pixels
     * @param {number} width - Width in pixels
     * @param {number} height - Height in pixels
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   setWindowBounds("calculator-1", 50, 50, 400, 500)
     */
    interpreter.registerBuiltin('setWindowBounds', (windowId, x, y, width, height) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                console.warn(`[WindowBuiltins] Window not found: ${id}`);
                return false;
            }

            const previousX = parseInt(windowEl.style.left) || 0;
            const previousY = parseInt(windowEl.style.top) || 0;
            const previousWidth = parseInt(windowEl.style.width) || 0;
            const previousHeight = parseInt(windowEl.style.height) || 0;

            const newX = Number(x);
            const newY = Number(y);
            const newWidth = Number(width);
            const newHeight = Number(height);

            windowEl.style.left = `${newX}px`;
            windowEl.style.top = `${newY}px`;
            windowEl.style.width = `${newWidth}px`;
            windowEl.style.height = `${newHeight}px`;

            // Emit window:bounds:change event
            if (EventBus) {
                EventBus.emit('window:bounds:change', {
                    id: id,
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
                    previousX: previousX,
                    previousY: previousY,
                    previousWidth: previousWidth,
                    previousHeight: previousHeight,
                    source: 'script'
                });
            }

            return true;
        } catch (error) {
            console.error('[WindowBuiltins] setWindowBounds error:', error);
            return false;
        }
    });

    /**
     * Get window position
     * @param {string} windowId - The window ID
     * @returns {object|null} Object with {x, y} or null if window not found
     * @example
     *   let pos = getWindowPosition("notepad-1")
     *   print "Window at: " + pos.x + ", " + pos.y
     */
    interpreter.registerBuiltin('getWindowPosition', (windowId) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                return null;
            }

            return {
                x: parseInt(windowEl.style.left) || 0,
                y: parseInt(windowEl.style.top) || 0
            };
        } catch (error) {
            console.error('[WindowBuiltins] getWindowPosition error:', error);
            return null;
        }
    });

    /**
     * Get window size
     * @param {string} windowId - The window ID
     * @returns {object|null} Object with {width, height} or null if window not found
     * @example
     *   let size = getWindowSize("notepad-1")
     *   print "Window size: " + size.width + "x" + size.height
     */
    interpreter.registerBuiltin('getWindowSize', (windowId) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                return null;
            }

            return {
                width: parseInt(windowEl.style.width) || windowEl.offsetWidth,
                height: parseInt(windowEl.style.height) || windowEl.offsetHeight
            };
        } catch (error) {
            console.error('[WindowBuiltins] getWindowSize error:', error);
            return null;
        }
    });

    /**
     * Get window bounds (position and size together)
     * @param {string} windowId - The window ID
     * @returns {object|null} Object with {x, y, width, height} or null if window not found
     * @example
     *   let bounds = getWindowBounds("notepad-1")
     *   print "Bounds: " + bounds.x + ", " + bounds.y + ", " + bounds.width + "x" + bounds.height
     */
    interpreter.registerBuiltin('getWindowBounds', (windowId) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                return null;
            }

            return {
                x: parseInt(windowEl.style.left) || 0,
                y: parseInt(windowEl.style.top) || 0,
                width: parseInt(windowEl.style.width) || windowEl.offsetWidth,
                height: parseInt(windowEl.style.height) || windowEl.offsetHeight
            };
        } catch (error) {
            console.error('[WindowBuiltins] getWindowBounds error:', error);
            return null;
        }
    });

    /**
     * Center a window on screen
     * @param {string} windowId - The window ID
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   centerWindow("calculator-1")
     */
    interpreter.registerBuiltin('centerWindow', (windowId) => {
        try {
            const id = String(windowId).replace('window-', '');
            const windowEl = document.getElementById(`window-${id}`);

            if (!windowEl) {
                console.warn(`[WindowBuiltins] Window not found: ${id}`);
                return false;
            }

            const width = parseInt(windowEl.style.width) || windowEl.offsetWidth;
            const height = parseInt(windowEl.style.height) || windowEl.offsetHeight;

            const x = Math.floor((window.innerWidth - width) / 2);
            const y = Math.floor((window.innerHeight - height) / 2);

            return interpreter.getBuiltin('setWindowPosition')(id, x, y);
        } catch (error) {
            console.error('[WindowBuiltins] centerWindow error:', error);
            return false;
        }
    });

    /**
     * Tile windows in a grid layout
     * @param {number} columns - Number of columns (default: 2)
     * @param {number} padding - Padding between windows in pixels (default: 10)
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   tileWindows(2, 10)  // Tile all windows in 2 columns with 10px padding
     */
    interpreter.registerBuiltin('tileWindows', (columns = 2, padding = 10) => {
        try {
            const windows = document.querySelectorAll('.window:not(.minimized)');
            if (windows.length === 0) {
                return false;
            }

            const cols = Number(columns);
            const pad = Number(padding);
            const rows = Math.ceil(windows.length / cols);

            const availableWidth = window.innerWidth - (pad * (cols + 1));
            const availableHeight = window.innerHeight - (pad * (rows + 1)) - 40; // Account for taskbar

            const windowWidth = Math.floor(availableWidth / cols);
            const windowHeight = Math.floor(availableHeight / rows);

            windows.forEach((windowEl, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);

                const x = pad + (col * (windowWidth + pad));
                const y = pad + (row * (windowHeight + pad));

                windowEl.style.left = `${x}px`;
                windowEl.style.top = `${y}px`;
                windowEl.style.width = `${windowWidth}px`;
                windowEl.style.height = `${windowHeight}px`;

                const id = windowEl.id.replace('window-', '');
                if (EventBus) {
                    EventBus.emit('window:bounds:change', {
                        id: id,
                        x: x,
                        y: y,
                        width: windowWidth,
                        height: windowHeight,
                        source: 'script-tile'
                    });
                }
            });

            return true;
        } catch (error) {
            console.error('[WindowBuiltins] tileWindows error:', error);
            return false;
        }
    });

    /**
     * Cascade windows (arrange in overlapping pattern)
     * @param {number} offset - Offset between windows in pixels (default: 30)
     * @returns {boolean} True if successful, false otherwise
     * @example
     *   cascadeWindows(30)
     */
    interpreter.registerBuiltin('cascadeWindows', (offset = 30) => {
        try {
            const windows = document.querySelectorAll('.window:not(.minimized)');
            if (windows.length === 0) {
                return false;
            }

            const off = Number(offset);
            let currentX = 50;
            let currentY = 50;

            windows.forEach((windowEl) => {
                windowEl.style.left = `${currentX}px`;
                windowEl.style.top = `${currentY}px`;

                const id = windowEl.id.replace('window-', '');
                if (EventBus) {
                    EventBus.emit('window:move', {
                        id: id,
                        x: currentX,
                        y: currentY
                    });
                }

                currentX += off;
                currentY += off;

                // Wrap if we go off screen
                if (currentX > window.innerWidth - 200 || currentY > window.innerHeight - 200) {
                    currentX = 50;
                    currentY = 50;
                }
            });

            return true;
        } catch (error) {
            console.error('[WindowBuiltins] cascadeWindows error:', error);
            return false;
        }
    });
}
