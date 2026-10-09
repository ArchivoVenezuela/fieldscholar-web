"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fit?: "cover" | "natural";
  plain?: boolean;
};

const nav = [
  ["#features", "Features"],
  ["#faculty", "Faculty & Institutions"],
  ["#safety", "Safety & Privacy"],
  ["#about", "About"],
  ["#contact", "Contact"],
];

const features: { n: string; title: string; copy: ReactNode; note?: ReactNode; shots: Shot[] }[] = [
  {
    n: "01",
    title: "Program",
    copy: "Schedules and itineraries, housing assignments with host contacts and map links, trips, meeting points, program contacts, and in-country resources, configured for each program.",
    shots: [
      {
        src: "/v2/s-schedule.jpg",
        alt: "Program Schedule, Week 1 in Querétaro: arrival, free time, classes, and cultural sessions",
        caption: "Program Schedule",
        width: 2734,
        height: 1828,
        fit: "cover",
      },
      {
        src: "/v2/s-map.jpg",
        alt: "Program Map with shared meeting points and key locations in Querétaro",
        caption: "Program Map",
        width: 2784,
        height: 1874,
        fit: "cover",
      },
    ],
  },
  {
    n: "02",
    title: "Field",
    copy: "Field notes, site observations, and guided reflections. Students can start an observation directly from a scheduled excursion.",
    note: (
      <p className="feature-note">
        <span className="tag tag-outline">Planned</span>
        Annotation and geospatial tools
      </p>
    ),
    shots: [
      {
        src: "/v2/s-notes.jpg",
        alt: "Notes with Daily note, Reflection, and Trip note actions, type filter, and export",
        caption: "Notes — daily, reflection, trip",
        width: 2790,
        height: 1844,
        fit: "cover",
      },
    ],
  },
  {
    n: "03",
    title: "Connect",
    copy: "The home screen shows today's program and the faculty contact, reachable by phone or WhatsApp. Course platforms such as Canvas and Slack are linked from the app rather than replicated.",
    shots: [
      {
        src: "/v2/s-home.jpg",
        alt: "Student home with Call and WhatsApp Faculty Leader, one-time location sharing, Today / Next up, quick actions, and My Stay",
        caption: "Student home",
        width: 1572,
        height: 1802,
        fit: "cover",
      },
    ],
  },
  {
    n: "04",
    title: "Safe",
    copy: (
      <>
        The Safety Center lists emergency numbers, faculty leaders, in-country contacts, accommodation, and insurance information. It also holds the student-only I AM SAFE action.{" "}
        <a href="#safety">How it works</a>
      </>
    ),
    shots: [
      {
        src: "/v2/s-safety.jpg",
        alt: "Safety Center with emergency contacts, faculty leaders, in-country contacts, accommodation, and insurance",
        caption: "Safety Center",
        width: 1598,
        height: 1812,
        fit: "cover",
      },
    ],
  },
];

const facultyTools = [
  "Program Setup and resources",
  "Student Records",
  "Homestays Manager",
  "Itinerary and excursion editing",
  "Emergency and safety content",
  "Arrival roster and participant data tools",
];

const safetyFacts = [
  ["Contacts", "Emergency numbers and faculty contacts are available from the home screen and the Safety Center."],
  ["I AM SAFE", "Opens a prefilled WhatsApp message to the program's primary faculty contact. The student sends it from WhatsApp; nothing is sent automatically, and the action does not depend on cloud synchronization."],
  ["Location", "A separate, student-initiated action shares the current location once, after confirmation. FieldScholar does not track student location continuously."],
  ["Data", "Access is restricted to approved participants. Student and faculty paths are separate, and information is visible according to role."],
];

