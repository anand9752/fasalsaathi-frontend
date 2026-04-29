import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CalendarDays, ChevronDown, ImageOff, Loader2, Newspaper, RefreshCw } from "lucide-react";

import { kisanNewsApi } from "../services/api";
import { KisanNewsArticle, KisanNewsResponse } from "../types/api";
import { Badge } from "./ui/badge";


const tagStyles: Record<string, string> = {
  farmer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  mandi: "bg-amber-50 text-amber-700 border-amber-200",
  crop: "bg-lime-50 text-lime-700 border-lime-200",
  fertilizer: "bg-sky-50 text-sky-700 border-sky-200",
  kisan: "bg-green-50 text-green-700 border-green-200",
  agriculture: "bg-slate-50 text-slate-700 border-slate-200",
};

function formatDate(value?: string | null) {
  if (!value) return "Recently published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function trimDescription(value?: string | null) {
  if (!value) return "Tap through to read the latest update for Indian farmers.";
  return value.length > 150 ? `${value.slice(0, 147).trim()}...` : value;
}

function NewsImage({ article }: { article: KisanNewsArticle }) {
  const [failed, setFailed] = useState(false);

  if (!article.image_url || failed) {
    return (
      <div className="h-40 w-full bg-[#f0f8f4] border-b border-[#03402d]/10 flex items-center justify-center text-[#03402d]">
        <div className="flex flex-col items-center gap-2">
          <ImageOff size={28} />
          <span className="text-xs font-bold uppercase tracking-wider">Kisan News</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-40 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
      <img
        src={article.image_url}
        alt={article.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function NewsCard({ article, index }: { article: KisanNewsArticle; index: number }) {
  const tags = article.tags?.length ? article.tags : ["agriculture"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#03402d]/25 transition-shadow duration-300 flex flex-col min-h-[25rem]"
    >
      <NewsImage article={article} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className={`capitalize text-[11px] font-bold ${tagStyles[tag] || tagStyles.agriculture}`}>
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="font-['Poppins'] text-base font-bold leading-snug text-slate-950 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {trimDescription(article.description)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <CalendarDays size={14} />
            {formatDate(article.pubDate)}
          </span>
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#03402d] px-3 py-2 text-xs font-bold text-white shadow-sm shadow-[#03402d]/20 hover:bg-[#011e14] transition-colors"
          >
            Read More <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function KisanNewsFeed() {
  const [data, setData] = useState<KisanNewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (forceRefresh = false) => {
    forceRefresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const response = await kisanNewsApi.getNews({ forceRefresh, limit: 10 });
      setData(response);
      setVisibleCount(5);
    } catch (err: any) {
      setError(err?.message || "Unable to load agriculture news right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const visibleArticles = useMemo(
    () => (data?.articles || []).slice(0, visibleCount),
    [data?.articles, visibleCount]
  );
  const hasMore = (data?.articles?.length || 0) > visibleCount;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-8"
    >
      <div className="fs-db-card">
        <div className="fs-db-card-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="fs-db-card-title text-[#011e14] justify-start">
                <span className="flex items-center gap-2">
                  <Newspaper className="text-[#03402d]" />
                  Kisan News Feed
                </span>
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Latest farmer, mandi, crop, and fertilizer updates from India.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadNews(true)}
              disabled={isRefreshing || isLoading}
              className="fs-db-btn fs-db-btn-outline shrink-0 px-4 py-2.5 disabled:opacity-60"
            >
              {isRefreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh
            </button>
          </div>
        </div>

        <div className="fs-db-card-body">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="news-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-[#03402d]"
              >
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <p className="font-bold font-['Poppins']">Loading farm news...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="news-error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
              >
                <p className="font-bold text-red-900">{error}</p>
              </motion.div>
            ) : !visibleArticles.length ? (
              <motion.div
                key="news-empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-dashed border-[#03402d]/20 bg-[#f0f8f4]/60 p-8 text-center"
              >
                <Newspaper className="mx-auto mb-3 text-[#03402d]" size={34} />
                <p className="font-bold text-[#011e14]">{data?.message || "No agriculture news available right now."}</p>
              </motion.div>
            ) : (
              <motion.div key="news-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <p className="text-sm font-semibold text-slate-500">
                    {data?.message}
                  </p>
                  {data?.is_stale && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Saved news
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {visibleArticles.map((article, index) => (
                    <NewsCard key={`${article.link}-${index}`} article={article} index={index} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      className="fs-db-btn fs-db-btn-outline px-5 py-2.5"
                      onClick={() => setVisibleCount((count) => Math.min(count + 5, data?.articles.length || count))}
                    >
                      Show More <ChevronDown size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

