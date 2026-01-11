/**
 * ScriptError - Base error class for RetroScript errors
 *
 * Provides structured error information including source location,
 * error type, and helpful context for debugging.
 */

/**
 * Base class for all script-related errors
 */
export class ScriptError extends Error {
    /**
     * @param {string} message - Error message
     * @param {Object} options - Error options
     * @param {number} [options.line] - Line number where error occurred
     * @param {number} [options.column] - Column number where error occurred
     * @param {string} [options.source] - Source code snippet
     * @param {string} [options.hint] - Helpful hint for fixing the error
     */
    constructor(message, options = {}) {
        super(message);
        this.name = 'ScriptError';
        this.line = options.line ?? 0;
        this.column = options.column ?? 0;
        this.source = options.source ?? '';
        this.hint = options.hint ?? '';

        // Maintain proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Get formatted error message with location info and source context
     */
    toString() {
        let result = `${this.name}: ${this.message}`;
        if (this.line > 0) {
            result += ` at line ${this.line}`;
            if (this.column > 0) {
                result += `, column ${this.column}`;
            }
        }

        // Show source context if available
        if (this.source && this.line > 0) {
            const lines = this.source.split('\n');
            const errorLine = lines[this.line - 1];
            if (errorLine !== undefined) {
                result += '\n\n';
                // Show line number with padding
                const lineNum = String(this.line).padStart(4, ' ');
                result += `${lineNum} | ${errorLine}\n`;
                // Show pointer to error column
                if (this.column > 0) {
                    const pointer = ' '.repeat(this.column - 1) + '^';
                    result += `     | ${pointer}`;
                }
            }
        }

        if (this.hint) {
            result += `\n\nHint: ${this.hint}`;
        }
        return result;
    }

    /**
     * Get a formatted multi-line error string with context
     * @param {string} fullSource - Full source code for context display
     * @param {number} contextLines - Number of lines before/after to show (default: 2)
     * @returns {string} Formatted error with source context
     */
    toStringWithContext(fullSource, contextLines = 2) {
        let result = `${this.name}: ${this.message}`;

        if (this.line > 0 && fullSource) {
            const lines = fullSource.split('\n');
            const startLine = Math.max(0, this.line - 1 - contextLines);
            const endLine = Math.min(lines.length, this.line + contextLines);

            result += '\n\n';
            for (let i = startLine; i < endLine; i++) {
                const lineNum = String(i + 1).padStart(4, ' ');
                const marker = (i + 1 === this.line) ? '>' : ' ';
                result += `${marker}${lineNum} | ${lines[i]}\n`;

                // Show pointer on error line
                if (i + 1 === this.line && this.column > 0) {
                    const pointer = ' '.repeat(this.column - 1) + '^';
                    result += `      | ${pointer}\n`;
                }
            }
        }

        if (this.hint) {
            result += `\nHint: ${this.hint}`;
        }
        return result;
    }

    /**
     * Convert to plain object for serialization
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            line: this.line,
            column: this.column,
            source: this.source,
            hint: this.hint
        };
    }
}

/**
 * ParseError - Thrown during script parsing/lexing
 */
export class ParseError extends ScriptError {
    /**
     * @param {string} message - Error message
     * @param {Object} options - Error options
     */
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'ParseError';
    }
}

/**
 * RuntimeError - Thrown during script execution
 */
export class RuntimeError extends ScriptError {
    /**
     * @param {string} message - Error message
     * @param {Object} options - Error options
     * @param {string[]} [options.callStack] - Function call stack
     */
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'RuntimeError';
        this.callStack = options.callStack ?? [];
    }

    toString() {
        let result = super.toString();
        if (this.callStack.length > 0) {
            result += '\nCall stack:\n  ' + this.callStack.join('\n  ');
        }
        return result;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            callStack: this.callStack
        };
    }
}

/**
 * TimeoutError - Thrown when script execution exceeds time limit
 */
export class TimeoutError extends RuntimeError {
    /**
     * @param {number} timeout - Timeout value in milliseconds
     * @param {Object} options - Error options
     */
    constructor(timeout, options = {}) {
        super(`Script execution timed out after ${timeout}ms`, options);
        this.name = 'TimeoutError';
        this.timeout = timeout;
    }
}

/**
 * RecursionError - Thrown when max recursion depth is exceeded
 */
export class RecursionError extends RuntimeError {
    /**
     * @param {number} depth - Maximum depth that was exceeded
     * @param {string} functionName - Name of the function that caused overflow
     * @param {Object} options - Error options
     */
    constructor(depth, functionName, options = {}) {
        super(
            `Maximum recursion depth (${depth}) exceeded in function: ${functionName}`,
            {
                ...options,
                hint: 'Check for infinite recursion or reduce nesting depth'
            }
        );
        this.name = 'RecursionError';
        this.maxDepth = depth;
        this.functionName = functionName;
    }
}

/**
 * TypeError - Thrown for type-related errors
 */
export class ScriptTypeError extends RuntimeError {
    /**
     * @param {string} expected - Expected type(s)
     * @param {string} received - Actual type received
     * @param {Object} options - Error options
     */
    constructor(expected, received, options = {}) {
        super(`Expected ${expected}, but received ${received}`, options);
        this.name = 'TypeError';
        this.expected = expected;
        this.received = received;
    }
}

/**
 * ReferenceError - Thrown for undefined variable access
 */
export class ScriptReferenceError extends RuntimeError {
    /**
     * @param {string} name - Name of undefined variable/function
     * @param {Object} options - Error options
     */
    constructor(name, options = {}) {
        super(`'${name}' is not defined`, options);
        this.name = 'ReferenceError';
        this.identifier = name;
    }
}

export default {
    ScriptError,
    ParseError,
    RuntimeError,
    TimeoutError,
    RecursionError,
    ScriptTypeError,
    ScriptReferenceError
};
