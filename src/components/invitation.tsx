"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

const MAP_URL = "https://www.google.com/maps/dir/?api=1&destination=Grand+Events%2C+Magjistralja+Prishtine%2FMitrovice%2C+Pristina+10000%2C+Kosovo";
const WEDDING_DATE = new Date("2026-08-28T19:00:00+02:00");

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 260" aria-hidden="true">
      <path d="M72 255C75 174 86 88 130 9M76 206C45 199 26 184 12 157M82 165C104 154 119 136 128 111M90 116C63 108 49 89 40 66M106 66C118 56 126 43 130 28" />
      <path className="leaf-fill" d="M73 205C43 201 23 185 12 157c31 2 51 17 61 48ZM83 165c11-27 26-45 45-54-1 26-16 45-45 54ZM89 116C63 108 48 91 40 66c27 3 44 20 49 50ZM105 67c5-20 13-33 25-39-1 18-9 31-25 39Z" />
    </svg>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function MusicIcon({ muted }: { muted: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13M9 9l10-2" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" />{muted && <path d="m3 3 18 18" />}</svg>;
}

function Countdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    [remaining.days, "Ditë"],
    [remaining.hours, "Orë"],
    [remaining.minutes, "Minuta"],
    [remaining.seconds, "Sekonda"],
  ];

  return <div className="countdown">{units.map(([value, label]) => <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

export function Invitation() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const openInvitation = async () => {
    if (opening || opened) return;
    setOpening(true);
    try { await audioRef.current?.play(); } catch { setMuted(true); }
    window.setTimeout(() => {
      setOpened(true);
      window.scrollTo({ top: 0 });
    }, 2250);
  };

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".page h2, .page h3, .page p, .page .hero-logo, .page .date-lockup, .page .detail-grid article, .page .primary-button, .page .countdown, .page form, .page .photo-card, .page .rings-float"
    );
    elements.forEach((element) => element.classList.add("reveal-item"));

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { void audio.play(); setMuted(false); }
    else { audio.pause(); setMuted(true); }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={`${opening ? "is-opening" : ""} ${opened ? "is-open" : ""}`}>
      <audio ref={audioRef} loop preload="none"><source src="/muzika.mp3" type="audio/mpeg" /></audio>

      <section className="opening" aria-label="Hap ftesën">
        <div className="opening-noise" />
        <Leaf className="opening-leaf leaf-left" />
        <Leaf className="opening-leaf leaf-right" />
        <p className="eyebrow">Jeni të ftuar në dasmën e</p>
        <h1>Denis <i>&</i> Sahiba</h1>
        <div className="envelope-wrap">
          <button className="envelope" onClick={openInvitation} aria-label="Hap ftesën">
            <Image className="envelope-photo" src="/envelope.png" alt="Zarf i gjelbër me vulën e Denis dhe Sahiba" width={1140} height={830} priority />
            <span className="invitation-pull" aria-hidden="true">
              <Image src="/logo.svg" alt="" width={182} height={181} />
              <small>Ftesë dasme</small>
              <strong>Denis & Sahiba</strong>
              <em>28 · 08 · 2026</em>
            </span>
            <Image className="opened-envelope" src="/opened-envelope.png" alt="Zarfi i hapur" width={960} height={1020} priority />
            <Image className="envelope-overlay" src="/opened-envelope-overlay.png" alt="" width={960} height={1020} priority />
          </button>
        </div>
        <button className="open-prompt" onClick={openInvitation}>Prekni për ta hapur <ArrowIcon /></button>
      </section>

      <div className="page" id="ftesa">
        <button className="music-toggle" onClick={toggleMusic} aria-label={muted ? "Ndize muzikën" : "Ndal muzikën"}><MusicIcon muted={muted} /></button>

        <section className="hero section-pad">
          <div className="botanical botanical-left"><Leaf /></div>
          <div className="botanical botanical-right"><Leaf /></div>
          <Image className="hero-logo" src="/logo.svg" alt="Denis dhe Sahiba" width={182} height={181} />
          <p className="eyebrow">Me kënaqësi ju ftojmë të ndani me ne</p>
          <p className="hero-script">ditën më të bukur</p>
          <p className="eyebrow">të jetës sonë</p>
          <div className="date-lockup"><span>28</span><div><b>Gusht</b><em>2026</em></div></div>
          <p className="arrival">Pritja e mysafirëve · 18:00–19:00</p>
          <a className="text-link" href="#konfirmimi">Konfirmoni pjesëmarrjen <ArrowIcon /></a>
        </section>

        <section className="quote-section section-pad">
          <span className="tiny-flower">✣</span>
          <p>Dashuria jonë bëhet<br /><i>Premtim i përjetshëm.</i></p>
          <span className="rule" />
        </section>

        <div className="rings-transition" aria-label="Unazat tona">
          <div className="rings-float">
            <Image src="/rings-box.png" alt="Unazat e martesës në kutinë e gjelbër" width={700} height={860} sizes="(max-width: 760px) 46vw, 240px" />
          </div>
        </div>

        <section className="memories section-pad">
          <div className="memories-heading">
            <p className="section-kicker">Ne të dy</p>
            <h2>Një dashuri,<br /><i>një jetë</i></h2>
          </div>
          <div className="photo-scene">
            <figure className="photo-card photo-one">
              <Image src="/photo1.png" alt="Denis dhe Sahiba në ditën e dasmës" width={1269} height={1240} sizes="(max-width: 760px) 68vw, 460px" />
              <figcaption>Denis & Sahiba</figcaption>
            </figure>
            <figure className="photo-card photo-two">
              <Image src="/photo2.png" alt="Duart e çiftit me unazat e martesës" width={1402} height={1122} sizes="(max-width: 760px) 62vw, 420px" />
              <figcaption>Përgjithmonë</figcaption>
            </figure>
          </div>
        </section>

        <section className="details section-pad">
          <p className="section-kicker">Kur & ku</p>
          <h2>Detajet e<br />festës sonë</h2>
          <div className="detail-grid">
            <article><span>01 · E premte</span><h3>28 Gusht<br />2026</h3><p>Pritja · 18:00–19:00</p></article>
            <article><span>02 · Prishtinë</span><h3>Grand<br />Events</h3><p>Magjistralja Prishtinë–Mitrovicë</p></article>
          </div>
          <a className="primary-button" href={MAP_URL} target="_blank" rel="noreferrer"><PinIcon /> Hap lokacionin në hartë</a>
        </section>

        <section className="countdown-section section-pad">
          <p className="section-kicker light">Deri në “Po”-në tonë</p>
          <h2>Po numërojmë<br />çdo moment</h2>
          <Countdown />
        </section>

        <section className="rsvp section-pad" id="konfirmimi">
          <p className="section-kicker">Konfirmimi</p>
          <h2>A do të festoni<br /><i>me ne?</i></h2>
          <p className="form-intro">Ju lutemi konfirmoni pjesëmarrjen dhe numrin e mysafirëve.</p>
          {submitted ? (
            <div className="success"><span>✓</span><h3>Faleminderit!</h3><p>Formulari është në versionin demonstrues. Dërgimi me email do të aktivizohet para publikimit.</p></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Emri dhe mbiemri<input name="name" required autoComplete="name" placeholder="Shkruani emrin tuaj" /></label>
              <fieldset><legend>A do të merrni pjesë?</legend><label className="choice"><input type="radio" name="attendance" value="yes" required /><span>Po, me kënaqësi</span></label><label className="choice"><input type="radio" name="attendance" value="no" /><span>Jo, nuk mundem</span></label></fieldset>
              <label>Numri i mysafirëve<select name="guests" defaultValue="1"><option value="1">1 person</option><option value="2">2 persona</option><option value="3">3 persona</option><option value="4">4 persona</option><option value="5">5 persona</option><option value="6">6 persona</option></select></label>
              <label>Mesazh ose pyetje <span>(opsionale)</span><textarea name="message" rows={4} placeholder="Shkruani mesazhin tuaj" /></label>
              <button className="primary-button submit" type="submit">Dërgo konfirmimin <ArrowIcon /></button>
            </form>
          )}
          <p className="contact-note">Për çdo pyetje, na kontaktoni në <a href="tel:+38349230646">049 230 646</a></p>
        </section>

        <footer>
          <Leaf className="footer-leaf left" /><Leaf className="footer-leaf right" />
          <Image src="/logo.svg" alt="" width={182} height={181} />
          <p>Me dashuri,</p><h2>Denis & Sahiba</h2><span>28 · 08 · 2026</span>
          <p className="hosts">Me respekt · Amir & Elanda Hoxha</p>
        </footer>
      </div>
    </main>
  );
}
