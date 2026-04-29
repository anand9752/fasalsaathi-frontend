import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, Edit, Trash2, Package,
  AlertTriangle, Grid3X3, List, CheckCircle, X, Loader2,
  ChevronLeft, ChevronRight, TrendingUp, Layers
} from "lucide-react";

import { inventoryApi } from "../services/api";
import type { InventoryCategory, InventoryItem, InventoryStats } from "../types/api";
import { useLanguage, SpeakerButton } from "./language-context";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const CATEGORIES: Record<string, { label: string; icon: string; theme: string }> = {
  fertilizer: { label: "उर्वरक (Fertilizer)", icon: "🌱", theme: "emerald" },
  seeds:       { label: "बीज (Seeds)",        icon: "🌾", theme: "amber" },
  pesticide:   { label: "कीटनाशक (Pesticide)", icon: "🐛", theme: "rose" },
  equipment:   { label: "उपकरण (Equipment)",  icon: "🚜", theme: "blue" },
  other:       { label: "अन्य (Other)",       icon: "📦", theme: "slate" },
};

const EMPTY_FORM = {
  name: "", name_hindi: "", category: "fertilizer" as InventoryCategory,
  quantity: 0, unit: "kg", low_stock_threshold: 0, cost: 0,
  supplier: "", expiry_date: "",
};

const ITEMS_PER_PAGE = 6;

