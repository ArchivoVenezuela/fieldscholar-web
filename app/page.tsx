"use client";
import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";

const pillars = [
  ["01", "Program", "The practical shape of each day.", "Itineraries · Housing · Contacts · Resources · Program tools"],
  ["02", "Field", "A place to notice what matters.", "Notes · Observations · Reflection · Multimedia · Place-based learning"],
  ["03", "Connect", "The right information, in context.", "Faculty communication · Program updates · Linked course tools"],
  ["04", "Safe", "Calm access to help when it counts.", "Emergency contacts · I’m Safe · Urgent information · Privacy-conscious tools"],
];

const walkthrough = [
  {
    id: "today",
    kicker: "A · Start the day",
    title: "Start the day knowing what matters.",
    copy: "Today’s schedule, meeting points, activities, resources and updates stay together in one place.",
    src: "/product/schedule.webp",
    alt: "FieldScholar Program Schedule showing Week 1 days in Querétaro, including arrival, classes, and the trip to Teotihuacán.",
    caption: "Program Schedule in the current pilot.",
  },
  {
    id: "housing",
    kicker: "B · Housing",
    title: "Housing details when students actually need them.",
    copy: "Address, access information, contacts and practical notes stay with the student instead of disappearing into old emails or PDFs.",
    src: "/product/stay.webp",
    alt: "FieldScholar My Stay screen with host family, address, phone, maps link, and notes for housing in Querétaro.",
    caption: "My Stay — host family and housing.",
  },
  {
    id: "field",
    kicker: "C · Learn in the field",
    title: "Capture the experience while it is happening.",
    copy: "Students can document observations, reflection and place-based learning while the field is still part of the learning process.",
    src: "/product/trips.webp",
    alt: "FieldScholar Trips list with Teotihuacán, San Miguel de Allende, Guanajuato, and Bernal, each with Start observation.",
    caption: "Trips — start an observation from the excursion itself.",
  },
  {
    id: "connect",
    kicker: "D · Stay connected",
    title: "The right information, in context.",
    copy: "Faculty can surface program information and updates without turning FieldScholar into another general-purpose chat platform. Call and WhatsApp reach the program’s faculty contact; course tools such as Slack and Canvas remain linked, not rebuilt.",
    src: "/product/home.webp",
    alt: "FieldScholar home with emergency faculty contact, Today / Next up, New note, View schedule, and My Stay.",
    caption: "Home — faculty contact, today’s program, and quick actions.",
  },
  {
    id: "safety",
    kicker: "E · Safety",
    title: "Safety without surveillance.",
    copy: "Help stays reachable. Continuous location tracking does not. I’m Safe: one tap begins a prefilled safety message to the program’s primary faculty contact.",
    src: "/product/safety.webp",
    alt: "FieldScholar Safety Center with emergency contacts, program director, faculty co-leader, in-country contacts, and accommodation.",
    caption: "Safety Center in the current pilot.",
  },
  {
    id: "faculty",
    kicker: "F · Faculty",
    title: "What a program leader can do.",
    copy: "Faculty can review student progress, open Program Setup, manage homestays, and keep schedule, map, and course tools in one configured program environment.",
    src: "/product/faculty.webp",
    alt: "FieldScholar Faculty Dashboard with Program Setup, Homestays Manager, student documents, and program resources including Slack and Canvas.",
    caption: "Faculty Dashboard in the current pilot.",
  },
];