function Marks() {
  return (
    <>
      <i className="corner tl" aria-hidden="true" />
      <i className="corner tr" aria-hidden="true" />
      <i className="corner bl" aria-hidden="true" />
      <i className="corner br" aria-hidden="true" />
    </>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [zoom, setZoom] = useState<Shot | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoom) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setZoom(null);
      const trigger = triggerRef.current;
      if (trigger) window.setTimeout(() => trigger.focus(), 0);
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [zoom]);

  function openZoom(shot: Shot, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setZoom(shot);
  }

  function closeZoom() {
    setZoom(null);
    const trigger = triggerRef.current;
    if (trigger) window.setTimeout(() => trigger.focus(), 0);
  }

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
    const subject = institution ? `FieldScholar pilot inquiry — ${institution}` : "FieldScholar pilot inquiry";
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
    <>
      <header className="site-header">
        <nav className="nav shell" aria-label="Primary">
          <Link className="nav-brand" href="/" aria-label="FieldScholar home">
            <Image src="/mark.png" alt="" width={32} height={32} />
            <span>FieldScholar</span>
          </Link>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menu}
            aria-controls="primary-links"
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? "Close" : "Menu"}
          </button>
          <div className={menu ? "nav-links open" : "nav-links"} id="primary-links">
            {nav.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <section className="hero shell" id="overview">
          <div className="hero-copy">
            <p className="kicker">A Global Learning Companion</p>
            <h1>FieldScholar</h1>
            <p className="lede">
              FieldScholar is a mobile-first application for study abroad, field-based courses, and experiential learning programs. It brings together program schedules, housing information, academic fieldwork, faculty communication, and safety resources in a configurable environment for students and program leaders.
            </p>
            <dl className="blueprint spec">
              <Marks />
              <dt>Status</dt>
              <dd>Functional pilot with a faculty-led program</dd>
              <dt>Interface</dt>
              <dd>Mobile-first web app; also works in a desktop browser</dd>
              <dt>Access</dt>
              <dd>Approved program participants only</dd>
            </dl>
            <a href="#features" className="btn btn-ghost">Application features ↓</a>
          </div>
          <figure className="hero-figure">
            <button
              type="button"
              className="blueprint shot-frame plain"
              aria-label="Enlarge: FieldScholar student app"
              onClick={(e) =>
                openZoom(
                  {
                    src: "/v2/s-hero.jpg",
                    alt: "FieldScholar mobile screens: schedule, field observation, safety, and reflection",
                    caption: "Student experience — current pilot",
                    width: 1400,
                    height: 934,
                    fit: "natural",
                    plain: true,
                  },
                  e.currentTarget,
                )
              }
            >
              <Marks />
              <Image
                src="/v2/s-hero.jpg"
                alt="FieldScholar mobile screens: schedule, field observation, safety, and reflection"
                width={1400}
                height={934}
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </button>
            <figcaption>Student experience — current pilot</figcaption>
          </figure>
        </section>

        <section className="band" id="features">
          <div className="shell features-intro">
            <h2 className="section-title">Application features</h2>
            <p className="intro-note">
              Four areas of the student app. Screenshots are from the current pilot, with personal details obscured; select one to enlarge it.
            </p>
          </div>
          <div className="shell">
            {features.map((feature) => (
              <article className="feature" key={feature.n}>
                <div className="feature-copy">
                  <p className="feature-num">{feature.n}</p>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                  {feature.note}
                </div>
                <div className="feature-shots">
                  {feature.shots.map((shot) => (
                    <figure className="shot" key={shot.src}>
                      <button
                        type="button"
                        className="blueprint shot-frame"
                        aria-label={`Enlarge: ${shot.caption}`}
                        onClick={(e) => openZoom(shot, e.currentTarget)}
                      >
                        <Marks />
                        <Image
                          src={shot.src}
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          className={shot.fit === "cover" ? "shot-cover" : undefined}
                          sizes="(max-width: 900px) 100vw, 36vw"
                        />
                      </button>
                      <figcaption>{shot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="band band-surface" id="faculty">
          <div className="shell faculty-layout">
            <div className="faculty-copy">
              <h2 className="section-title">Faculty &amp; program administration</h2>
              <p>Program leaders use a separate faculty path that requires an additional verification step. In the current pilot it includes:</p>
              <ul className="faculty-list">
                {facultyTools.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="institution">
                <h3>Institutional architecture</h3>
                <p>
                  FieldScholar is designed as one configurable platform for multiple institutions and programs, rather than separate codebases per program. Access and data are organized as:
                </p>
                <p className="blueprint architecture">
                  <Marks />
                  Institution <span aria-hidden="true">→</span> Program <span aria-hidden="true">→</span> Cohort <span aria-hidden="true">→</span> Membership/User <span aria-hidden="true">→</span> Role <span aria-hidden="true">→</span> Data
                </p>
              </div>
              <div className="status-grid">
                <div className="status-card">
                  <span className="tag tag-accent">In the pilot</span>
                  <p>Program-level configuration for a single faculty-led program.</p>
                </div>
                <div className="status-card">
                  <span className="tag tag-neutral">Implemented &amp; validated</span>
                  <p>Institution and membership layer, program and cohort creation, and roster import, implemented and validated separately from the live pilot.</p>
                </div>
                <div className="status-card">
                  <span className="tag tag-outline">Planned</span>
                  <p>Program Builder, single sign-on (SSO), institutional emergency alerts, platform integrations.</p>
                </div>
              </div>
            </div>
            <figure className="faculty-figure">
              <button
                type="button"
                className="blueprint shot-frame"
                aria-label="Enlarge: Faculty Dashboard"
                onClick={(e) =>
                  openZoom(
                    {
                      src: "/v2/s-faculty.jpg",
                      alt: "Faculty Dashboard with Program Setup, Student Records, Participant Data Tools, Homestays Manager, student documents, and program resources",
                      caption: "Faculty Dashboard",
                      width: 2736,
                      height: 1862,
                      fit: "cover",
                    },
                    e.currentTarget,
                  )
                }
              >
                <Marks />
                <Image
                  src="/v2/s-faculty.jpg"
                  alt="Faculty Dashboard with Program Setup, Student Records, Participant Data Tools, Homestays Manager, student documents, and program resources"
                  width={2736}
                  height={1862}
                  className="shot-cover"
                  sizes="(max-width: 900px) 100vw, 44vw"
                />
              </button>
              <figcaption>Faculty Dashboard</figcaption>
            </figure>
          </div>
        </section>

        <section className="band" id="safety">
          <div className="shell safety-layout">
            <div className="safety-copy">
              <h2 className="section-title">Safety &amp; privacy</h2>
              <dl className="safety-list">
                {safetyFacts.map(([term, detail]) => (
                  <div className="safety-row" key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="planned-note">
                <span className="tag tag-outline">Planned</span>
                Institutional emergency alerts targeted by program or cohort. Not part of the current pilot.
              </p>
            </div>
            <div className="safety-shots">
              <figure className="shot">
                <button
                  type="button"
                  className="blueprint shot-frame"
                  aria-label="Enlarge: I AM SAFE"
                  onClick={(e) =>
                    openZoom(
                      {
                        src: "/v2/s-imsafe.jpg",
                        alt: "Safety Center with the I AM SAFE button, faculty leader WhatsApp and call buttons, and emergency contacts",
                        caption: "I AM SAFE — opens a prefilled WhatsApp message",
                        width: 1736,
                        height: 1710,
                        fit: "cover",
                      },
                      e.currentTarget,
                    )
                  }
                >
                  <Marks />
                  <Image
                    src="/v2/s-imsafe.jpg"
                    alt="Safety Center with the I AM SAFE button, faculty leader WhatsApp and call buttons, and emergency contacts"
                    width={1736}
                    height={1710}
                    className="shot-cover"
                    sizes="(max-width: 900px) 100vw, 44vw"
                  />
                </button>
                <figcaption>I AM SAFE — opens a prefilled WhatsApp message</figcaption>
              </figure>
              <figure className="shot">
                <button
                  type="button"
                  className="blueprint shot-frame plain"
                  aria-label="Enlarge: safety actions"
                  onClick={(e) =>
                    openZoom(
                      {
                        src: "/v2/s-companion.jpg",
                        alt: "Safety actions: call faculty, WhatsApp faculty, and optional one-time location sharing",
                        caption: "Safety actions: call, WhatsApp, one-time location",
                        width: 1280,
                        height: 960,
                        fit: "natural",
                        plain: true,
                      },
                      e.currentTarget,
                    )
                  }
                >
                  <Marks />
                  <Image
                    src="/v2/s-companion.jpg"
                    alt="Safety actions: call faculty, WhatsApp faculty, and optional one-time location sharing"
                    width={1280}
                    height={960}
                    sizes="(max-width: 900px) 100vw, 44vw"
                  />
                </button>
                <figcaption>Safety actions: call, WhatsApp, one-time location</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="band" id="about">
          <div className="shell about-layout">
            <h2>About the project</h2>
            <p>
              FieldScholar was developed from experience designing and directing international and experiential learning programs. The project combines practical program management with an emphasis on experiential and field-based learning, reflection, student safety, and digital humanities.
            </p>
          </div>
        </section>

        <section className="band band-surface" id="contact">
          <div className="shell contact-layout">
            <div className="contact-copy">
              <h2 className="section-title">Contact &amp; pilot inquiries</h2>
              <p>Faculty and institutions interested in using FieldScholar for a program can write to us here. Inquiries go to fieldscholar.info@gmail.com.</p>
            </div>
            <div className="contact-form">
              {sent ? (
                <div className="blueprint success" role="status">
                  <Marks />
                  <h3>Thank you.</h3>
                  <p>Your inquiry was sent to fieldscholar.info@gmail.com.</p>
                  <button className="btn btn-ghost" type="button" onClick={() => setSent(false)}>
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form className="inquiry-form" onSubmit={submit}>
                  <input className="hp" type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <div className="field">
                    <label htmlFor="f-name">Name</label>
                    <input id="f-name" className="input" name="name" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-inst">Institution</label>
                    <input id="f-inst" className="input" name="institution" required autoComplete="organization" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-role">Role</label>
                    <input id="f-role" className="input" name="role" required />
                  </div>
                  <div className="field">
                    <label htmlFor="f-email">Email</label>
                    <input id="f-email" className="input" type="email" name="email" required autoComplete="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-type">Type of program</label>
                    <select id="f-type" className="input" name="type" required defaultValue="">
                      <option value="">Select one</option>
                      <option>Study abroad</option>
                      <option>Faculty-led</option>
                      <option>Field research</option>
                      <option>Secondary education</option>
                      <option>Experiential learning</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="f-part">Approx. participants</label>
                    <input id="f-part" className="input" name="participants" inputMode="numeric" />
                  </div>
                  <div className="field span-all">
                    <label htmlFor="f-where">Where and when does the program run?</label>
                    <input id="f-where" className="input" name="where-when" />
                  </div>
                  <div className="field span-all">
                    <label htmlFor="f-improve">What would you like the platform to support?</label>
                    <textarea id="f-improve" className="input" name="improve" rows={3} required />
                  </div>
                  <div className="field span-all">
                    <label htmlFor="f-msg">Message (optional)</label>
                    <textarea id="f-msg" className="input" name="message" rows={2} />
                  </div>
                  {sendError ? (
                    <p className="form-error span-all" role="alert">
                      {sendError}
                    </p>
                  ) : null}
                  <div className="span-all">
                    <button className="btn btn-primary blueprint" type="submit" disabled={sending}>
                      <Marks />
                      {sending ? "Sending…" : "Send inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-bar">
          <span>FieldScholar · Designed and developed by Patricia Valladares-Ruiz · © 2026</span>
          <div className="footer-links">
            <a className="btn btn-secondary" href="/fieldscholar-project-overview.pdf" target="_blank" rel="noopener noreferrer">
              Project Overview
            </a>
            <a href="https://fieldscholar.app">Application</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      {zoom ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={zoom.alt}>
          <button className="lightbox-backdrop" type="button" aria-label="Close" onClick={closeZoom} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.src} alt={zoom.alt} />
          <div className="lightbox-bar">
            <p>{zoom.alt}</p>
            <button ref={closeRef} className="btn" type="button" onClick={closeZoom}>
              Close (Esc)
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
