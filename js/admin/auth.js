/* ============================================================
   Admin auth — thin wrapper around Supabase Auth.
   Requires window.SB (js/supabase.js) loaded first.
   ============================================================ */
const AdminAuth = {
  get client() { return window.SB && SB.client; },
  configured() { return !!(window.SB && SB.configured); },

  async currentUser() {
    if (!this.configured()) return null;
    try { const { data } = await this.client.auth.getUser(); return data ? data.user : null; }
    catch (e) { return null; }
  },

  async signIn(email, password) {
    if (!this.configured()) throw new Error('Supabase is not configured yet (fill js/supabase-config.js).');
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async signOut() {
    if (this.configured()) { try { await this.client.auth.signOut(); } catch (e) {} }
    location.href = 'index.html';
  },

  onChange(cb) {
    if (this.configured()) this.client.auth.onAuthStateChange((_e, session) => cb(session ? session.user : null));
  }
};
window.AdminAuth = AdminAuth;
