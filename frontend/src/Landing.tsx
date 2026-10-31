import {useState} from 'react';
import {
  ArrowRight, AudioLines, Check, ChevronRight, CircleCheck, Database,
  ExternalLink, FileCheck2, FileSearch, FileText, Fingerprint, GitBranch,
  Hash, Image as ImageIcon, Languages, Link2, LockKeyhole, Menu, Network,
  Play, ScanSearch, ShieldCheck, Upload, Video, X
} from 'lucide-react';
import heroReference from './assets/forensics-hero-reference.png';
import './landing.css';

type LandingProps={onAnalyse:()=>void;onReport:()=>void};

const environment=[
  {
    number:'01',title:'Financial frauds',tag:'DIGITAL ARREST / UPI',
    description:'Fraudsters combine impersonation, coerced video calls and falsified payment context. Investigators need the original media, transaction narrative and device trail together.',
    headline:'77-year-old Bengaluru woman held in “digital arrest”, loses Rs 1.2 crore in cyber fraud',
    source:'The Indian Express',date:'22 Jul 2024',url:'https://indianexpress.com/article/cities/bangalore/bengaluru-digital-arrest-cyber-fraud-9468837/'
  },
  {
    number:'02',title:'Digital impersonation',tag:'VOICE CLONING',
    description:'A few seconds of public audio can be repurposed into a convincing demand or threat. Voice similarity alone is never identity proof.',
    headline:'Voice cloning scam: How cybercriminals are using kids’ voices to dupe parents',
    source:'The Indian Express',date:'12 Feb 2024',url:'https://indianexpress.com/article/cities/delhi/voice-cloning-scam-how-cybercriminals-are-using-kids-voices-to-dupe-parents-9156488/'
  },
  {
    number:'03',title:'Deepfakes',tag:'SYNTHETIC MEDIA',
    description:'Altered faces and generated speech can travel faster than corrections, especially around public figures and high-attention events.',
    headline:'Actor Ranveer Singh files police complaint over his deepfake video',
    source:'The Indian Express',date:'22 Apr 2024',url:'https://indianexpress.com/article/cities/mumbai/actor-ranveer-singh-files-police-complaint-over-his-deepfake-video-9285140/'
  },
  {
    number:'04',title:'Ransomware',tag:'HOSPITAL SYSTEMS',
    description:'When care systems are encrypted, server images, logs, messages and timelines must be preserved without contaminating the record.',
    headline:'Probing server attack, CERT-In finds holes in AIIMS cyber security',
    source:'The Indian Express',date:'4 Dec 2022',url:'https://indianexpress.com/article/cities/delhi/probing-server-attack-cert-in-finds-holes-in-aiims-cyber-security-8304657/'
  },
  {
    number:'05',title:'Social media crimes',tag:'PLATFORM EVIDENCE',
    description:'Posts, clips and forwarded media require context: account identifiers, capture time, source URLs, download method and an auditable preservation record.',
    headline:'Crime cases saw 6% dip but cyber offences rose by 18% in 2024: NCRB data',
    source:'The Indian Express',date:'7 May 2026',url:'https://indianexpress.com/article/india/crime-cases-saw-dip-but-cyber-offences-rose-in-2024-ncrb-data-10676671/'
  },
  {
    number:'06',title:'Online radicalisation',tag:'CROSS-PLATFORM NETWORKS',
    description:'Public posts, private channels and device artefacts can form a distributed evidentiary chain. Relationships must be labelled by their actual basis.',
    headline:'NIA raids 20 places in 9 states, Delhi in online radicalisation case, seizes devices',
    source:'The Indian Express',date:'8 Jul 2026',url:'https://indianexpress.com/article/india/nia-isis-aqis-online-radicalisation-case-raids-9-states-10777505/lite/'
  }
];

const principles=[
  ['Integrity','Establish whether the preserved bytes remain unchanged from intake to export.'],
  ['Authenticity','Separate what can be technically observed from what can be claimed about origin.'],
  ['Attribution','Connect sources only when a credential, exact match or documented comparison supports it.'],
  ['Explainability','Expose method, scope, uncertainty, artefacts and limitations beside every finding.']
];

