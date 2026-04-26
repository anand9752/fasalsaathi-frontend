import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { useLanguage, SpeakerButton } from "./language-context";
import { motion } from "motion/react";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Grid3X3,
  List,
  Filter,
  CheckCircle,
  X
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  nameHindi: string;
  category: 'fertilizer' | 'seeds' | 'pesticide' | 'equipment' | 'other';
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: string;
  cost: number;
  supplier: string;
  expiryDate?: string;
}

export function InventoryPage() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameHindi: '',
    category: 'fertilizer' as const,
    quantity: 0,
    unit: 'kg',
    lowStockThreshold: 0,
    cost: 0,
    supplier: '',
    expiryDate: ''
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'DAP Fertilizer',
      nameHindi: 'डीएपी उर्वरक',
      category: 'fertilizer',
      quantity: 5,
      unit: 'बैग',
      lowStockThreshold: 10,
      lastUpdated: '2024-01-15',
      cost: 1200,
      supplier: 'राज एग्रो सेंटर',
      expiryDate: '2025-06-30'
    },
    {
      id: '2',
      name: 'Urea',
      nameHindi: 'यूरिया',
      category: 'fertilizer',
      quantity: 15,
      unit: 'बैग',
      lowStockThreshold: 8,
      lastUpdated: '2024-01-12',
      cost: 280,
      supplier: 'किसान भंडार',
    },
    {
      id: '3',
      name: 'Soybean Seeds',
      nameHindi: 'सोयाबीन बीज',
      category: 'seeds',
      quantity: 2,
      unit: 'kg',
      lowStockThreshold: 5,
      lastUpdated: '2024-01-10',
      cost: 120,
      supplier: 'महिको सीड्स',
    },
    {
      id: '4',
      name: 'Pesticide Spray',
      nameHindi: 'कीटनाशक स्प्रे',
      category: 'pesticide',
      quantity: 8,
      unit: 'लीटर',
      lowStockThreshold: 3,
      lastUpdated: '2024-01-08',
      cost: 450,
      supplier: 'बायर एग्रो',
      expiryDate: '2024-12-31'
    },
    {
      id: '5',
      name: 'Water Pump',
      nameHindi: 'पानी का पंप',
      category: 'equipment',
      quantity: 1,
      unit: 'पीस',
      lowStockThreshold: 1,
      lastUpdated: '2024-01-05',
      cost: 15000,
      supplier: 'टाटा एग्रिको',
    }
  ]);

  const categories = {
    fertilizer: { label: 'उर्वरक', icon: '🌱' },
    seeds: { label: 'बीज', icon: '🌾' },
    pesticide: { label: 'कीटनाशक', icon: '🐛' },
    equipment: { label: 'उपकरण', icon: '🚜' },
    other: { label: 'अन्य', icon: '📦' }
  };

  const isLowStock = (item: InventoryItem) => item.quantity <= item.lowStockThreshold;

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.nameHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLowStock = !showLowStockOnly || isLowStock(item);
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockItems = inventory.filter(isLowStock);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      nameHindi: formData.nameHindi,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      lowStockThreshold: formData.lowStockThreshold,
      lastUpdated: new Date().toISOString().split('T')[0],
      cost: formData.cost,
      supplier: formData.supplier,
      expiryDate: formData.expiryDate || undefined
    };
    setInventory([...inventory, newItem]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditItem = () => {
    if (editingItem) {
      const updatedInventory = inventory.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              nameHindi: formData.nameHindi,
              category: formData.category,
              quantity: formData.quantity,
              unit: formData.unit,
              lowStockThreshold: formData.lowStockThreshold,
              cost: formData.cost,
              supplier: formData.supplier,
              expiryDate: formData.expiryDate || undefined,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setInventory(updatedInventory);
      resetForm();
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameHindi: '',
      category: 'fertilizer',
      quantity: 0,
      unit: 'kg',
      lowStockThreshold: 0,
      cost: 0,
      supplier: '',
      expiryDate: ''
    });
  };

  const openEditModal = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      nameHindi: item.nameHindi,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      lowStockThreshold: item.lowStockThreshold,
      cost: item.cost,
      supplier: item.supplier,
      expiryDate: item.expiryDate || ''
    });
    setEditingItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
              {t('inventory', 'इन्वेंटरी')}
            </h1>
            <p className="text-gray-600 mt-2">
              खेत की सामग्री और उपकरणों का प्रबंधन करें
            </p>
          </div>
          <SpeakerButton text="इन्वेंटरी प्रबंधन - खेत की सभी सामग्री की सूची" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">कुल आइटम</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
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
                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
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
                <p className="text-2xl font-bold">₹{inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0).toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{Object.keys(categories).length}</p>
              </div>
              <Grid3X3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
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
                    {item.nameHindi} ({item.quantity} {item.unit})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="आइटम खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>

                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="श्रेणी चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी श्रेणियां</SelectItem>
                    {Object.entries(categories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Low Stock Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showLowStockOnly}
                    onCheckedChange={setShowLowStockOnly}
                  />
                  <Label>केवल कम स्टॉक</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Add Item Button */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      नया आइटम
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>नया आइटम जोड़ें</DialogTitle>
                    </DialogHeader>
                    <ItemForm 
                      formData={formData}
                      setFormData={setFormData}
                      onSubmit={handleAddItem}
                      onCancel={() => {
                        resetForm();
                        setIsAddModalOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className={`h-full relative ${isLowStock(item) ? 'border-red-200' : ''}`}>
                {isLowStock(item) && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{categories[item.category].icon}</span>
                      <div>
                        <CardTitle className="text-lg">{item.nameHindi}</CardTitle>
                        <p className="text-sm text-gray-600">{item.name}</p>
                      </div>
                    </div>
                    <SpeakerButton text={`${item.nameHindi} - ${item.quantity} ${item.unit} उपलब्ध`} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">मात्रा</p>
                      <p className={`text-xl font-bold ${isLowStock(item) ? 'text-red-600' : 'text-green-600'}`}>
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">न्यूनतम स्टॉक</p>
                      <p className="text-lg font-semibold">{item.lowStockThreshold} {item.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">श्रेणी:</span>
                      <Badge>{categories[item.category].label}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">मूल्य:</span>
                      <span className="font-semibold">₹{item.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">सप्लायर:</span>
                      <span className="font-semibold">{item.supplier}</span>
                    </div>
                    {item.expiryDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">समाप्ति:</span>
                        <span className="font-semibold">{item.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      संपादित करें
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>आइटम</TableHead>
                  <TableHead>श्रेणी</TableHead>
                  <TableHead>मात्रा</TableHead>
                  <TableHead>न्यूनतम स्टॉक</TableHead>
                  <TableHead>मूल्य</TableHead>
                  <TableHead>सप्लायर</TableHead>
                  <TableHead>क्रियाएं</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className={isLowStock(item) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {isLowStock(item) && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        <div>
                          <p className="font-semibold">{item.nameHindi}</p>
                          <p className="text-sm text-gray-600">{item.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{categories[item.category].label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isLowStock(item) ? 'text-red-600 font-semibold' : ''}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>{item.lowStockThreshold} {item.unit}</TableCell>
                    <TableCell>₹{item.cost}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteItem(item.id)}
                        >
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

      {/* Edit Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>आइटम संपादित करें</DialogTitle>
          </DialogHeader>
          <ItemForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditItem}
            onCancel={() => {
              resetForm();
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* No Results */}
      {filteredInventory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">कोई आइटम नहीं मिला</h3>
          <p className="text-gray-600">कृपया अन्य खोज शब्द या फिल्टर का उपयोग करें</p>
        </motion.div>
      )}
    </div>
  );
}

// Item Form Component
function ItemForm({ formData, setFormData, onSubmit, onCancel }: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const categories = {
    fertilizer: 'उर्वरक',
    seeds: 'बीज',
    pesticide: 'कीटनाशक',
    equipment: 'उपकरण',
    other: 'अन्य'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nameHindi">हिंदी नाम</Label>
          <Input
            id="nameHindi"
            value={formData.nameHindi}
            onChange={(e) => setFormData({ ...formData, nameHindi: e.target.value })}
            placeholder="आइटम का हिंदी नाम"
          />
        </div>
        <div>
          <Label htmlFor="name">English नाम</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Item English name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">श्रेणी</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categories).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">मात्रा</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="unit">इकाई</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">किलोग्राम</SelectItem>
              <SelectItem value="बैग">बैग</SelectItem>
              <SelectItem value="लीटर">लीटर</SelectItem>
              <SelectItem value="पीस">पीस</SelectItem>
              <SelectItem value="टन">टन</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lowStockThreshold">न्यूनतम स्टॉक</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="cost">मूल्य (प्रति इकाई)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="supplier">सप्लायर</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          placeholder="सप्लायर का नाम"
        />
      </div>

      <div>
        <Label htmlFor="expiryDate">समाप्ति तिथि (वैकल्पिक)</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button onClick={onSubmit} className="flex-1">
          <CheckCircle className="w-4 h-4 mr-2" />
          सेव करें
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          रद्द करें
        </Button>
      </div>
    </div>
  );
}