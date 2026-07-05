import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import DynamicIcon from './DynamicIcon';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id' | 'createdAt'> & { id?: string }) => void;
  editingItem?: MenuItem | null;
  categories: string[];
}

const SAFE_ICONS = [
  "Globe", "BookOpen", "Search", "Map", "Compass", 
  "Code", "Video", "Music", "Briefcase", "Terminal", 
  "Settings", "Info", "Cloud", "Image", "Heart", "ExternalLink",
  "Database", "Cpu", "Activity", "Layout", "BarChart2", "TrendingUp",
  "MessageSquare", "FileText", "Users", "Shield", "Lock", "Bell",
  "Play", "Sliders", "User", "Home", "Mail", "Calendar",
  "Smartphone", "Server", "Layers", "Zap", "Eye", "Star", "Gift", "Bookmark"
];

export default function AddEditModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories
}: AddEditModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Globe');
  const [embeddable, setEmbeddable] = useState<boolean | 'unknown'>('unknown');
  
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize fields if editing
  useEffect(() => {
    if (editingItem) {
      setUrl(editingItem.url);
      setName(editingItem.name);
      setDescription(editingItem.description);
      setSelectedIcon(editingItem.icon);
      setEmbeddable(editingItem.embeddable);
      
      if (categories.includes(editingItem.category)) {
        setCategory(editingItem.category);
        setIsCustomCategory(false);
      } else {
        setCategory('__custom__');
        setCustomCategory(editingItem.category);
        setIsCustomCategory(true);
      }
    } else {
      setUrl('');
      setName('');
      setDescription('');
      setSelectedIcon('Globe');
      setEmbeddable('unknown');
      setCategory(categories[0] || 'Chung');
      setCustomCategory('');
      setIsCustomCategory(false);
    }
    setAiError(null);
    setValidationError(null);
  }, [editingItem, isOpen, categories]);

  if (!isOpen) return null;

  // AI autofill handler
  const handleAIAutofill = async () => {
    if (!url.trim()) {
      setAiError('Vui lòng nhập địa chỉ URL trước khi gọi AI.');
      return;
    }

    setIsLoadingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi khi phân tích URL.');
      }

      const data = await response.json();
      
      setName(data.title || '');
      setDescription(data.description || '');
      setEmbeddable(data.embeddable);
      
      if (data.icon && SAFE_ICONS.includes(data.icon)) {
        setSelectedIcon(data.icon);
      } else {
        setSelectedIcon('Globe');
      }

      // Check category
      if (categories.includes(data.category)) {
        setCategory(data.category);
        setIsCustomCategory(false);
      } else {
        setCategory('__custom__');
        setCustomCategory(data.category);
        setIsCustomCategory(true);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Không thể tự động phân tích. Hãy điền thủ công.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    if (value === '__custom__') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!url.trim()) {
      setValidationError('Địa chỉ URL không được để trống.');
      return;
    }
    if (!name.trim()) {
      setValidationError('Tên hiển thị không được để trống.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setValidationError('Danh mục không được để trống.');
      return;
    }

    onSave({
      id: editingItem?.id,
      url: url.trim(),
      name: name.trim(),
      description: description.trim(),
      category: finalCategory,
      icon: selectedIcon,
      embeddable: embeddable
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <DynamicIcon name={editingItem ? "Edit2" : "Plus"} className="text-blue-600" size={18} />
            {editingItem ? 'Chỉnh sửa Menu' : 'Thêm Trang vào Menu'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <DynamicIcon name="X" size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
              <DynamicIcon name="AlertTriangle" size={14} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* URL Input */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Địa chỉ Website (URL) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <DynamicIcon name="Link2" size={16} />
                </span>
                <input
                  type="text"
                  placeholder="example.com hoặc https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                />
              </div>
              <button
                type="button"
                onClick={handleAIAutofill}
                disabled={isLoadingAI}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <DynamicIcon name="RotateCw" size={14} className="animate-spin" />
                ) : (
                  <DynamicIcon name="Sparkles" size={14} className="text-indigo-500" />
                )}
                AI Auto
              </button>
            </div>
            {aiError && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <DynamicIcon name="Info" size={12} />
                {aiError}
              </p>
            )}
          </div>

          {/* Technical Check Preview Box */}
          {embeddable !== 'unknown' && (
            <div className={`p-3 rounded-xl border flex items-start gap-3 transition text-xs ${
              embeddable 
                ? 'bg-emerald-50/55 border-emerald-100 text-emerald-800' 
                : 'bg-amber-50/55 border-amber-100 text-amber-800'
            }`}>
              <div className="mt-0.5">
                <DynamicIcon 
                  name={embeddable ? "CheckCircle" : "AlertTriangle"} 
                  className={embeddable ? "text-emerald-500" : "text-amber-500"} 
                  size={16} 
                />
              </div>
              <div>
                <p className="font-semibold">
                  {embeddable ? 'Có thể nhúng trực tiếp!' : 'Hạn chế nhúng (Chặn Iframe)'}
                </p>
                <p className="opacity-80 mt-0.5">
                  {embeddable 
                    ? 'Trang web này cho phép hiển thị trực tiếp bên trong ứng dụng.' 
                    : 'Trang web này chặn hiển thị iframe. Khi nhấn vào, hệ thống sẽ mở trong Tab mới hoặc cung cấp nút chuyển hướng an toàn.'}
                </p>
              </div>
            </div>
          )}

          {/* Name & Display Title */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tên hiển thị trên Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên hiển thị (Ví dụ: Wikipedia Việt Nam)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              maxLength={40}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Mô tả ngắn
            </label>
            <textarea
              placeholder="Nhập một vài từ mô tả trang này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition min-h-[60px]"
              maxLength={120}
            />
          </div>

          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Tạo danh mục mới...</option>
              </select>
            </div>

            {isCustomCategory && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Tên danh mục mới
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giải trí"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
                />
              </div>
            )}
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Biểu tượng (Icon)
            </label>
            <div className="grid grid-cols-8 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              {SAFE_ICONS.map((ico) => {
                const isSelected = selectedIcon === ico;
                return (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setSelectedIcon(ico)}
                    className={`p-2 rounded-lg flex items-center justify-center transition border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                    }`}
                    title={ico}
                  >
                    <DynamicIcon name={ico} size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 hover:shadow-lg transition flex items-center gap-1.5"
            >
              <DynamicIcon name="Check" size={16} />
              Lưu cấu hình
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
