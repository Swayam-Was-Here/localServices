import { useState } from 'react'
import JobExecutionWallet from './JobExecutionWallet'

const JOBS = [
  {
    id: 1,
    title: 'Modern Office Interior Renovation',
    category: 'Interior Design',
    icon: 'design_services',
    color: '#805ad5',
    budgetMin: 85000,
    budgetMax: 120000,
    location: 'Cyber City, Gurgaon',
    distance: '2.1 km',
    postedAt: '18 min ago',
    urgency: 'Premium',
    description:
      'Looking for a premium interior renovation for a 1,200 sq. ft. boutique tech office. The project requires high-end acoustic paneling, integrated smart lighting, and a custom reception desk with metallic finishes.',
    skills: ['Acoustic Design', 'Smart Lighting', 'Custom Furniture', 'Project Mgmt'],
    winProbability: 74,
    aiRecommendedBid: 98500,
    competitors: [
      { name: 'Alpha Pro', badge: 'Top Rated', status: 'Active Now', bid: 102000 },
      { name: 'Smart Build', badge: 'Rising Star', status: '5 min ago', bid: 95000 },
    ],
    marketAvg: 97000,
    demandTrend: '+12% this week',
  },
  {
    id: 2,
    title: 'Full Apartment Electrical Rewiring',
    category: 'Electrical',
    icon: 'bolt',
    color: '#d69e2e',
    budgetMin: 22000,
    budgetMax: 35000,
    location: 'Sector 56, Gurgaon',
    distance: '3.4 km',
    postedAt: '45 min ago',
    urgency: 'Urgent',
    description:
      '3BHK apartment (1,600 sq. ft.) needs complete rewiring with MCB panel upgrade, concealed conduit work, and installation of smart switches throughout.',
    skills: ['MCB Panel', 'Concealed Wiring', 'Smart Switches', 'Safety Inspection'],
    winProbability: 88,
    aiRecommendedBid: 27500,
    competitors: [
      { name: 'Volt Masters', badge: 'Verified', status: '22 min ago', bid: 30000 },
    ],
    marketAvg: 28000,
    demandTrend: '+28% surge today',
  },
  {
    id: 3,
    title: 'Luxury Villa Deep Cleaning',
    category: 'Cleaning',
    icon: 'cleaning_services',
    color: '#38a169',
    budgetMin: 4500,
    budgetMax: 7000,
    location: 'DLF Phase 5, Gurgaon',
    distance: '5.0 km',
    postedAt: '2h ago',
    urgency: 'Flexible',
    description:
      '5BHK villa requires a deep clean before a corporate event. Includes high-pressure external wash, interior detailing, carpet steam-cleaning, and kitchen sanitisation.',
    skills: ['Steam Cleaning', 'High-Pressure Wash', 'Carpet Care', 'Sanitisation'],
    winProbability: 61,
    aiRecommendedBid: 6200,
    competitors: [
      { name: 'CleanElite', badge: 'Top Rated', status: 'Active Now', bid: 6800 },
      { name: 'ShinePro', badge: 'New', status: '1h ago', bid: 5500 },
      { name: 'NeatNest', badge: 'Verified', status: '90 min ago', bid: 6000 },
    ],
    marketAvg: 6100,
    demandTrend: 'Stable',
  },
]

