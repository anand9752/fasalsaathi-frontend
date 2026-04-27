import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { useLanguage, SpeakerButton } from "./language-context";
import { motion } from "motion/react";
import {
  Plus, Search, Edit, Trash2, Package,
  AlertTriangle, Grid3X3, List, CheckCircle, X, Loader2,
} from "lucide-react";
import { inventoryApi } from "../services/api";
import type { InventoryCategory, InventoryItem, InventoryStats } from "../types/api";

const CATEGORIES: Record<InventoryCategory, { label: string; icon: string }> = {
  fertilizer: { label: "उर्वरक", icon: "🌱" },
  seeds:       { label: "बीज",    icon: "🌾" },
  pesticide:   { label: "कीटनाशक", icon: "🐛" },
  equipment:   { label: "उपकरण",  icon: "🚜" },
  other:       { label: "अन्य",   icon: "📦" },
};

const EMPTY_FORM = {
  name: "", name_hindi: "", category: "fertilizer" as InventoryCategory,
  quantity: 0, unit: "kg", low_stock_threshold: 0, cost: 0,
  supplier: "", expiry_date: "",
};

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
      setError("डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  }, [filterCategory, showLowStockOnly, searchTerm]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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
      setError("आइटम जोड़ने में त्रुटि।");
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
      setError("आइटम अपडेट करने में त्रुटि।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("क्या आप इस आइटम को हटाना चाहते हैं?")) return;
    try {
      await inventoryApi.delete(id);
      fetchAll();
    } catch {
      setError("आइटम हटाने में त्रुटि।");
    }
  };

  const lowStockItems = items.filter(i => i.is_low_stock);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Poppins" }}>
              {t("inventory", "इन्वेंटरी")}
            </h1>
            <p className="text-gray-600 mt-2">खेत की सामग्री और उपकरणों का प्रबंधन करें</p>
          </div>
          <SpeakerButton text="इन्वेंटरी प्रबंधन - खेत की सभी सामग्री की सूची" />
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-sm">{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">कुल आइटम</p>
                <p className="text-2xl font-bold">{stats?.total_items ?? items.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">कम स्टॉक</p>
                <p className="text-2xl font-bold text-red-600">{stats?.low_stock_count ?? lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">कुल मूल्य</p>
                <p className="text-2xl font-bold">₹{(stats?.total_value ?? 0).toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">श्रेणियां</p>
                <p className="text-2xl font-bold">{stats?.categories_count ?? Object.keys(CATEGORIES).length}</p>
              </div>
              <Grid3X3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                कम स्टॉक अलर्ट
                <SpeakerButton text={`${lowStockItems.length} आइटम्स में कम स्टॉक है`} className="ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} className="bg-red-100 text-red-800">
                    {item.name_hindi || item.name} ({item.quantity} {item.unit})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="आइटम खोजें..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64" />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="श्रेणी चुनें" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी श्रेणियां</SelectItem>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch checked={showLowStockOnly} onCheckedChange={setShowLowStockOnly} />
                  <Label>केवल कम स्टॉक</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />नया आइटम
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> लोड हो रहा है...
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * index }}>
              <Card className={`h-full relative ${item.is_low_stock ? "border-red-200" : ""}`}>
                {item.is_low_stock && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{CATEGORIES[item.category].icon}</span>
                      <div>
                        <CardTitle className="text-lg">{item.name_hindi || item.name}</CardTitle>
                        <p className="text-sm text-gray-600">{item.name}</p>
                      </div>
                    </div>
                    <SpeakerButton text={`${item.name_hindi || item.name} - ${item.quantity} ${item.unit} उपलब्ध`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">मात्रा</p>
                      <p className={`text-xl font-bold ${item.is_low_stock ? "text-red-600" : "text-green-600"}`}>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">न्यूनतम स्टॉक</p>
                      <p className="text-lg font-semibold">{item.low_stock_threshold} {item.unit}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">श्रेणी:</span>
                      <Badge>{CATEGORIES[item.category].label}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">मूल्य:</span>
                      <span className="font-semibold">₹{item.cost}</span>
                    </div>
                    {item.supplier && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">सप्लायर:</span>
                        <span className="font-semibold">{item.supplier}</span>
                      </div>
                    )}
                    {item.expiry_date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">समाप्ति:</span>
                        <span className="font-semibold">{item.expiry_date}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(item)}>
                      <Edit className="w-4 h-4 mr-1" /> संपादित
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {!loading && viewMode === "table" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>आइटम</TableHead>
                  <TableHead>श्रेणी</TableHead>
                  <TableHead>मात्रा</TableHead>
                  <TableHead>न्यूनतम</TableHead>
                  <TableHead>मूल्य</TableHead>
                  <TableHead>सप्लायर</TableHead>
                  <TableHead>क्रियाएं</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id} className={item.is_low_stock ? "bg-red-50" : ""}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {item.is_low_stock && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        <div>
                          <p className="font-semibold">{item.name_hindi || item.name}</p>
                          <p className="text-sm text-gray-600">{item.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge>{CATEGORIES[item.category].label}</Badge></TableCell>
                    <TableCell>
                      <span className={item.is_low_stock ? "text-red-600 font-semibold" : ""}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>{item.low_stock_threshold} {item.unit}</TableCell>
                    <TableCell>₹{item.cost}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">कोई आइटम नहीं मिला</h3>
          <p className="text-gray-600 mb-6">अभी तक कोई इन्वेंटरी आइटम नहीं है। पहला आइटम जोड़ें।</p>
          <Button onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> पहला आइटम जोड़ें
          </Button>
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={open => { if (!open) { resetForm(); } setIsAddOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>नया आइटम जोड़ें</DialogTitle></DialogHeader>
          <ItemForm formData={formData} setFormData={setFormData} onSubmit={handleAdd} onCancel={() => { resetForm(); setIsAddOpen(false); }} saving={saving} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingItem} onOpenChange={open => { if (!open) { setEditingItem(null); resetForm(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>आइटम संपादित करें</DialogTitle></DialogHeader>
          <ItemForm formData={formData} setFormData={setFormData} onSubmit={handleEdit} onCancel={() => { setEditingItem(null); resetForm(); }} saving={saving} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Item Form ──────────────────────────────────────────────────────────────────

function ItemForm({ formData, setFormData, onSubmit, onCancel, saving }: {
  formData: typeof EMPTY_FORM;
  setFormData: (d: typeof EMPTY_FORM) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = (patch: Partial<typeof EMPTY_FORM>) => setFormData({ ...formData, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nameHindi">हिंदी नाम</Label>
          <Input id="nameHindi" value={formData.name_hindi} onChange={e => set({ name_hindi: e.target.value })} placeholder="आइटम का हिंदी नाम" />
        </div>
        <div>
          <Label htmlFor="name">English नाम *</Label>
          <Input id="name" value={formData.name} onChange={e => set({ name: e.target.value })} placeholder="Item English name" required />
        </div>
      </div>

      <div>
        <Label>श्रेणी</Label>
        <Select value={formData.category} onValueChange={v => set({ category: v as InventoryCategory })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <SelectItem key={key} value={key}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">मात्रा</Label>
          <Input id="quantity" type="number" min="0" value={formData.quantity} onChange={e => set({ quantity: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>इकाई</Label>
          <Select value={formData.unit} onValueChange={v => set({ unit: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">किलोग्राम</SelectItem>
              <SelectItem value="बैग">बैग</SelectItem>
              <SelectItem value="लीटर">लीटर</SelectItem>
              <SelectItem value="पीस">पीस</SelectItem>
              <SelectItem value="टन">टन</SelectItem>
              <SelectItem value="gram">ग्राम</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lowStock">न्यूनतम स्टॉक</Label>
          <Input id="lowStock" type="number" min="0" value={formData.low_stock_threshold} onChange={e => set({ low_stock_threshold: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <Label htmlFor="cost">मूल्य (प्रति इकाई)</Label>
          <Input id="cost" type="number" min="0" value={formData.cost} onChange={e => set({ cost: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>

      <div>
        <Label htmlFor="supplier">सप्लायर</Label>
        <Input id="supplier" value={formData.supplier} onChange={e => set({ supplier: e.target.value })} placeholder="सप्लायर का नाम" />
      </div>

      <div>
        <Label htmlFor="expiry">समाप्ति तिथि (वैकल्पिक)</Label>
        <Input id="expiry" type="date" value={formData.expiry_date} onChange={e => set({ expiry_date: e.target.value })} />
      </div>

      <div className="flex space-x-2 pt-2">
        <Button onClick={onSubmit} className="flex-1" disabled={saving || !formData.name.trim()}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          सेव करें
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={saving}>
          <X className="w-4 h-4 mr-2" /> रद्द करें
        </Button>
      </div>
    </div>
  );
}