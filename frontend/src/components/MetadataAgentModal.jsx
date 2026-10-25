import React, { useState } from "react";
import api, { mediaUrl } from "../api/client";

/* ── Inline SVG icons (no emoji, no extra deps) ─────────────────────────── */
const SparklesIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/>
    <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z"/>
  </svg>
);
const BookOpenIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const ImageIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const AlertTriangleIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckCircleIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const DownloadIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const CopyIcon = ({ size = 12, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const RefreshIcon = ({ size = 13, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

/**
 * MetadataAgentModal
 * ------------------
 * Opened from the /write page (story card Edit button area).
 * Calls POST /api/stories/<id>/suggest-metadata which reads ALL chapters.
 *
 * Actions:
 *   - "Apply to Story" -> POST /api/stories/<id>/apply-metadata
 *   - "Generate Cover" -> POST /api/stories/<id>/generate-cover
 */
export default function MetadataAgentModal({ storyId, storyTitle, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // Apply to Story state
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // Cover generation state
  const [generatingCover, setGeneratingCover] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  const analyse = async () => {
    setPhase("loading");
    setErrorMsg("");
    setApplied(false);
    try {
      const { data } = await api.post(`/stories/${storyId}/suggest-metadata`);
      setResult(data.metadata);
      setPhase("done");
    } catch (e) {
      setErrorMsg(
        e.response?.data?.error ||
        "The agent could not analyse this story. Make sure it has at least one saved chapter."
      );
      setPhase("error");
    }
  };

  const copyBlurb = () => {
    if (!result?.blurb) return;
    navigator.clipboard.writeText(result.blurb).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const applyToStory = async () => {
    if (!result) return;
    setApplying(true);
    try {
      await api.post(`/stories/${storyId}/apply-metadata`, result);
      setApplied(true);
    } catch (e) {
      alert(e.response?.data?.error || "Could not apply metadata to story.");
    } finally {
      setApplying(false);
    }
  };

  const handleGenerateCover = async () => {
    setGeneratingCover(true);
    try {
      const { data } = await api.post(`/stories/${storyId}/generate-cover`);
      if (data.cover_url) {
        setCoverUrl(mediaUrl(data.cover_url));
      }
    } catch (e) {
      alert(e.response?.data?.error || "Could not generate cover.");
    } finally {
      setGeneratingCover(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-['Playfair_Display'] text-xl font-bold flex items-center gap-2">
              <SparklesIcon size={20} className="text-accent" />
              Story Metadata Agent
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">
              <em>{storyTitle || "Your story"}</em> — all chapters
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* ── Idle ── */}
        {phase === "idle" && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
              <BookOpenIcon size={28} />
            </div>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed max-w-sm mx-auto">
              Your <strong>Story Metadata Agent</strong> reads{" "}
              <strong>all chapters</strong> of this book, runs editorial
              Chain-of-Thought reasoning, and produces publication-ready metadata.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              The results feed directly into Leaf's{" "}
              <strong>Recommendation Agent</strong> for reader discovery.
            </p>
            <button
              onClick={analyse}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Analyse full story
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {phase === "loading" && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Analysing your story with AI…</p>
            <p className="text-xs text-muted-foreground mt-1 opacity-70">
              Reading all chapters · extracting blurb, genres, tags &amp; warnings
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {phase === "error" && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3 text-amber-500">
              <AlertTriangleIcon size={32} />
            </div>
            <p className="text-sm text-red-600 mb-5">{errorMsg}</p>
            <button
              onClick={analyse}
              className="text-sm bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:opacity-90"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Results ── */}
        {phase === "done" && result && (
          <div className="space-y-4">

            {/* Sync confirmation notification */}
            {applied && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircleIcon size={15} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Applied to story!</strong> The Recommendation Agent has automatically re-indexed this novel for semantic search.
                </span>
              </div>
            )}

            {/* Blurb */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Editorial Blurb
                </p>
                <button
                  onClick={copyBlurb}
                  className="text-xs text-accent hover:underline font-medium flex items-center gap-1"
                >
                  <CopyIcon size={11} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="font-['Lora'] text-sm leading-relaxed">{result.blurb}</p>
            </div>

            {/* Genres & Warnings side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Genres */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Genres (Leaf Taxonomy)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.genres?.length > 0 ? (
                    result.genres.map((g) => (
                      <span
                        key={g}
                        className="text-xs bg-accent/20 text-accent-foreground px-2.5 py-1 rounded-full font-medium"
                      >
                        {g}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>

              {/* Content Warnings */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Content Warnings
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.content_warnings?.length > 0 ? (
                    result.content_warnings.map((w) => (
                      <span
                        key={w}
                        className="text-xs bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                      >
                        <AlertTriangleIcon size={11} className="text-amber-600" />
                        {w}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Clean (no warnings)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {result.tags?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Suggested Discovery Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full"
                    >
                      #{t.replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Generator Preview Card */}
            <div className="border border-border/80 bg-card rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Book Cover Preview"
                    className="w-12 h-16 object-cover rounded-lg shadow-sm border border-border"
                  />
                ) : (
                  <div className="w-12 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={22} />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground">AI Book Cover</p>
                  <p className="text-[11px] text-muted-foreground">
                    {coverUrl ? "New cover saved to story!" : "Generate an artistic cover from title & genre"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateCover}
                disabled={generatingCover}
                className="text-xs bg-secondary hover:bg-muted text-foreground px-3 py-2 rounded-lg font-medium transition-colors border border-border disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                <ImageIcon size={12} />
                {generatingCover ? "Generating…" : coverUrl ? "Regenerate" : "Generate Cover"}
              </button>
            </div>

            {/* Latency & model info */}
            <p className="text-[11px] text-muted-foreground text-right">
              Generated in {result.latency_ms?.toFixed(0)} ms · prompt <code>{result.prompt_version}</code>
            </p>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
              <button
                onClick={analyse}
                className="text-xs border border-border py-2.5 px-4 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex items-center justify-center gap-1.5"
              >
                <RefreshIcon size={12} />
                Regenerate AI
              </button>

              <button
                onClick={applyToStory}
                disabled={applying || applied}
                className={`flex-1 text-xs py-2.5 px-4 rounded-xl font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                  applied
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {applied ? (
                  <><CheckCircleIcon size={13} /> Applied to Story</>
                ) : applying ? (
                  "Applying to Story…"
                ) : (
                  <><DownloadIcon size={13} /> Apply to Story</>
                )}
              </button>

              <button
                onClick={onClose}
                className="text-xs bg-primary text-primary-foreground py-2.5 px-5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