const capabilities=[
  {n:'01',icon:ScanSearch,title:'Deepfake detection',text:'Image, video and audio checks with modality-specific scope, quality gates and explicit inconclusive states.'},
  {n:'02',icon:FileSearch,title:'Tamper detection',text:'Documented manipulation checks linked to locations, controls and retained supporting artefacts.'},
  {n:'03',icon:Fingerprint,title:'Authenticity & integrity',text:'SHA-256 preservation records, metadata review and claim-specific authenticity checks.'},
  {n:'04',icon:GitBranch,title:'Provenance & source attribution',text:'Credential validation and bounded reference matching with typed, evidence-based relationships.'},
  {n:'05',icon:FileText,title:'Explainable court-ready reports',text:'Deterministic reports built from saved findings, reviewer notes, methods and limitations.'}
];

const pipeline=[
  {icon:Upload,title:'Upload',code:'evidence_id: EVID-003'},
  {icon:Hash,title:'Hash & metadata',code:'sha256: 68e7…92ac'},
  {icon:ScanSearch,title:'AI analysis',code:'status: completed'},
  {icon:Network,title:'Provenance',code:'basis: exact_match'},
  {icon:FileCheck2,title:'Explainable report',code:'revision: 03'}
];

function Mark(){return <span className="landing-mark" aria-hidden="true"><svg viewBox="0 0 38 38" fill="none"><path d="M19 2.5 35.5 19 19 35.5 2.5 19 19 2.5Z" stroke="currentColor" strokeWidth="1.8"/><path d="M9.5 19s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="19" cy="19" r="3.2" fill="currentColor"/></svg></span>}

function InfrastructureIllustration(){return <svg className="infrastructure-art" viewBox="0 0 700 470" role="img" aria-label="Abstract Indian digital infrastructure with a mobile device, city skyline and data racks">
  <g fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M42 383h618M78 382V248h74v134M173 382V205h55v177M250 382V271h78v111M350 382V225h42v157M414 382V184h78v198M514 382V246h45v136M580 382V219h54v163" opacity=".34"/>
    <path d="M65 248h100m-77-35h47m51-38v30m15-30v30m211-51h82m-65-33v33m17-33v33M574 190h68" opacity=".28"/>
    <rect x="244" y="48" width="194" height="302" rx="24" fill="#fff"/>
    <rect x="263" y="82" width="156" height="225" rx="7" fill="#F5F7F9"/>
    <path d="M315 67h51M282 115h119M282 142h119M282 169h80" opacity=".5"/>
    <circle cx="341" cy="237" r="43"/>
    <path d="m319 237 15 15 31-34" stroke="#C8923A" strokeWidth="3"/>
    <path d="M284 291h115" opacity=".5"/>
    <circle cx="341" cy="329" r="6"/>
    <rect x="84" y="94" width="112" height="127" fill="#F5F7F9"/>
    <path d="M102 117h76M102 140h76M102 163h76M102 186h76" opacity=".52"/>
    <circle cx="112" cy="117" r="3" fill="#C8923A" stroke="none"/><circle cx="112" cy="140" r="3" fill="#C8923A" stroke="none"/>
    <rect x="500" y="71" width="116" height="142" fill="#F5F7F9"/>
    <path d="M518 97h80M518 122h80M518 147h80M518 172h80" opacity=".52"/>
    <path d="M196 157h48m194 0h62M140 221v40m418-48v33" strokeDasharray="4 5" opacity=".5"/>
    <path d="M140 407c110-23 312-23 420 0" opacity=".3"/>
  </g>
</svg>}

function DashboardPreview(){return <div className="preview-shell" aria-label="Illustrative Pratyaksh analysis dashboard">
  <div className="preview-top"><div><span className="preview-kicker">CASE / CYB-2026-0142</span><strong>Suspected executive impersonation</strong></div><div className="preview-badges"><span>OPEN</span><span>REVIEW REQUIRED</span></div></div>
  <div className="preview-grid">
    <aside className="preview-tree"><p>EVIDENCE</p>{['EVID-001 · interview.mp4','EVID-002 · call.wav','REF-001 · verified clip'].map((x,i)=><div className={i===0?'selected':''} key={x}><span>{i===1?<AudioLines size={14}/>:i===2?<Link2 size={14}/>:<Video size={14}/>}</span>{x}</div>)}</aside>
    <section className="preview-viewer">
      <div className="preview-tabs"><span className="active">Video</span><span>Image</span><span>Audio</span><small>00:08.240 / 00:32.000</small></div>
      <div className="preview-media"><div className="preview-person"><i/><i/><i/></div><div className="heatmap-box"><span>REGION 04</span></div><button aria-label="Play sample preview"><Play size={17} fill="currentColor"/></button></div>
      <div className="preview-timeline"><span/><span/><span className="marked"/><span className="marked"/><span/><span/><span/><span/></div>
      <div className="custody"><p>CHAIN OF CUSTODY</p><div><span><CircleCheck size={13}/>09:42 Intake</span><i/><span><CircleCheck size={13}/>09:43 SHA-256</span><i/><span><CircleCheck size={13}/>10:21 Analysis</span></div></div>
    </section>
    <aside className="preview-findings"><p>ANALYSIS SUMMARY</p><div className="confidence"><span>MODEL SCORE</span><strong>87<small>%</small></strong><div><i/></div><em>Not calibrated as probability</em></div><div className="preview-finding"><span>SYNTHETIC MEDIA</span><strong>Indicators detected</strong><p>Face-region signal observed in sampled frames.</p></div><div className="mini-graph"><span>REF-001</span><i/><span>EVID-001</span><small>similarity candidate</small></div></aside>
  </div>
</div>}

export default function Landing({onAnalyse,onReport}:LandingProps){
  const [hindi,setHindi]=useState(false);
  const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return <div className="landing-page">
    <main id="top">
      <section className="reference-hero" aria-label="Pratyaksh multimedia forensics">
        <img src={heroReference} alt="Pratyaksh digital forensics hero banner"/>
        <button className="reference-hotspot home" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Pratyaksh home"/>
        <button className="reference-hotspot environment" onClick={()=>go('environment')} aria-label="Environment"/>
        <button className="reference-hotspot capabilities" onClick={()=>go('capabilities')} aria-label="Capabilities"/>
        <button className="reference-hotspot pipeline" onClick={()=>go('workflow')} aria-label="Pipeline"/>
        <button className="reference-hotspot preview" onClick={()=>go('preview')} aria-label="Preview"/>
        <button className="reference-hotspot compliance" onClick={()=>go('compliance')} aria-label="Compliance"/>
        <button className="reference-hotspot language" onClick={()=>setHindi(v=>!v)} aria-label="Toggle English and Hindi" aria-pressed={hindi}/>
        <button className="reference-hotspot analyse" onClick={onAnalyse} aria-label="Analyse Evidence"/>
        <button className="reference-hotspot report" onClick={onReport} aria-label="View Sample Report"/>
      </section>

      <section className="environment-section section-band" id="environment"><div className="landing-container">
        <div className="section-heading"><div><span className="overline">THE INVESTIGATION ENVIRONMENT</span><h2>Media evidence now sits inside the crime scene.</h2></div><p>From a voice note in a payment fraud to a forwarded clip in a public-order investigation, the central question is no longer only what a file shows—but what the evidence can support.</p></div>
        <div className="environment-grid">{environment.map(item=><article key={item.number}>
          <div className="card-head"><span>{item.number}</span><small>{item.tag}</small></div><h3>{item.title}</h3><p>{item.description}</p>
          <a href={item.url} target="_blank" rel="noreferrer"><span>VERIFIED HEADLINE</span><strong>{item.headline}</strong><small>{item.source} · {item.date}<ExternalLink size={12}/></small></a>
        </article>)}</div>
      </div></section>

      <section className="verification-section"><div className="landing-container">
        <div className="verification-intro"><span className="overline">WHY VERIFICATION</span><h2>A compelling image is not yet a forensic conclusion.</h2><p>Pratyaksh keeps preservation, analysis and interpretation separate. Each finding must answer what was examined, how it was examined, where the supporting artefact is, and what the method cannot establish.</p></div>
        <div className="principle-grid">{principles.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section className="capabilities-section section-band" id="capabilities"><div className="landing-container">
        <div className="section-heading"><div><span className="overline">CAPABILITIES</span><h2>Five connected forensic modules.</h2></div><p>Independent result channels converge in one case workspace without collapsing uncertainty into a single “real or fake” label.</p></div>
        <div className="capability-grid">{capabilities.map(item=><article key={item.n}><span className="cap-number">{item.n}</span><item.icon size={24}/><h3>{item.title}</h3><p>{item.text}</p><span className="cap-status">BOUNDED / EXPLAINABLE</span></article>)}</div>
      </div></section>

      <section className="workflow-section" id="workflow"><div className="landing-container">
        <div className="section-heading"><div><span className="overline">HOW IT WORKS</span><h2>One evidentiary thread, end to end.</h2></div><p>Structured identifiers and saved records carry context from intake through review and export.</p></div>
        <ol className="pipeline">{pipeline.map((step,i)=><li key={step.title}><span className="step-number">{String(i+1).padStart(2,'0')}</span><step.icon size={22}/><h3>{step.title}</h3><code>{step.code}</code>{i<pipeline.length-1&&<ChevronRight className="pipeline-arrow"/>}</li>)}</ol>
      </div></section>

      <section className="product-preview section-band" id="preview"><div className="landing-container">
        <div className="section-heading"><div><span className="overline">PRODUCT PREVIEW</span><h2>The evidence, finding and basis—kept in view.</h2></div><p>A three-pane review workspace links the selected media region to its method, score semantics, custody events and provenance relationships.</p></div>
        <DashboardPreview/>
        <div className="screen-index"><span>CONNECTED SCREENS</span>{['Evidence upload + case creation','Analysis dashboard','Explainability view','Provenance graph','Report generator + export'].map(x=><button key={x} onClick={onAnalyse}>{x}<ArrowRight size={12}/></button>)}</div>
      </div></section>

      <section className="compliance-section" id="compliance"><div className="landing-container compliance-grid">
        <div className="trust-copy"><span className="overline">TRUST & COMPLIANCE</span><h2>Designed for a reviewable electronic record.</h2><p>The prototype supports the information an investigator may need when preparing electronic evidence under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023. It does not itself issue legal certification.</p>
          <ol><li><span>01</span><div><h3>Hash every preserved item</h3><p>Record SHA-256, receipt context and derivative relationships.</p></div></li><li><span>02</span><div><h3>Retain an audit trail</h3><p>Keep actor, action, target, timestamp and outcome visible.</p></div></li><li><span>03</span><div><h3>Export reproducible records</h3><p>Produce deterministic JSON, printable report and package manifest.</p></div></li></ol>
          <p className="context-note">Contextual references to I4C, CERT-In and state cyber cells indicate the operating environment only; no endorsement or affiliation is claimed.</p>
        </div>
        <aside className="readiness-card"><div><ShieldCheck size={23}/><span>SECTION 63</span><small>READINESS CHECKLIST</small></div>{['Electronic record identified','Device or source particulars recorded','SHA-256 value included','Method and version disclosed','Examined scope stated','Limitations and failures retained','Producing authority review reserved'].map(x=><p key={x}><Check size={15}/>{x}</p>)}<footer>Final certification and admissibility assessment remain with the producing authority and the competent court.</footer></aside>
      </div></section>

      <section className="cyber-strip" aria-label="National cybercrime reporting information"><div className="landing-container"><div><span>REPORT FINANCIAL CYBER FRAUD</span><strong>National helpline <b>1930</b></strong></div><a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">cybercrime.gov.in <ExternalLink size={15}/></a></div></section>
    </main>

    <footer className="landing-footer"><div className="landing-container footer-grid"><div><a href="#top" className="landing-brand"><Mark/><span>Pratyaksh <b>|</b> <span lang="hi">प्रत्यक्ष</span></span></a><p>Multimedia forensics for careful, traceable investigation.</p></div><div><span>EXPLORE</span><button onClick={()=>go('capabilities')}>Capabilities</button><button onClick={()=>go('workflow')}>Workflow</button><button onClick={()=>go('compliance')}>Trust & compliance</button></div><div><span>WORKSPACE</span><button onClick={onAnalyse}>Analyse evidence</button><button onClick={onReport}>Sample report</button></div><div><span>PROJECT STATUS</span><p>Independent academic prototype. Not a Government of India product, not affiliated with any public authority, and not a substitute for qualified forensic or legal review.</p></div></div><div className="landing-container footer-bottom"><span>© 2026 Pratyaksh prototype</span><span>No government emblems or official marks used.</span></div></footer>
  </div>
}