export function InventoryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // ── data fetching ──────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, statsRes] = await Promise.all([
        inventoryApi.list({
          category: filterCategory !== "all" ? filterCategory : undefined,
          low_stock_only: showLowStockOnly || undefined,
          search: searchTerm || undefined,
        }),
        inventoryApi.getStats(),
      ]);
      setItems(itemsRes);
      setStats(statsRes);
    } catch {
      setError("डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें। (Error loading data)");
    } finally {
      setLoading(false);
    }
  }, [filterCategory, showLowStockOnly, searchTerm]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Reset pagination when filter results change
  useEffect(() => { setCurrentPage(1); }, [items, searchTerm, filterCategory, showLowStockOnly]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const resetForm = () => setFormData({ ...EMPTY_FORM });

  const openEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name, name_hindi: item.name_hindi, category: item.category,
      quantity: item.quantity, unit: item.unit,
      low_stock_threshold: item.low_stock_threshold,
      cost: item.cost, supplier: item.supplier,
      expiry_date: item.expiry_date ?? "",
    });
    setEditingItem(item);
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      await inventoryApi.create({
        ...formData,
        expiry_date: formData.expiry_date || null,
      });
      resetForm();
      setIsAddOpen(false);
      fetchAll();
    } catch {
      setError("आइटम जोड़ने में त्रुटि। (Error adding item)");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      await inventoryApi.update(editingItem.id, {
        ...formData,
        expiry_date: formData.expiry_date || null,
      });
      setEditingItem(null);
      resetForm();
      fetchAll();
    } catch {
      setError("आइटम अपडेट करने में त्रुटि। (Error updating item)");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("क्या आप निश्चित रूप से इस आइटम को हटाना चाहते हैं? (Are you sure you want to delete this item?)")) return;
    try {
      await inventoryApi.delete(id);
      fetchAll();
    } catch {
      setError("आइटम हटाने में त्रुटि। (Error deleting item)");
    }
  };

  const lowStockItems = items.filter(i => i.is_low_stock);

  // Pagination Logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --in-bg: #f8fafc; --in-card: #ffffff;
          --in-text: #0f172a; --in-muted: #64748b;
          --in-border: #e2e8f0; --in-border-light: #f1f5f9;
          --in-primary: #10b981; --in-primary-dark: #059669; --in-primary-light: #ecfdf5;
          --in-shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --in-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --in-shadow-hover: 0 20px 25px -5px rgba(16, 185, 129, 0.15);
        }

        .fs-in-wrapper { font-family: 'Inter', sans-serif; background: var(--in-bg); min-height: 100vh; padding-bottom: 5rem; color: var(--in-text); }
        .fs-in-container { max-width: 85rem; margin: 0 auto; padding: 2.5rem 1.5rem; }

        /* HERO & HEADER */
        .fs-in-hero { background: linear-gradient(135deg, #064e3b 0%, var(--in-primary) 100%); border-radius: 1.5rem; padding: 2.5rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3); margin-bottom: 2.5rem; }
        .fs-in-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
        .fs-in-h1 { font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem; }
        .fs-in-p { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--in-primary-light); font-weight: 500; max-width: 48rem; }
        
        .fs-in-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 0.5rem 1.25rem; border-radius: 999px; font-size: 0.875rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); margin-bottom: 1.5rem; box-shadow: var(--in-shadow-sm); }

        /* STATS METRICS (Floating over Hero) */
        .fs-in-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; position: relative; z-index: 10; }
        @media (min-width: 1024px) { .fs-in-stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .fs-in-stat-chip { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 1.25rem 1.5rem; border-radius: 1.25rem; display: flex; flex-direction: column; justify-content: center; transition: all 0.3s ease; }
        .fs-in-stat-chip:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .fs-in-stat-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.375rem; }
        .fs-in-stat-val { font-size: 1.75rem; font-weight: 700; color: white; font-family: 'Poppins'; line-height: 1; }

        /* COMMAND CENTER */
        .fs-in-command-box { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border: 1px solid var(--in-border); border-radius: 1.5rem; padding: 1.5rem; box-shadow: var(--in-shadow); margin-bottom: 2.5rem; }
        .fs-in-input { width: 100%; padding: 0.75rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--in-border); background: var(--in-bg); color: var(--in-text); outline: none; transition: all 0.2s; font-family: inherit; font-size: 0.95rem; font-weight: 500; }
        .fs-in-input:focus { border-color: var(--in-primary); box-shadow: 0 0 0 3px var(--in-primary-light); background: var(--in-card); }
        .fs-in-select { padding: 0.75rem 1.25rem; border-radius: 0.75rem; border: 1px solid var(--in-border); background: var(--in-bg); outline: none; font-weight: 500; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .fs-in-select:focus { border-color: var(--in-primary); box-shadow: 0 0 0 3px var(--in-primary-light); }

        /* BUTTONS */
        .fs-in-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.875rem 1.5rem; border-radius: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; }
        .fs-in-btn-primary { background: var(--in-primary); color: #ffffff; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2); }
        .fs-in-btn-primary:hover:not(:disabled) { background: var(--in-primary-dark); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3); }
        .fs-in-btn-outline { background: var(--in-card); color: var(--in-text); border: 1px solid var(--in-border); box-shadow: var(--in-shadow-sm); }
        .fs-in-btn-outline:hover:not(:disabled) { background: var(--in-border-light); transform: translateY(-1px); }
        .fs-in-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

        /* TOGGLE BUTTONS */
        .fs-in-toggle-wrap { display: inline-flex; background: var(--in-border-light); padding: 0.25rem; border-radius: 0.75rem; border: 1px solid var(--in-border); }
        .fs-in-toggle-btn { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; border: none; background: transparent; color: var(--in-muted); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.375rem; }
        .fs-in-toggle-btn.active { background: white; color: var(--in-primary-dark); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        /* CARDS (Grid View) */
        .fs-in-card { background: var(--in-card); border-radius: 1.5rem; border: 1px solid var(--in-border); box-shadow: var(--in-shadow-sm); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s ease; height: 100%; position: relative; }
        .fs-in-card:hover { transform: translateY(-6px); box-shadow: var(--in-shadow-hover); border-color: var(--in-primary); }
        .fs-in-card.low-stock { border-color: #fca5a5; background: #fff5f5; }
        .fs-in-card.low-stock:hover { border-color: #ef4444; box-shadow: 0 20px 25px -5px rgba(239, 68, 68, 0.15); }
        
        .fs-in-card-header { padding: 1.5rem 1.5rem 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
        .fs-in-card-body { padding: 0 1.5rem 1.5rem; flex: 1; display: flex; flex-direction: column; }

        /* ALERTS */
        .fs-in-alert { padding: 1rem 1.25rem; border-radius: 1rem; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; box-shadow: var(--in-shadow-sm); }
        .fs-in-alert.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        /* PAGINATION */
        .fs-in-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; margin-top: 1rem; }
        .fs-in-page-btn { display: flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; border: 1px solid var(--in-border); background: var(--in-card); color: var(--in-text); font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .fs-in-page-btn:hover:not(:disabled) { background: var(--in-border-light); border-color: var(--in-primary); }
        .fs-in-page-btn.active { background: var(--in-primary); color: white; border-color: var(--in-primary); }
        .fs-in-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="fs-in-wrapper">
        <div className="fs-in-container">
          
          {/* ─── HERO HEADER & STATS ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fs-in-hero">
            <div className="relative z-10">
              <div className="fs-in-badge">
                <Package size={16} /> Asset Tracking
              </div>
              <h1 className="fs-in-h1">
                {t("inventory", "Farm Inventory")}
                <SpeakerButton text="इन्वेंटरी प्रबंधन - खेत की सभी सामग्री की सूची" className="text-white hover:bg-white/20" />
              </h1>
              <p className="fs-in-p">Manage your seeds, fertilizers, pesticides, and equipment effortlessly.</p>
            </div>

            <div className="fs-in-stat-grid">
              <div className="fs-in-stat-chip">
                <span className="fs-in-stat-lbl"><Layers size={14} className="text-blue-300"/> Total Items</span>
                <span className="fs-in-stat-val">{stats?.total_items ?? items.length}</span>
              </div>
              <div className="fs-in-stat-chip" style={{ background: (stats?.low_stock_count ?? lowStockItems.length) > 0 ? 'rgba(220, 38, 38, 0.2)' : '' }}>
                <span className="fs-in-stat-lbl"><AlertTriangle size={14} className="text-rose-300"/> Low Stock</span>
                <span className="fs-in-stat-val text-rose-200">{stats?.low_stock_count ?? lowStockItems.length}</span>
              </div>
              <div className="fs-in-stat-chip">
                <span className="fs-in-stat-lbl"><TrendingUp size={14} className="text-emerald-300"/> Total Value</span>
                <span className="fs-in-stat-val">₹{(stats?.total_value ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="fs-in-stat-chip">
                <span className="fs-in-stat-lbl"><Grid3X3 size={14} className="text-amber-300"/> Categories</span>
                <span className="fs-in-stat-val">{stats?.categories_count ?? Object.keys(CATEGORIES).length}</span>
              </div>
            </div>
          </motion.div>

          {/* ─── ERROR BANNER ─── */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="fs-in-alert error">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="flex-1">{error}</span>
                  <button onClick={() => setError(null)} className="p-1 hover:bg-red-200 rounded-md"><X className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── LOW STOCK ALERTS ─── */}
          <AnimatePresence>
            {lowStockItems.length > 0 && !showLowStockOnly && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5" /> 
                    Attention: Low Stock Items
                    <SpeakerButton text={`${lowStockItems.length} आइटम्स में कम स्टॉक है`} className="ml-2 hover:bg-red-100 text-red-700" />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lowStockItems.map(item => (
                      <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-100 text-red-800 text-sm font-semibold border border-red-200 shadow-sm">
                        {item.name_hindi || item.name} <span className="opacity-60 text-xs">({item.quantity} {item.unit})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── COMMAND CENTER ─── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="fs-in-command-box">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
                
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="fs-in-select flex-1 sm:max-w-[200px]">
                  <option value="all">All Categories</option>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.icon} {cat.label}</option>
                  ))}
                </select>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                  <Switch checked={showLowStockOnly} onCheckedChange={setShowLowStockOnly} id="low-stock-mode" />
                  <Label htmlFor="low-stock-mode" className="font-semibold text-sm cursor-pointer text-slate-700">Low Stock</Label>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                <div className="fs-in-toggle-wrap">
                  <button className={`fs-in-toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
                    <Grid3X3 className="w-4 h-4" /> Grid
                  </button>
                  <button className={`fs-in-toggle-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")}>
                    <List className="w-4 h-4" /> Table
                  </button>
                </div>
                <button className="fs-in-btn fs-in-btn-primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
                  <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Add Item</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* ─── MAIN CONTENT ─── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-bold text-lg">Loading Inventory...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl shadow-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Package size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Items Found</h3>
              <p className="text-slate-500 mb-6 font-medium">Your inventory is empty or no items match your search.</p>
              <button className="fs-in-btn fs-in-btn-primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
                <Plus className="w-5 h-5" /> Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* GRID VIEW */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {paginatedItems.map((item, index) => {
                      const catDef = CATEGORIES[item.category] || CATEGORIES.other;
                      const isLow = item.is_low_stock;
                      
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={item.id}
                        >
                          <div className={`fs-in-card p-5 ${isLow ? 'low-stock' : ''}`}>
                            {isLow && (
                              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-red-200 shadow-sm z-10">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Refill
                              </div>
                            )}

                            <div className="fs-in-card-header">
                              <div className="flex items-start gap-4 pr-16">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${isLow ? 'bg-white border border-red-100' : 'bg-slate-50 border border-slate-100'}`}>
                                  {catDef.icon}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight" style={{ fontFamily: 'Poppins' }}>
                                    {item.name_hindi || item.name}
                                  </h3>
                                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{item.name}</p>
                                </div>
                              </div>
                            </div>

                            <div className="fs-in-card-body pt-5">
                              <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className={`p-3 rounded-xl border ${isLow ? 'bg-white border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">In Stock</p>
                                  <p className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'}`}>{item.quantity} <span className="text-sm font-semibold opacity-70">{item.unit}</span></p>
                                </div>
                                <div className={`p-3 rounded-xl border ${isLow ? 'bg-white border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cost / Unit</p>
                                  <p className="text-xl font-bold text-slate-800">₹{item.cost}</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-6 text-sm font-medium">
                                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 mt-4">
                                  <span className="text-slate-500">Category</span>
                                  <span className="text-slate-800 font-semibold">{catDef.label}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                                  <span className="text-slate-500">Min. Threshold</span>
                                  <span className="text-slate-800 font-semibold">{item.low_stock_threshold} {item.unit}</span>
                                </div>
                                {item.expiry_date && (
                                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                                    <span className="text-slate-500">Expires</span>
                                    <span className="text-amber-700 font-semibold">{new Date(item.expiry_date).toLocaleDateString('en-IN')}</span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-auto flex gap-2">
                                <button className="flex-1 fs-in-btn fs-in-btn-outline" onClick={() => openEdit(item)}>
                                  <Edit size={16} /> Edit
                                </button>
                                <button className="px-4 fs-in-btn fs-in-btn-outline text-rose-600 hover:bg-rose-50 hover:border-rose-200" onClick={() => handleDelete(item.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {/* TABLE VIEW */}
              {viewMode === "table" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-bold text-slate-700 py-4">Item Details</TableHead>
                          <TableHead className="font-bold text-slate-700 py-4">Category</TableHead>
                          <TableHead className="font-bold text-slate-700 py-4 text-right">In Stock</TableHead>
                          <TableHead className="font-bold text-slate-700 py-4 text-right">Cost</TableHead>
                          <TableHead className="font-bold text-slate-700 py-4">Status / Expiry</TableHead>
                          <TableHead className="font-bold text-slate-700 py-4 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {paginatedItems.map(item => {
                            const catDef = CATEGORIES[item.category] || CATEGORIES.other;
                            return (
                              <TableRow key={item.id} className={`transition-colors hover:bg-slate-50 ${item.is_low_stock ? "bg-red-50/50 hover:bg-red-50" : ""}`}>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm shrink-0">
                                      {catDef.icon}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{item.name_hindi || item.name}</p>
                                      <p className="text-xs font-semibold text-slate-500 uppercase">{item.name}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 font-medium text-slate-700">
                                  {catDef.label}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                  <span className={`font-bold text-lg ${item.is_low_stock ? "text-red-600" : "text-emerald-600"}`}>
                                    {item.quantity} <span className="text-xs">{item.unit}</span>
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Min: {item.low_stock_threshold}</p>
                                </TableCell>
                                <TableCell className="py-4 text-right font-bold text-slate-800">
                                  ₹{item.cost}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex flex-col gap-1 items-start">
                                    {item.is_low_stock && (
                                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Refill
                                      </span>
                                    )}
                                    {item.expiry_date ? (
                                      <span className="text-xs font-medium text-slate-500">Exp: {new Date(item.expiry_date).toLocaleDateString('en-GB')}</span>
                                    ) : (
                                      <span className="text-xs font-medium text-slate-400">-</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm" onClick={() => openEdit(item)}>
                                      <Edit size={16} />
                                    </button>
                                    <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm" onClick={() => handleDelete(item.id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              )}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="fs-in-pagination">
                  <span className="text-sm font-semibold text-slate-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of {items.length}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="fs-in-page-btn">
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="hidden sm:flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                        }
                        return (
                          <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`fs-in-page-btn ${currentPage === pageNum ? 'active' : ''}`}>
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="fs-in-page-btn">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ─── ADD / EDIT MODAL (CRASH FIXED) ─── */}
      <Dialog open={isAddOpen || !!editingItem} onOpenChange={open => { if (!open) { resetForm(); setIsAddOpen(false); setEditingItem(null); } }}>
        <DialogContent className="p-0 overflow-hidden border-0 bg-white rounded-3xl shadow-2xl sm:max-w-xl">
          <DialogHeader className="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
            <DialogTitle className="text-xl font-bold text-emerald-900" style={{ fontFamily: 'Poppins' }}>
              {editingItem ? "Edit Inventory Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-emerald-700">
              Keep your farm records up to date to ensure accurate stock alerts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <ItemForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={editingItem ? handleEdit : handleAdd} 
              onCancel={() => { resetForm(); setIsAddOpen(false); setEditingItem(null); }} 
              saving={saving} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Item Form ──────────────────────────────────────────────────────────────────

function ItemForm({ formData, setFormData, onSubmit, onCancel, saving }: {
  formData: typeof EMPTY_FORM;
  setFormData: (d: Partial<typeof EMPTY_FORM>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = (patch: Partial<typeof EMPTY_FORM>) => setFormData({ ...formData, ...patch });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Item Name (Hindi)</label>
          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium" 
            value={formData.name_hindi} onChange={e => set({ name_hindi: e.target.value })} placeholder="उदा. यूरिया" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Item Name (English) *</label>
          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium" 
            value={formData.name} onChange={e => set({ name: e.target.value })} placeholder="e.g. Urea" required />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium cursor-pointer"
          value={formData.category} onChange={e => set({ category: e.target.value as InventoryCategory })}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.icon} {cat.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Quantity</label>
          <input type="number" min="0" step="0.1" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-medium" 
            value={formData.quantity} onChange={e => set({ quantity: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Unit</label>
          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-medium cursor-pointer"
            value={formData.unit} onChange={e => set({ unit: e.target.value })}>
            <option value="kg">Kilogram (kg)</option>
            <option value="bag">Bag</option>
            <option value="L">Liter (L)</option>
            <option value="pcs">Pieces (pcs)</option>
            <option value="ton">Ton</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Min. Stock Alert</label>
          <input type="number" min="0" className="w-full px-4 py-2.5 rounded-lg border border-amber-200 bg-white focus:border-amber-500 outline-none font-medium" 
            value={formData.low_stock_threshold} onChange={e => set({ low_stock_threshold: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Cost (₹ per unit)</label>
          <input type="number" min="0" className="w-full px-4 py-2.5 rounded-lg border border-amber-200 bg-white focus:border-amber-500 outline-none font-medium" 
            value={formData.cost} onChange={e => set({ cost: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Supplier (Optional)</label>
          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-medium" 
            value={formData.supplier} onChange={e => set({ supplier: e.target.value })} placeholder="Vendor name" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Expiry Date (Optional)</label>
          <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none font-medium" 
            value={formData.expiry_date} onChange={e => set({ expiry_date: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
        <button onClick={onCancel} disabled={saving} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={saving || !formData.name.trim()} className="flex-[2] py-3.5 rounded-xl font-bold black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          Save Item
        </button>
      </div>
    </div>
  );
}