export default function AiBiddingSystem() {
  const [selectedJob, setSelectedJob] = useState(JOBS[0])
  const [bidAmount, setBidAmount] = useState(JOBS[0].aiRecommendedBid)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(new Set())
  const [filter, setFilter] = useState('All')
  const [activeJob, setActiveJob] = useState(null)

  const handleSelectJob = (job) => {
    setSelectedJob(job)
    setBidAmount(job.aiRecommendedBid)
    setMessage('')
  }

  const handleSubmitBid = () => {
    setSubmitted(prev => new Set([...prev, selectedJob.id]))
  }

  const probColor = (p) => p >= 75 ? '#38a169' : p >= 50 ? '#d69e2e' : '#e53e3e'
  const probLabel = (p) => p >= 75 ? 'High' : p >= 50 ? 'Medium' : 'Low'

  if (activeJob) {
    return <JobExecutionWallet job={activeJob} onBack={() => setActiveJob(null)} />
  }

  const filters = ['All', 'Urgent', 'Premium', 'Flexible']
  const filteredJobs = filter === 'All' ? JOBS : JOBS.filter(j => j.urgency === filter)

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>

      {/* Job List Panel */}
      <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>
            AI Bidding System
            <span style={{
              marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 700,
              background: 'rgba(56,161,105,0.12)', color: '#38a169',
              padding: '2px 8px', borderRadius: '100px', verticalAlign: 'middle',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>Live Market</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
            AI analyses market rates &amp; competitors in real-time.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem',
                fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                borderColor: filter === f ? 'var(--primary)' : 'var(--outline-variant)',
                background: filter === f ? 'var(--primary)' : 'transparent',
                color: filter === f ? 'white' : 'var(--on-surface-variant)',
                transition: 'all 0.2s',
              }}
            >{f}</button>
          ))}
        </div>

        {/* Job Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => handleSelectJob(job)}
              style={{
                padding: '1rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                border: selectedJob.id === job.id ? '2px solid var(--primary)' : '1.5px solid var(--outline-variant)',
                background: selectedJob.id === job.id ? 'rgba(0,32,69,0.04)' : '#fff',
                boxShadow: selectedJob.id === job.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                  background: `color-mix(in srgb, ${job.color} 14%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-icons" style={{ color: job.color, fontSize: '1.2rem' }}>{job.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.3rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.3 }}>{job.title}</h4>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                      borderRadius: '100px', flexShrink: 0,
                      background: job.urgency === 'Urgent' ? 'rgba(229,62,62,0.1)' : job.urgency === 'Premium' ? 'rgba(128,90,213,0.12)' : 'rgba(56,161,105,0.1)',
                      color: job.urgency === 'Urgent' ? '#e53e3e' : job.urgency === 'Premium' ? '#805ad5' : '#38a169',
                    }}>{job.urgency}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', margin: '0.2rem 0' }}>
                    <span className="material-icons" style={{ fontSize: '0.75rem', verticalAlign: 'middle', marginRight: '2px' }}>location_on</span>
                    {job.location} · {job.distance}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{job.budgetMin.toLocaleString()} – ₹{job.budgetMax.toLocaleString()}
                    </span>
                    {/* Win probability mini-bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: 'var(--outline-variant)', overflow: 'hidden' }}>
                        <div style={{ width: `${job.winProbability}%`, height: '100%', background: probColor(job.winProbability), borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: probColor(job.winProbability), fontWeight: 700 }}>{job.winProbability}%</span>
                    </div>
                  </div>
                </div>
              </div>
              {submitted.has(job.id) && (
                <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: '#38a169', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-icons" style={{ fontSize: '0.9rem' }}>check_circle</span> Bid Submitted
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail + Bid Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', minWidth: 0 }}>

        {/* Job Detail */}
        <section style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', flexShrink: 0,
              background: `color-mix(in srgb, ${selectedJob.color} 14%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-icons" style={{ color: selectedJob.color, fontSize: '1.6rem' }}>{selectedJob.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{selectedJob.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>
                <span className="material-icons" style={{ fontSize: '0.82rem', verticalAlign: 'middle', marginRight: '2px' }}>location_on</span>
                {selectedJob.location} · {selectedJob.distance} · {selectedJob.postedAt}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{selectedJob.budgetMin.toLocaleString()} – ₹{selectedJob.budgetMax.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>Client Budget Range</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.65, marginBottom: '1rem' }}>
            {selectedJob.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {selectedJob.skills.map(s => (
              <span key={s} style={{
                fontSize: '0.72rem', padding: '3px 10px', borderRadius: '100px',
                background: 'var(--surface-container)', color: 'var(--on-surface-variant)',
                border: '1px solid var(--outline-variant)', fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>

          {/* Place Bid */}
          <section style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Place Your Bid</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#38a169' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38a169', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Real-time analysis active
              </div>
            </div>

            {/* Win Probability */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Win Probability</span>
                <span style={{ fontWeight: 700, color: probColor(selectedJob.winProbability) }}>
                  {probLabel(selectedJob.winProbability)} — {selectedJob.winProbability}%
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '8px', background: 'var(--outline-variant)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '8px',
                  width: `${selectedJob.winProbability}%`,
                  background: `linear-gradient(90deg, ${probColor(selectedJob.winProbability)}, ${probColor(selectedJob.winProbability)}aa)`,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            {/* AI Recommended */}
            <div style={{
              background: 'rgba(0,32,69,0.05)', border: '1px dashed var(--primary)',
              borderRadius: 'var(--radius-md)', padding: '0.7rem 1rem', marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>auto_awesome</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>AI Recommended Bid</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{selectedJob.aiRecommendedBid.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setBidAmount(selectedJob.aiRecommendedBid)}
                style={{
                  marginLeft: 'auto', fontSize: '0.7rem', padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)',
                  background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600,
                }}
              >Use AI</button>
            </div>

            {/* Bid Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-variant)', display: 'block', marginBottom: '0.4rem' }}>
                Your Bid Amount (₹)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value))}
                style={{
                  width: '100%', padding: '0.6rem 0.9rem', fontSize: '1rem', fontWeight: 700,
                  border: '2px solid var(--outline-variant)', borderRadius: 'var(--radius-md)',
                  outline: 'none', background: 'var(--surface-container-lowest)', boxSizing: 'border-box',
                  color: 'var(--on-surface)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginTop: '0.3rem' }}>
                Service fee of 2.5% applies upon winning.
                &nbsp;Market avg: <strong>₹{selectedJob.marketAvg.toLocaleString()}</strong>
              </p>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-variant)', display: 'block', marginBottom: '0.4rem' }}>
                Pitch Message (optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hi! I'm an expert in this domain with 8+ years experience..."
                style={{
                  width: '100%', padding: '0.6rem 0.9rem', fontSize: '0.82rem',
                  border: '2px solid var(--outline-variant)', borderRadius: 'var(--radius-md)',
                  outline: 'none', resize: 'vertical', background: 'var(--surface-container-lowest)',
                  fontFamily: 'inherit', color: 'var(--on-surface)', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--outline-variant)'}
              />
            </div>

            <button
              className="btn btn--primary"
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', fontWeight: 700 }}
              onClick={() => {
                handleSubmitBid()
                setActiveJob({ ...selectedJob, address: selectedJob.location })
              }}
              disabled={submitted.has(selectedJob.id)}
            >
              {submitted.has(selectedJob.id) ? (
                <><span className="material-icons" style={{ fontSize: '1rem', marginRight: '6px', verticalAlign: 'middle' }}>check_circle</span>Bid Submitted!</>
              ) : (
                <><span className="material-icons" style={{ fontSize: '1rem', marginRight: '6px', verticalAlign: 'middle' }}>gavel</span>Submit Bid — ₹{bidAmount.toLocaleString()}</>
              )}
            </button>
          </section>

          {/* AI Analysis Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Competitor Activity */}
            <section style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '1.2rem 1.5rem', border: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
                <span className="material-icons" style={{ color: '#e53e3e', fontSize: '1.1rem' }}>trending_up</span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Competitor Activity</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {selectedJob.competitors.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-container)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0,
                    }}>{c.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.name}</span>
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 700, padding: '1px 6px', borderRadius: '100px',
                          background: c.badge === 'Top Rated' ? 'rgba(214,158,46,0.15)' : 'rgba(49,130,206,0.12)',
                          color: c.badge === 'Top Rated' ? '#d69e2e' : '#3182ce',
                        }}>{c.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)' }}>{c.status}</div>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                      ₹{c.bid.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Market Insight */}
            <section style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
              borderRadius: 'var(--radius-xl)', padding: '1.2rem 1.5rem', color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                <span className="material-icons" style={{ color: '#f6ad55', fontSize: '1.1rem' }}>auto_awesome</span>
                <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>AI Market Insight</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Market Average</span>
                  <strong>₹{selectedJob.marketAvg.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Demand Trend</span>
                  <strong style={{ color: '#f6ad55' }}>{selectedJob.demandTrend}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>Competitors</span>
                  <strong>{selectedJob.competitors.length} bidding</strong>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.9rem', lineHeight: 1.5 }}>
                💡 Bidding near the AI recommendation gives you the best win/value balance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
