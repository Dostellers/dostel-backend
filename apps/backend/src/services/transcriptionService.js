const logger = require('../config/logger');

/**
 * Speech-to-text for staff voice notes (DOS-502).
 *
 * Deliberately a provider interface with no default wired in. Claude has no audio
 * input, so voice notes need a separate STT service, and the choice is not
 * obvious here: staff at Vattakanal speak Tamil, Hindi and English, often mixed
 * inside a single sentence. Providers vary enormously on code-switched Indian
 * speech, and picking one blind would quietly produce garbage transcripts that
 * then get extracted into confident-looking guest facts.
 *
 * Until a provider is chosen, text notes work end to end and voice notes get an
 * honest reply asking the staff member to type it instead.
 */

const providers = new Map();

class TranscriptionUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TranscriptionUnavailableError';
        this.code = 'TRANSCRIPTION_UNAVAILABLE';
    }
}

/**
 * Register an STT provider.
 *
 * @param {string} name
 * @param {(audio: {buffer: Buffer, mimeType: string, languageHints?: string[]}) => Promise<{text: string, language?: string, confidence?: number}>} transcribe
 */
function registerProvider(name, transcribe) {
    if (typeof transcribe !== 'function') {
        throw new Error('a transcription provider must be a function');
    }
    providers.set(name, transcribe);
    logger.info(`transcription: registered provider "${name}"`);
}

function getProviderName() {
    return process.env.TRANSCRIPTION_PROVIDER || null;
}

function isConfigured() {
    const name = getProviderName();
    return Boolean(name && providers.has(name));
}

/**
 * Transcribe an audio note.
 *
 * Throws TranscriptionUnavailableError when no provider is configured — callers
 * are expected to catch it and tell the staff member, not to fail silently.
 */
async function transcribe({ buffer, mimeType, languageHints = ['ta', 'hi', 'en'] }) {
    const name = getProviderName();

    if (!name) {
        throw new TranscriptionUnavailableError(
            'No TRANSCRIPTION_PROVIDER is configured; voice notes cannot be transcribed.'
        );
    }

    const provider = providers.get(name);
    if (!provider) {
        throw new TranscriptionUnavailableError(
            `TRANSCRIPTION_PROVIDER is set to "${name}" but no such provider is registered.`
        );
    }

    const result = await provider({ buffer, mimeType, languageHints });

    if (!result || typeof result.text !== 'string') {
        throw new Error(`transcription provider "${name}" returned no text`);
    }

    return {
        text: result.text.trim(),
        language: result.language || null,
        confidence: typeof result.confidence === 'number' ? result.confidence : null,
        provider: name
    };
}

// Test seam only — production registers providers at startup.
function _reset() {
    providers.clear();
}

module.exports = {
    registerProvider,
    transcribe,
    isConfigured,
    getProviderName,
    TranscriptionUnavailableError,
    _reset
};
