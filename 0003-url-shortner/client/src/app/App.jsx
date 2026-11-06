import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Scissors,
} from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [copied, setCopied] = useState(null);

  const getUrls = async () => {
    const res = await axios.get("/api/urls");

    setLinks(res.data.urls);
  };

  const handleCreate = async (data) => {
    const res = await axios.post("/api/urls/create", data);

    setShortenedUrl(`http://localhost:3000/${res.data.data.url.shortUrl}`);

    await getUrls();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/urls/${id}`);
    await getUrls();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await handleCreate(data);
    await getUrls();

    reset();
  };

  const handleCopy = async (url, id = "result") => {
    try {
      await navigator.clipboard.writeText(`${url}`);
      setCopied(id);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  useEffect(() => {
    getUrls();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f4ed] px-4 py-8 text-[#151515] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] text-white">
              <Scissors size={18} />
            </div>

            <span className="text-sm font-medium tracking-wide text-[#777064]">
              URL SHORTENER
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Long links?
          </h1>

          <p className="mt-2 max-w-xl text-base text-[#70695e] sm:text-lg">
            Paste a link, get a short one, and see how many people clicked it.
          </p>
        </header>

        {/* Main card */}
        <section className="rounded-2xl border border-[#d8d1c2] bg-[#fbfaf7] p-5 shadow-sm sm:p-8">
          {/* Create URL */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1">
                <label htmlFor="longUrl" className="sr-only">
                  Long URL
                </label>

                <input
                  id="longUrl"
                  type="text"
                  placeholder="Paste a long URL here..."
                  {...register("longUrl", {
                    required: "Please enter a URL",

                    maxLength: {
                      value: 2048,
                      message: "URL is too long",
                    },

                    validate: (value) => {
                      if (
                        !value.startsWith("http://") &&
                        !value.startsWith("https://")
                      ) {
                        return "Please enter a valid URL starting with http:// or https://";
                      }
                    },
                  })}
                  className={`h-14 w-full rounded-xl border bg-white px-4 font-mono text-sm outline-none transition focus:ring-2 ${
                    errors.longUrl
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#d5cfc1] focus:border-[#151515] focus:ring-[#e8e3d8]"
                  }`}
                />

                {/* Error */}
                {errors.longUrl && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.longUrl.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#151515] px-6 text-sm font-semibold text-white transition hover:bg-[#2c2c2c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Link2 size={17} />

                {isSubmitting ? "Shortening..." : "Shorten"}
              </button>
            </div>
          </form>

          {/* Generated URL */}
          {shortenedUrl && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#ddd6c8] bg-[#f7f4ed] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#898174]">
                  Your short URL
                </p>

                <a
                  href={`http://${shortenedUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate font-mono text-lg font-medium text-[#d84d20] hover:underline"
                >
                  {shortenedUrl}
                </a>
              </div>

              <button
                onClick={() => handleCopy(shortenedUrl)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d5cfc1] bg-white px-4 py-2 text-sm font-medium text-[#625c52] transition hover:bg-[#eeeae1]"
              >
                {copied === "result" ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="my-8 h-px bg-[#e2ddd2]" />

          {/* Links */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Your links</h2>
                <p className="mt-1 text-sm text-[#817a6e]">
                  Your recently shortened URLs
                </p>
              </div>

              <span className="rounded-full bg-[#ebe6dc] px-3 py-1 text-sm font-medium text-[#655f55]">
                {links.length}
              </span>
            </div>

            {/* Empty state */}
            {links.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#d5cfc1] px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#eeeae1]">
                  <Link2 size={19} className="text-[#777064]" />
                </div>

                <p className="font-medium">No links yet</p>

                <p className="mt-1 text-sm text-[#817a6e]">
                  Shorten your first URL above.
                </p>
              </div>
            )}

            {/* Link list */}
            {links.length > 0 && (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link._id}
                    className="rounded-xl border border-[#ddd6c8] bg-white p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Short URL */}
                      <div className="min-w-0 sm:w-32">
                        <a
                          href={`http://localhost:3000/${link.shortUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-medium text-[#d84d20] hover:underline"
                        >
                          {link.shortUrl}
                        </a>
                      </div>

                      {/* Original URL */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[#6e685e]">
                          {link.longUrl}
                        </p>
                      </div>

                      {/* Clicks */}
                      <div className="font-mono text-sm whitespace-nowrap text-[#292929]">
                        {link.clicks} clicks
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleCopy(
                              `localhost:3000/${link.shortUrl}`,
                              link._id,
                            )
                          }
                          className="rounded-lg border border-[#d8d1c2] p-2 text-[#70695e] transition hover:bg-[#f3f0e9]"
                          title="Copy"
                        >
                          {copied === link._id ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(link._id)}
                          className="rounded-lg border border-[#d8d1c2] p-2 text-[#70695e] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                        <a
                          href={`http://localhost:3000/${link.shortUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-[#d8d1c2] p-2 text-[#70695e] transition hover:bg-[#f3f0e9]"
                          title="Open"
                          onClick={async () => {
                            await getUrls();
                          }}
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#938b7d]">
          Simple links. No accounts. No unnecessary complexity.
        </p>
      </div>
    </main>
  );
};

export default App;
