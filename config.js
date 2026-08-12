// config.js - Reads from environment variables for Vercel deployment
(function() {
    // For Vercel, environment variables are available via import.meta.env
    // For static deployment, we need to handle both cases
    
    var CONFIG = {
        supabase: {
            url: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL 
                ? import.meta.env.VITE_SUPABASE_URL 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL 
                    ? process.env.VITE_SUPABASE_URL 
                    : null),
            anonKey: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY 
                ? import.meta.env.VITE_SUPABASE_ANON_KEY 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY 
                    ? process.env.VITE_SUPABASE_ANON_KEY 
                    : null)
        },
        supabaseAlt: {
            url: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL_ALT 
                ? import.meta.env.VITE_SUPABASE_URL_ALT 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL_ALT 
                    ? process.env.VITE_SUPABASE_URL_ALT 
                    : null),
            anonKey: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY_ALT 
                ? import.meta.env.VITE_SUPABASE_ANON_KEY_ALT 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY_ALT 
                    ? process.env.VITE_SUPABASE_ANON_KEY_ALT 
                    : null)
        },
        storageBucket: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STORAGE_BUCKET 
            ? import.meta.env.VITE_STORAGE_BUCKET 
            : (typeof process !== 'undefined' && process.env && process.env.VITE_STORAGE_BUCKET 
                ? process.env.VITE_STORAGE_BUCKET 
                : 'aurex-assets'),
        app: {
            name: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_NAME 
                ? import.meta.env.VITE_APP_NAME 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_APP_NAME 
                    ? process.env.VITE_APP_NAME 
                    : 'Aurex Designs'),
            url: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_URL 
                ? import.meta.env.VITE_APP_URL 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_APP_URL 
                    ? process.env.VITE_APP_URL 
                    : window.location.origin)
        },
        premium: {
            price: parseInt(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PREMIUM_PRICE 
                ? import.meta.env.VITE_PREMIUM_PRICE 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_PREMIUM_PRICE 
                    ? process.env.VITE_PREMIUM_PRICE 
                    : '13500')) || 13500,
            duration: parseInt(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PREMIUM_DURATION 
                ? import.meta.env.VITE_PREMIUM_DURATION 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_PREMIUM_DURATION 
                    ? process.env.VITE_PREMIUM_DURATION 
                    : '6')) || 6,
            discount: parseInt(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PREMIUM_DISCOUNT 
                ? import.meta.env.VITE_PREMIUM_DISCOUNT 
                : (typeof process !== 'undefined' && process.env && process.env.VITE_PREMIUM_DISCOUNT 
                    ? process.env.VITE_PREMIUM_DISCOUNT 
                    : '45')) || 45
        },
        adminEmails: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_EMAILS 
            ? import.meta.env.VITE_ADMIN_EMAILS 
            : (typeof process !== 'undefined' && process.env && process.env.VITE_ADMIN_EMAILS 
                ? process.env.VITE_ADMIN_EMAILS 
                : '')).split(',').map(function(e) { return e.trim(); }).filter(Boolean)
    };

    // Log config status (don't log sensitive data)
    console.log('✅ Config loaded:', {
        supabaseUrl: CONFIG.supabase.url ? '✅ Set' : '❌ Missing',
        supabaseKey: CONFIG.supabase.anonKey ? '✅ Set' : '❌ Missing',
        appName: CONFIG.app.name,
        adminEmails: CONFIG.adminEmails
    });

    if (typeof window !== 'undefined') {
        window.AUREX_CONFIG = CONFIG;
    }

    // For module exports
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CONFIG;
    }
})();