function ProductShot({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="product-shot">
      <Image
        src={src}
        alt={alt}
        width={1360}
        height={2000}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="(max-width: 720px) 100vw, 42vw"
      />
      <figcaption className="image-caption">{caption}</figcaption>
    </figure>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSendError("");
    const form = new FormData(e.currentTarget);
    if (String(form.get("company_website") ?? "").trim()) {
      setSent(true);
      return;
    }
    const field = (name: string) => String(form.get(name) ?? "").trim();
    const name = field("name");
    const institution = field("institution");
    const role = field("role");
    const email = field("email");
    const type = field("type");
    const participants = field("participants");
    const whereWhen = field("where-when");
    const improve = field("improve");
    const message = field("message");
    const subject = institution
      ? `FieldScholar pilot inquiry — ${institution}`
      : "FieldScholar pilot inquiry";
    setSending(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/fieldscholar.info@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        referrerPolicy: "origin",
        body: JSON.stringify({
          _subject: subject,
          _template: "box",
          _captcha: "false",
          name,
          institution,
          role,
          email,
          type,
          participants,
          whereWhen,
          improve,
          message,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
      const ok = payload.success === true || payload.success === "true";
      const activation = /activat/i.test(payload.message ?? "");
      if (ok) {
        setSent(true);
        return;
      }
      if (activation) {
        setSendError(
          "Check fieldscholar.info@gmail.com for FormSubmit’s “Activate Form” email (including Spam), open the link, then submit this form again.",
        );
        return;
      }
      throw new Error(payload.message || "Send failed");
    } catch {
      setSendError("The inquiry could not be sent. Please email fieldscholar.info@gmail.com.");
    } finally {
      setSending(false);
    }
  }
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="FieldScholar home">
          <span className="brand-mark">FS</span>
          <span>FieldScholar</span>
        </Link>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu">
          {menu ? "Close" : "Menu"}
        </button>
        <nav className={menu ? "open" : ""} aria-label="Primary navigation">
          <a href="#product" onClick={() => setMenu(false)}>Product</a>
          <a href="#schools" onClick={() => setMenu(false)}>For Schools</a>
          <a href="#universities" onClick={() => setMenu(false)}>For Universities</a>
          <a href="#learning" onClick={() => setMenu(false)}>Learning in the Field</a>
          <a href="#safety" onClick={() => setMenu(false)}>Safety & Privacy</a>
          <a href="#about" onClick={() => setMenu(false)}>About</a>
          <a className="nav-cta" href="#pilot" onClick={() => setMenu(false)}>Request a Pilot</a>
        </nav>
      </header>

      <section className="hero" id="product">
        <div className="topo" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">A global learning companion</p>
          <h1>Learning goes further when everything travels together.</h1>
          <p className="lede">
            FieldScholar brings program information, field learning, communication, and safety into one mobile-first experience for students and faculty on experiential and international programs.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#pilot">Request a Pilot <span>↗</span></a>
            <a className="text-link" href="#in-action">See FieldScholar in action <span>↓</span></a>
          </div>
        </div>
        <div className="hero-editorial">
          <Image
            src="/fieldscholar-hero.webp"
            alt="FieldScholar mobile companion with program schedule, field observation, safety, and reflection tools"
            width={1400}
            height={933}
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <span className="image-caption">The program, held together · Mobile-first by design</span>
        </div>
        <div className="hero-foot">
          <span>Before departure</span>
          <i />
          <span>In the field</span>
          <i />
          <span>Throughout the program</span>
        </div>
      </section>

      <section className="problem section" id="experience">
        <div className="section-no">01 / THE PROBLEM</div>
        <div className="problem-heading">
          <p className="eyebrow">One continuous experience</p>
          <h2>The experience is connected.<br /><em>The tools usually aren’t.</em></h2>
        </div>
        <div className="fragments">
          <span>Email</span>
          <span>PDFs</span>
          <span>Messaging apps</span>
          <span>Shared documents</span>
          <span>LMS</span>
          <span>Travel systems</span>
          <span>Paper itineraries</span>
          <span>Contact sheets</span>
        </div>
        <p className="problem-close">FieldScholar does not replace those tools. It gives students one place to live the program.</p>
      </section>

      <section className="walkthrough section" id="in-action">
        <div className="section-no">02 / IN ACTION</div>
        <div className="walk-intro">
          <p className="eyebrow">See FieldScholar in action</p>
          <h2>One program. One mobile experience.</h2>
          <p>The information and tools students actually need while they are abroad — shown here from the current FieldScholar pilot.</p>
        </div>
        {walkthrough.map((step, i) => (
          <article className={`walk-step${i % 2 ? " reverse" : ""}`} key={step.id} id={step.id}>
            <div className="walk-copy">
              <p className="tiny-label">{step.kicker}</p>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              {step.id === "safety" ? (
                <div className="no-track compact">
                  <span>◎</span>
                  <strong>No continuous location tracking.</strong>
                </div>
              ) : null}
            </div>
            <ProductShot src={step.src} alt={step.alt} caption={step.caption} />
          </article>
        ))}
      </section>

      <section className="dimensions section">
        <div className="section-no">03 / FOUR DIMENSIONS</div>
        <div className="section-intro compact-intro">
          <p className="eyebrow">What you just saw</p>
          <h2>Program. Field. Connect. Safe.</h2>
        </div>
        <div className="pillar-list">
          {pillars.map(([n, title, sub, items]) => (
            <article key={title}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{sub}</p>
              </div>
              <small>{items}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="safety section" id="safety">
        <div className="section-no">04 / SAFETY & PRIVACY</div>
        <div className="safety-grid">
          <div>
            <p className="eyebrow">A product principle</p>
            <h2>Safety without surveillance.</h2>
            <p className="big-copy">
              Students need fast access to help and institutions need reliable ways to communicate during serious events. That does not require continuous location tracking.
            </p>
            <div className="no-track">
              <span>◎</span>
              <strong>No continuous<br />location tracking.</strong>
            </div>
            <div className="safe-flow">
              <span className="flow-label">Available in the pilot</span>
              <div className="safe-button">
                <span>✓</span>
                <strong>I’m Safe</strong>
                <small>One tap begins a prefilled message to the program’s primary faculty contact.</small>
              </div>
              <div className="arrow">↓</div>
              <p>Student’s chosen <strong>safety communication path</strong></p>
              <hr />
              <span className="flow-label">Planned institutional capability</span>
              <p className="institution-flow">Institution <b>→</b> Program <b>→</b> Cohort <b>→</b> Appropriate recipients</p>
              <p className="planned-note">Institutional emergency communication, targeted alerts, and recipient selection by program or cohort are not in the current pilot.</p>
            </div>
          </div>
          <figure className="safe-visual">
            <Image
              src="/safety-companion.webp"
              alt="FieldScholar safety actions: call faculty, WhatsApp faculty, and optional one-time location sharing"
              width={1280}
              height={960}
              loading="lazy"
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <figcaption className="image-caption">Student control stays visible in every safety action.</figcaption>
          </figure>
        </div>
      </section>

      <section className="learning section" id="learning">
        <div className="section-no">05 / LEARNING IN THE FIELD</div>
        <div className="learning-head">
          <p className="eyebrow">Place is part of the curriculum</p>
          <h2>The field is part<br />of the classroom.</h2>
          <p>FieldScholar gives students a structured place to observe, document, interpret and reflect while experiences are still unfolding.</p>
        </div>
        <div className="journal">
          <div className="journal-photo">
            <Image
              src="/field-learning.webp"
              alt="FieldScholar Notes on a phone beside a field notebook, with daily note, reflection, and trip note actions"
              width={1280}
              height={960}
              loading="lazy"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span>NOTES · DAILY · REFLECTION · TRIP</span>
          </div>
          <div className="journal-note">
            <span className="tiny-label">In the current pilot</span>
            <h3>Notes, observations, and reflection</h3>
            <p>Students start a daily note, a reflection, or a trip observation from the program they are already in — including from a specific excursion.</p>
            <div className="media-row">
              <span>Daily note</span>
              <span>Reflection</span>
              <span>Trip observation</span>
              <span>Photo &amp; media</span>
            </div>
            <ProductShot
              src="/product/notes.webp"
              alt="FieldScholar Notes with Daily note, All types filter, and empty-state prompt to start from a trip"
              caption="Notes — daily entries, trip notes, and reflections."
            />
          </div>
        </div>
        <div className="learning-tools">
          <span>Field notes</span>
          <span>Reflection</span>
          <span>Multimedia</span>
          <span>Site observation</span>
          <span className="planned-chip">Annotation <small>planned</small></span>
          <span className="planned-chip">Geospatial work <small>planned</small></span>
        </div>
      </section>

      <section className="audiences">
        <article id="schools">
          <span className="audience-no">FOR SCHOOLS / 01</span>
          <h2>More confidence for students. More clarity for the people responsible for them.</h2>
          <p>Give every international, cultural, service, or experiential program its own configured environment — simple for students, dependable for faculty, and privacy-conscious by design.</p>
          <ul>
            <li>Itinerary, housing &amp; resources</li>
            <li>Faculty &amp; emergency contacts</li>
            <li>Field learning &amp; reflection</li>
            <li>Urgent communication</li>
          </ul>
          <a href="#pilot" className="text-link">Explore a school pilot →</a>
        </article>
        <article id="universities">
          <span className="audience-no">FOR UNIVERSITIES / 02</span>
          <h2>Built to grow from programs to institutions.</h2>
          <p>The current pilot is configured at program level. The intended institutional shape is already visible:</p>
          <div className="architecture">
            <span>Institution</span>
            <b>→</b>
            <span>Program</span>
            <b>→</b>
            <span>Cohort</span>
            <b>→</b>
            <span>Membership + Roles</span>
          </div>
          <p className="planned">
            <strong>Planned institutional capabilities</strong>
            Program Builder · Roster management · Role-based permissions · SSO · Integrations · Auditability · Data lifecycle
          </p>
        </article>
      </section>

      <section className="clarity section">
        <div className="section-no">06 / CLEAR BY DESIGN</div>
        <h2>What FieldScholar is—<br />and what it isn’t.</h2>
        <div className="contrast compact-contrast">
          <div>
            <h3>FieldScholar is</h3>
            <p>↗ A global learning companion</p>
            <p>↗ A configurable program layer</p>
            <p>↗ A student-centered mobile experience</p>
            <p>↗ A bridge between logistics, learning, communication, and safety</p>
          </div>
          <div>
            <h3>FieldScholar isn’t</h3>
            <p>× An LMS</p>
            <p>× A general-purpose chat platform</p>
            <p>× A travel agency system</p>
            <p>× A continuous student tracking system</p>
            <p>× A replacement for institutional emergency infrastructure</p>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="section-no light">07 / ORIGIN</div>
        <p className="eyebrow light">Built from the program outward</p>
        <h2>A product perspective grounded in the lived academic experience.</h2>
        <p>
          FieldScholar emerged from direct experience designing and leading international and experiential learning programs. Its development is informed by global learning, experiential pedagogy, digital humanities, student experience, faculty program leadership, and institutional travel realities.
        </p>
      </section>

      <section className="pilot section" id="pilot">
        <div className="pilot-copy">
          <div className="section-no">08 / PILOT</div>
          <p className="eyebrow">A thoughtful first step</p>
          <h2>Bring your next program into FieldScholar.</h2>
          <p>We are working with institutions interested in piloting a more coherent digital experience for learning beyond the classroom.</p>
          <a className="text-link pdf-link" href="/fieldscholar-overview.pdf" target="_blank" rel="noopener noreferrer">
            Download FieldScholar overview (PDF) <span>↗</span>
          </a>
          <p className="privacy-copy">We ask only for what helps us understand your program. No tracking, no mailing-list tricks.</p>
        </div>
        {sent ? (
          <div className="success" role="status">
            <span>✓</span>
            <h3>Thank you.</h3>
            <p>Your inquiry was sent to fieldscholar.info@gmail.com.</p>
            <button className="text-link" onClick={() => setSent(false)}>Send another inquiry</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <input className="hp" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label>Name<input required name="name" autoComplete="name" /></label>
            <label>Institution<input required name="institution" /></label>
            <div className="form-row">
              <label>Role<input required name="role" /></label>
              <label>Email<input required type="email" name="email" autoComplete="email" /></label>
            </div>
            <div className="form-row">
              <label>
                Type of program
                <select name="type" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  <option>Study abroad</option>
                  <option>Faculty-led</option>
                  <option>Field research</option>
                  <option>Secondary education</option>
                  <option>Experiential learning</option>
                  <option>Other</option>
                </select>
              </label>
              <label>Approx. participants<input name="participants" inputMode="numeric" /></label>
            </div>
            <label>Where / when does the program run?<input name="where-when" /></label>
            <label>What are you hoping to improve?<textarea required name="improve" rows={3} /></label>
            <label>Optional message<textarea name="message" rows={2} /></label>
            {sendError ? <p className="form-error" role="alert">{sendError}</p> : null}
            <button className="button primary" type="submit" disabled={sending}>
              {sending ? "Sending…" : <>Request a conversation <span>↗</span></>}
            </button>
          </form>
        )}
      </section>

      <footer>
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">FS</span>
            <span>FieldScholar<small>A Global Learning Companion</small></span>
          </Link>
        </div>
        <div>
          <a href="#product">Product</a>
          <a href="#schools">Schools</a>
          <a href="#universities">Universities</a>
          <a href="#safety">Safety & Privacy</a>
        </div>
        <div>
          <a href="#about">About</a>
          <a href="#pilot">Contact</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <p>© {new Date().getFullYear()} FieldScholar</p>
      </footer>
    </main>
  );
}
