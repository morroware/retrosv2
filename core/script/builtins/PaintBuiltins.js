/**
 * PaintBuiltins - Paint app drawing functions for RetroScript
 * Provides programmatic drawing and image manipulation capabilities
 */

export function registerPaintBuiltins(interpreter) {
    const EventBus = interpreter.context.EventBus;
    const CommandBus = interpreter.context.CommandBus;

    /**
     * Helper to find active Paint window
     */
    function findPaintWindow(windowId) {
        if (windowId) {
            const el = document.getElementById(`window-paint-${windowId}`);
            return el ? `paint-${windowId}` : null;
        }
        // Find any open paint window
        const windows = document.querySelectorAll('[id^="window-paint-"]');
        if (windows.length > 0) {
            return windows[0].id.replace('window-', '');
        }
        return null;
    }

    /**
     * Draw a line on Paint canvas
     * @param {number} x1 - Start X coordinate
     * @param {number} y1 - Start Y coordinate
     * @param {number} x2 - End X coordinate
     * @param {number} y2 - End Y coordinate
     * @param {string} color - Optional color (hex format)
     * @param {number} width - Optional line width
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintDrawLine(10, 10, 100, 100, "#FF0000", 5)
     */
    interpreter.registerBuiltin('paintDrawLine', async (x1, y1, x2, y2, color, width, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            // Set color if provided
            if (color) {
                if (CommandBus) {
                    CommandBus.dispatch('command:paint:setColor', {
                        windowId: targetWindow,
                        color: String(color)
                    });
                }
            }

            // Set brush size if provided
            if (width) {
                if (CommandBus) {
                    CommandBus.dispatch('command:paint:setBrushSize', {
                        windowId: targetWindow,
                        size: Number(width)
                    });
                }
            }

            // Draw the line
            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:drawLine', {
                    windowId: targetWindow,
                    x1: Number(x1),
                    y1: Number(y1),
                    x2: Number(x2),
                    y2: Number(y2)
                });

                // Emit event
                if (EventBus) {
                    EventBus.emit('paint:draw:line', {
                        x1: Number(x1),
                        y1: Number(y1),
                        x2: Number(x2),
                        y2: Number(y2),
                        color: color || null,
                        width: width || null
                    });
                }

                return result?.success || true;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintDrawLine error:', error);
            return false;
        }
    });

    /**
     * Draw a filled rectangle on Paint canvas
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {string} color - Optional color (hex format)
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintDrawRect(50, 50, 100, 80, "#0000FF")
     */
    interpreter.registerBuiltin('paintDrawRect', async (x, y, width, height, color, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            // Set color if provided
            if (color) {
                if (CommandBus) {
                    CommandBus.dispatch('command:paint:setColor', {
                        windowId: targetWindow,
                        color: String(color)
                    });
                }
            }

            // Draw the rectangle
            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:fillRect', {
                    windowId: targetWindow,
                    x: Number(x),
                    y: Number(y),
                    width: Number(width),
                    height: Number(height)
                });

                // Emit event
                if (EventBus) {
                    EventBus.emit('paint:draw:rect', {
                        x: Number(x),
                        y: Number(y),
                        width: Number(width),
                        height: Number(height),
                        color: color || null,
                        filled: true
                    });
                }

                return result?.success || true;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintDrawRect error:', error);
            return false;
        }
    });

    /**
     * Set the Paint drawing tool
     * @param {string} tool - Tool name ('brush', 'eraser', 'bucket')
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintSetTool("brush")
     */
    interpreter.registerBuiltin('paintSetTool', async (tool, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:setTool', {
                    windowId: targetWindow,
                    tool: String(tool)
                });

                return result?.success || false;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintSetTool error:', error);
            return false;
        }
    });

    /**
     * Set the Paint drawing color
     * @param {string} color - Color in hex format (#RRGGBB)
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintSetColor("#FF0000")  // Red
     */
    interpreter.registerBuiltin('paintSetColor', async (color, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:setColor', {
                    windowId: targetWindow,
                    color: String(color)
                });

                return result?.success || false;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintSetColor error:', error);
            return false;
        }
    });

    /**
     * Set the Paint brush size
     * @param {number} size - Brush size (1-50)
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintSetBrushSize(10)
     */
    interpreter.registerBuiltin('paintSetBrushSize', async (size, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:setBrushSize', {
                    windowId: targetWindow,
                    size: Number(size)
                });

                return result?.success || false;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintSetBrushSize error:', error);
            return false;
        }
    });

    /**
     * Clear the Paint canvas
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintClear()
     */
    interpreter.registerBuiltin('paintClear', async (windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            if (CommandBus) {
                const result = await CommandBus.dispatch('command:paint:clear', {
                    windowId: targetWindow
                });

                // Emit event
                if (EventBus) {
                    EventBus.emit('paint:canvas:clear', {});
                }

                return result?.success || true;
            }

            return false;
        } catch (error) {
            console.error('[PaintBuiltins] paintClear error:', error);
            return false;
        }
    });

    /**
     * Draw a simple circle by drawing lines in a circular pattern
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Circle radius
     * @param {string} color - Optional color (hex format)
     * @param {string} windowId - Optional Paint window ID
     * @returns {boolean} True if successful
     * @example
     *   paintDrawCircle(100, 100, 50, "#00FF00")
     */
    interpreter.registerBuiltin('paintDrawCircle', async (centerX, centerY, radius, color, windowId) => {
        try {
            const targetWindow = findPaintWindow(windowId);
            if (!targetWindow) {
                console.warn('[PaintBuiltins] No Paint window found');
                return false;
            }

            const cx = Number(centerX);
            const cy = Number(centerY);
            const r = Number(radius);

            // Draw circle using line segments
            const segments = Math.max(24, Math.floor(r / 2));
            const angleStep = (2 * Math.PI) / segments;

            for (let i = 0; i <= segments; i++) {
                const angle1 = i * angleStep;
                const angle2 = (i + 1) * angleStep;

                const x1 = cx + r * Math.cos(angle1);
                const y1 = cy + r * Math.sin(angle1);
                const x2 = cx + r * Math.cos(angle2);
                const y2 = cy + r * Math.sin(angle2);

                await interpreter.getBuiltin('paintDrawLine')(x1, y1, x2, y2, color, null, windowId);
            }

            // Emit event
            if (EventBus) {
                EventBus.emit('paint:draw:circle', {
                    x: cx,
                    y: cy,
                    radius: r,
                    color: color || null,
                    filled: false
                });
            }

            return true;
        } catch (error) {
            console.error('[PaintBuiltins] paintDrawCircle error:', error);
            return false;
        }
    });

    /**
     * Get available Paint windows
     * @returns {array} Array of Paint window IDs
     * @example
     *   let windows = paintGetWindows()
     *   for let w in windows {
     *       print "Paint window: " + w
     *   }
     */
    interpreter.registerBuiltin('paintGetWindows', () => {
        const windows = document.querySelectorAll('[id^="window-paint-"]');
        return Array.from(windows).map(w => w.id.replace('window-paint-', ''));
    });
}
