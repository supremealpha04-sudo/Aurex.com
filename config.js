// config.js - Reads directly from environment variables
// NO FALLBACK VALUES - Must be set in Vercel Environment Variables

const CONFIG = {
    // Primary Supabase
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    
    // Alt Supabase (for admin/storage)
    supabaseAlt: {
        url: import.meta.env.VITE_SUPABASE_URL_ALT,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_ALT
    },
    
    // Storage
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    
    // App Config
    app: {
        name: import.meta.env.VITE_APP_NAME,
        url: import.meta.env.VITE_APP_URL
    },
    
    // Premium Config
    premium: {
        price: parseInt(import.meta.env.VITE_PREMIUM_PRICE) || 0,
        duration: parseInt(import.meta.env.VITE_PREMIUM_DURATION) || 0,
        discount: parseInt(import.meta.env.VITE_PREMIUM_DISCOUNT) || 0
    },
    
    // Admin Emails (parsed from comma-separated string)
    adminEmails: (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
};

// Export for browser
if (typeof window !== 'undefined') {
    window.AUREX_CONFIG = CONFIG;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}