/**
 * Config & Environment Variables Loader
 * MagicFlex Application
 */

const CONFIG = {
  env: {},
  loaded: false,
  loadPromise: null,

  /**
   * Parse content of .env file into key-value pairs
   * @param {string} text 
   * @returns {Object}
   */
  parseEnv: function (text) {
    const result = {};
    if (!text) return result;

    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex !== -1) {
        const key = trimmed.substring(0, equalsIndex).trim();
        let value = trimmed.substring(equalsIndex + 1).trim();

        // Remove surrounding quotes if present (both " and ')
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.substring(1, value.length - 1);
        }

        result[key] = value;
      }
    }
    return result;
  },

  /**
   * Browser configuration must never load API keys. Gemini requests are handled by /api/gemini.
   * @returns {Promise<Object>}
   */
  load: function () {
    this.loaded = true;
    return Promise.resolve(this.env);
  },

  /**
   * Get specific environment variable
   * @param {string} key 
   * @param {string} defaultValue 
   * @returns {Promise<string|null>}
   */
  get: async function (key, defaultValue = null) {
    if (!this.loaded) {
      await this.load();
    }
    return this.env[key] !== undefined ? this.env[key] : defaultValue;
  }
};

// Expose to window
window.CONFIG = CONFIG;

// Mark browser configuration as ready. Sensitive values remain server-side.
CONFIG.load();
