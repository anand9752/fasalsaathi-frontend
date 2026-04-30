import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CalendarDays, ChevronDown, ImageOff, Loader2, Newspaper, RefreshCw, ExternalLink, Clock, AlertTriangle } from "lucide-react";

import { kisanNewsApi } from "../services/api";
import { KisanNewsArticle, KisanNewsResponse } from "../types/api";
import { Badge } from "./ui/badge";

const tagStyles: Record<string, string> = {
  farmer: "bg-emerald-100/80 text-emerald-800 border-emerald-200/50",
  mandi: "bg-amber-100/80 text-amber-800 border-amber-200/50",
  crop: "bg-lime-100/80 text-lime-800 border-lime-200/50",
  fertilizer: "bg-sky-100/80 text-sky-800 border-sky-200/50",
  kisan: "bg-green-100/80 text-green-800 border-green-200/50",
  agriculture: "bg-slate-100/80 text-slate-800 border-slate-200/50",
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
  if (!value) return "Stay updated with the latest farming news, mandi rates, and agricultural policies across India.";
  return value.length > 120 ? `${value.slice(0, 117).trim()}...` : value;
}

function NewsImage({ article }: { article: KisanNewsArticle }) {
  const [failed, setFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!article.image_url || failed) {
    return (
      <div className="h-48 w-full bg-gradient-to-br from-[#f0f8f4] to-[#e6f2eb] border-b border-[#03402d]/10 flex items-center justify-center text-[#03402d]/40 relative overflow-hidden group-hover:bg-[#e6f2eb] transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2303402d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="flex flex-col items-center gap-2 relative z-10 scale-90 group-hover:scale-100 transition-transform duration-500">
          <div className="p-3 rounded-full bg-white/50 border border-white/80 shadow-sm">
            <ImageOff size={24} />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#03402d]/60">Kisan Feed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100 relative group">
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 flex items-center justify-center">
          <Newspaper className="text-slate-300" size={24} />
        </div>
      )}
      <img
        src={article.image_url}
        alt={article.title}
        className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-90 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
         <div className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
            <ExternalLink size={14} />
         </div>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-6 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 w-full bg-slate-200 rounded-lg" />
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
        <div className="h-16 w-full bg-slate-100 rounded-xl mt-2" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function NewsCard({ article, index }: { article: KisanNewsArticle; index: number }) {
  const tags = article.tags?.length ? article.tags : ["agriculture"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
      className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(3,64,45,0.12)] hover:border-[#03402d]/20 transition-all duration-500 flex flex-col min-h-[28rem]"
    >
      <div className="relative">
        <NewsImage article={article} />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {tags.slice(0, 1).map((tag) => (
            <div key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${tagStyles[tag] || tagStyles.agriculture} shadow-sm`}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Clock size={12} />
           {formatDate(article.pubDate)}
        </div>

        <h3 className="font-['Poppins'] text-[1.1rem] font-bold leading-[1.4] text-slate-900 mb-3 group-hover:text-[#03402d] transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-500 leading-[1.6] mb-6 line-clamp-3 font-medium italic border-l-2 border-[#03402d]/10 pl-3">
          {trimDescription(article.description)}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex -space-x-1 overflow-hidden">
             {tags.slice(1, 3).map((tag, i) => (
               <div key={tag} className={`w-2 h-2 rounded-full border border-white ${tag === 'mandi' ? 'bg-amber-400' : 'bg-emerald-400'}`} title={tag} />
             ))}
          </div>
          
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-2xl !bg-[#03402d] !text-white px-6 py-3 text-[13px] font-extrabold shadow-[0_10px_20px_rgba(3,64,45,0.3)] hover:!bg-[#011e14] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn"
          >
            Read More
            <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform stroke-[2.5px]" />
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
  const [visibleCount, setVisibleCount] = useState(6);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (forceRefresh = false) => {
    forceRefresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const response = await kisanNewsApi.getNews({ forceRefresh, limit: 10 });
      setData(response);
      setVisibleCount(6);
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="fs-db-card !border-0 !shadow-none !bg-transparent overflow-visible">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#03402d] rounded-full hidden md:block" />
            <h2 className="text-3xl font-extrabold text-[#011e14] font-['Poppins'] flex items-center gap-3 tracking-tight">
              <span className="p-2.5 rounded-2xl bg-[#03402d]/5 text-[#03402d]">
                <Newspaper size={28} />
              </span>
              Kisan News Feed
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-2 max-w-md">
              Real-time intelligence on mandis, crops, and government policies curated for you.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => loadNews(true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-700 font-bold text-sm hover:border-[#03402d] hover:text-[#03402d] hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
          >
            <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Update Feed'}
          </button>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="news-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(3)].map((_, i) => (
                  <NewsSkeleton key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="news-error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[2.5rem] border border-red-100 bg-red-50/50 p-12 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                   <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-bold text-red-950 mb-1">Feed Temporarily Unavailable</h3>
                <p className="text-red-700/70 font-medium max-w-sm">{error}</p>
                <button 
                  onClick={() => loadNews()} 
                  className="mt-6 px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : !visibleArticles.length ? (
              <motion.div
                key="news-empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[2.5rem] border-2 border-dashed border-[#03402d]/20 bg-[#f0f8f4]/40 p-16 text-center"
              >
                <div className="w-20 h-20 bg-[#03402d]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#03402d]/40">
                  <Newspaper size={40} />
                </div>
                <h3 className="text-xl font-bold text-[#011e14] mb-2">No News Found</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  {data?.message || "Check back soon for the latest agricultural updates."}
                </p>
              </motion.div>
            ) : (
              <motion.div key="news-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  {data?.is_stale && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200 shadow-sm">
                      <Clock size={12} />
                      Showing Offline Feed
                    </div>
                  )}
                  {data?.refreshed_at && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
                      Last Updated: {new Date(data.refreshed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {visibleArticles.map((article, index) => (
                    <NewsCard key={`${article.link}-${index}`} article={article} index={index} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-12 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <button
                      type="button"
                      className="relative z-10 flex items-center gap-2 px-10 py-4 rounded-2xl !bg-[#03402d] !text-white font-extrabold text-sm shadow-[0_15px_30px_rgba(3,64,45,0.25)] hover:!bg-[#011e14] hover:scale-105 active:scale-95 transition-all duration-300"
                      onClick={() => setVisibleCount((count) => Math.min(count + 3, data?.articles.length || count))}
                    >
                      Show More Articles <ChevronDown size={20} className="stroke-[3px]" />
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
