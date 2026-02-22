
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// ═══════════════════════════════════════════════════════
// 🔗 SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════
// Project: Otis Frontend
// GitHub Repository: https://github.com/r73723189-alt/sync-supabase-hvoqnn.git
// Supabase URL: https://rfqmzuucqkqjmgbjjxcy.supabase.co
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = 'https://rfqmzuucqkqjmgbjjxcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcW16dXVjcWtxam1nYmpqeGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQ3NjgsImV4cCI6MjA4NDI3MDc2OH0.jwEvEeQ3Qiv_ojLb0GNcskEC9I1BWQ79eWQ_mLqRstI';

// GitHub repository information for reference
export const PROJECT_INFO = {
  name: 'Otis Frontend',
  githubRepo: 'https://github.com/r73723189-alt/sync-supabase-hvoqnn.git',
  supabaseUrl: SUPABASE_URL,
  description: 'React Native + Expo app connected to Supabase backend',
};

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use secure storage for auth tokens
    storage: undefined, // Will use default AsyncStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check connection
export async function testSupabaseConnection() {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔌 Testing Supabase connection...');
    console.log('📊 Project: Otis Frontend');
    console.log('📊 GitHub: https://github.com/r73723189-alt/sync-supabase-hvoqnn.git');
    console.log('📊 Supabase URL:', SUPABASE_URL);
    console.log('═══════════════════════════════════════════════════════');
    
    // Try to query any table to test connection
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    
    if (error) {
      // If table doesn't exist, that's okay - connection works
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.log('✅ Supabase connected successfully!');
        console.log('✅ Database is accessible and ready to use');
        console.log('📊 Connected to:', SUPABASE_URL);
        return { success: true, message: 'Connected to Supabase - Database is ready' };
      }
      console.log('⚠️ Supabase connection error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connected successfully!');
    console.log('✅ Database is accessible and ready to use');
    console.log('📊 Connected to:', SUPABASE_URL);
    return { success: true, message: 'Connected to Supabase', data };
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err);
    return { success: false, error: String(err) };
  }
}

// Helper function to get all tables in the database
export async function listSupabaseTables() {
  try {
    console.log('📋 Fetching list of tables from Supabase...');
    
    // Query the information schema to get table names
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.log('⚠️ Could not fetch tables:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Tables fetched successfully:', data);
    return { success: true, tables: data };
  } catch (err) {
    console.error('❌ Failed to fetch tables:', err);
    return { success: false, error: String(err) };
  }
}

// Export configuration for reference
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  projectInfo: PROJECT_INFO,
};

console.log('═══════════════════════════════════════════════════════');
console.log('🚀 Supabase Client Initialized');
console.log('📊 Project: Otis Frontend');
console.log('📊 GitHub: https://github.com/r73723189-alt/sync-supabase-hvoqnn.git');
console.log('📊 Supabase: https://rfqmzuucqkqjmgbjjxcy.supabase.co');
console.log('═══════════════════════════════════════════════════════');
