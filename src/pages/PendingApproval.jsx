export default function PendingApproval() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ color: 'var(--primary)' }}>Application Received</h2>
        <p style={{ marginTop: '1.5rem', fontSize: '1.25rem', color: 'var(--secondary)', fontWeight: 500, lineHeight: 1.6 }}>
          Welcome to Local services the new era of opportunities. We are reviewing your profile and we will shortly contact you. Thank you!
        </p>
      </div>
    </div>
  );
}
