import { useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { profile } from "../data/profile";
import DecryptedText from "./DecryptedText";
import type { AvatarStyle } from "./avatarScene";
import "./avatarHero.css";

const styles: { id: AvatarStyle; label: string }[] = [
  { id: "clay", label: "Soft clay" },
  { id: "toon", label: "Toon" },
  { id: "vinyl", label: "Vinyl" },
];

const cloudPositions = [
  { left: "14%", top: "13%" },
  { left: "51%", top: "22%" },
  { left: "84%", top: "12%" },
];

export default function AvatarHero() {
  const [style, setStyle] = useState<AvatarStyle>("clay");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sky = useRef<HTMLButtonElement>(null);
  const interaction = useRef({ x: 0, y: 0, touchedAt: -Infinity });

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    import("./avatarScene")
      .then(({ mountAvatar }) => {
        if (cancelled) return;
        dispose = mountAvatar(element, style, interaction.current);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [style]);

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    interaction.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    interaction.current.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    event.currentTarget.dataset.pointer = "near";
  }

  function scatterCloud(event: MouseEvent<HTMLButtonElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const clouds = Array.from(sky.current?.querySelectorAll<HTMLElement>(".hero-cloud") ?? []);
    const distance = (cloud: HTMLElement) => {
      const bounds = cloud.getBoundingClientRect();
      return Math.hypot(
        event.clientX - bounds.left - bounds.width / 2,
        event.clientY - bounds.top - bounds.height / 2,
      );
    };
    const closest = event.detail === 0
      ? clouds[1]
      : clouds.reduce<HTMLElement | undefined>(
        (nearest, cloud) => !nearest || distance(cloud) < distance(nearest) ? cloud : nearest,
        undefined,
      );

    closest?.querySelectorAll<HTMLElement>(".hero-cloud__half").forEach((half, index) => {
      half.getAnimations().forEach(animation => animation.cancel());
      const direction = index === 0 ? -1 : 1;
      half.animate([
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: `translate(${direction * 32}px, -7px)`, opacity: 0.62, offset: 0.35 },
        { transform: "translate(0, 0)", opacity: 1 },
      ], { duration: 1300, easing: "ease-in-out" });
    });
  }

  return (
    <section className="avatar-hero" id="home" aria-labelledby="hero-title">
      <button
        className="hero-sky"
        type="button"
        ref={sky}
        aria-label="Scatter a cloud"
        onClick={scatterCloud}
      >
        {cloudPositions.map(position => (
          <span className="hero-cloud" style={position} key={position.left} aria-hidden="true">
            <span className="hero-cloud__half" />
            <span className="hero-cloud__half" />
          </span>
        ))}
        <span className="hero-sky__hint">Tap the sky</span>
      </button>
      <div className="avatar-hero__intro">
        <h1 id="hero-title">
          Hi, I’m<br />
          <DecryptedText text={`${profile.name}.`} animateOn="view" speed={90} maxIterations={4} />
        </h1>
        <p><DecryptedText text={profile.tagline} animateOn="view" speed={100} maxIterations={4} /></p>
        <div className="avatar-hero__links">
          <a href="#about">About me</a>
          <a href={`mailto:${profile.links.email}`}>Say hello</a>
        </div>
      </div>

      <figure className="avatar-preview">
        <div className="avatar-preview__stage">
          <button
            className="avatar-preview__target"
            type="button"
            aria-label="Make the avatar smile"
            aria-describedby="avatar-hint"
            disabled={!ready || failed}
            onPointerMove={move}
            onPointerLeave={(event) => { delete event.currentTarget.dataset.pointer; }}
            onClick={() => { interaction.current.touchedAt = performance.now(); }}
          >
            <canvas ref={canvas} aria-hidden="true" />
          </button>
          {(!ready || failed) && (
            <p className="avatar-preview__fallback" role="status">
              {failed ? "3D preview unavailable in this browser." : "Loading 3D avatar…"}
            </p>
          )}
        </div>
        <figcaption className="avatar-preview__caption">
          <p id="avatar-hint">Move close or tap the avatar.</p>
          <div className="avatar-preview__styles" role="group" aria-label="Avatar style">
            {styles.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                disabled={failed}
                aria-pressed={style === id}
                onClick={() => {
                  if (style === id) return;
                  setReady(false);
                  interaction.current.touchedAt = -Infinity;
                  setStyle(id);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
