import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

export default function CustomerJobsFlow() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [bids, setBids] = useState([])
  const [view, setView] = useState('job_list') // job_list -> bid_list -> bid_details -> payment -> tracking -> success

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('consumer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBids = async (jobId) => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          provider:service_providers(id, name, role, email, trust_score)
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBids(data || [])
    } catch (err) {
      console.error('Error fetching bids:', err)
    }
  }

  const handleJobClick = async (job) => {
    setSelectedJob(job)
    await fetchBids(job.id)
    setView('bid_list')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <span className="material-icons animate-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}>sync</span>
        <p style={{ marginTop: '1rem', color: 'var(--on-surface-variant)' }}>Loading your bookings...</p>
      </div>
    )
  }

  /* ── VIEW 0: JOB LIST ── */
  if (view === 'job_list') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Service Requests</h1>
        
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--outline-variant)' }}>
            <span className="material-icons" style={{ fontSize: '4rem', color: 'var(--outline-variant)', marginBottom: '1.5rem' }}>assignment_late</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>No Requests Yet</h3>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>You haven't posted any service requests yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map(job => (
              <div 
                key={job.id} 
                onClick={() => handleJobClick(job)}
                style={{ 
                  background: '#fff', borderRadius: 'var(--radius-lg)', padding: '1.2rem 1.5rem', 
                  border: '1px solid var(--outline-variant)', cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', background: 'var(--primary-container)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '40px', fontWeight: 800, textTransform: 'uppercase' }}>
                      {job.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--on-surface)' }}>{job.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{job.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>₹{job.budget}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dd6b20', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.2rem' }}>
                    <span className="material-icons" style={{ fontSize: '1rem' }}>gavel</span>
                    View Bids
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── VIEW 1: BIDS RECEIVED ── */
  if (view === 'bid_list') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
        <button className="btn btn--ghost" onClick={() => setView('job_list')} style={{ marginBottom: '1.5rem', padding: '0.5rem' }}>
          <span className="material-icons" style={{ fontSize: '1rem', marginRight: '6px', verticalAlign: 'middle' }}>arrow_back</span> Back to Requests
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>🔥 {bids.length} Bid{bids.length !== 1 ? 's' : ''} Received</h1>
        </div>
        <div style={{ background: 'var(--surface-container-low)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', border: '1px solid var(--outline-variant)' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>For Request</h4>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedJob.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{selectedJob.description}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bids.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--outline)' }}>
              <p style={{ color: 'var(--on-surface-variant)' }}>No bids received yet. Professionals have been notified and will respond shortly.</p>
            </div>
          ) : (
            bids.map(bid => (
              <div key={bid.id} style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '56px', height: '56px', borderRadius: '50%', 
                    background: 'rgba(49,130,206,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: '#3182ce', fontWeight: 700, fontSize: '1.2rem' 
                  }}>
                    {bid.provider?.name?.charAt(0) || 'P'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bid.provider?.name || 'Service Provider'}</h3>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{bid.amount}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(56,161,105,0.1)', color: '#38a169', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 700 }}>
                        Trust: {bid.provider?.trust_score || 'N/A'}/10
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--surface-container)', color: 'var(--on-surface-variant)', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 600 }}>
                        {bid.provider?.role || 'Expert'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{bid.message || 'I would like to help you with this project.'}"
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn btn--outline" style={{ flex: 1, padding: '0.6rem' }}>View Profile</button>
                      <button className="btn btn--primary" style={{ flex: 2, padding: '0.6rem' }} onClick={() => setView('payment')}>Accept Proposal</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (view === 'payment') {
      return (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
          <span className="material-icons" style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '1rem' }}>payments</span>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Secure Payment</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>Proceeding to secure payment for the selected bid. Funds will be held in escrow.</p>
          <button className="btn btn--primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setView('success')}>Confirm Payment</button>
          <button className="btn btn--ghost" style={{ display: 'block', margin: '1rem auto' }} onClick={() => setView('bid_list')}>Cancel</button>
        </div>
      )
  }

  if (view === 'success') {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ background: '#38a169', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'white', boxShadow: '0 20px 40px rgba(56,161,105,0.3)' }}>
          <span className="material-icons" style={{ fontSize: '4rem' }}>check_circle</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>Booking Confirmed!</h1>
        <p style={{ fontSize: '1rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Your payment is held in escrow. The professional will reach out to you shortly to start the work.
        </p>
        <button className="btn btn--primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: 'var(--radius-xl)' }} onClick={() => setView('job_list')}>
          Manage Bookings
        </button>
      </div>
    )
  }

  return null
}
