import React, { useState, useEffect } from 'react';
import { MenuItem } from './types';
import DynamicIcon from './components/DynamicIcon';
import AddEditModal from './components/AddEditModal';
import EmbedViewer from './components/EmbedViewer';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGE_WALLPAPERS, VIDEO_WALLPAPERS, GRADIENT_WALLPAPERS, PATTERN_WALLPAPERS, Wallpaper } from './wallpapers';

// Pre-seeded high quality embeddable websites
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'wikipedia',
    name: 'Bách Khoa Toàn Thư',
    url: 'https://vi.wikipedia.org/wiki/Trang_Ch%C3%ADnh',
    icon: 'BookOpen',
    category: 'Học tập & Tài liệu',
    description: 'Bách khoa toàn thư mở Wikipedia Tiếng Việt.',
    embeddable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'openstreetmap',
    name: 'Bản đồ Thế giới tự do',
    url: 'https://www.openstreetmap.org/export/embed.html',
    icon: 'Map',
    category: 'Bản đồ & Định vị',
    description: 'Dịch vụ bản đồ đường phố mở thế giới.',
    embeddable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'retro-game',
    name: 'Trò chơi 2048',
    url: 'https://play2048.co/',
    icon: 'Terminal',
    category: 'Giải trí & Thư giãn',
    description: 'Trò chơi giải đố số học 2048 cổ điển.',
    embeddable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'open-weather',
    name: 'Bản đồ Thời tiết Gió',
    url: 'https://windy.com/',
    icon: 'Cloud',
    category: 'Công cụ & Tiện ích',
    description: 'Dự báo thời tiết trực quan bằng luồng gió thời gian thực.',
    embeddable: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  // Customization & Wallpapers States
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(IMAGE_WALLPAPERS[0]);
  const [cardOpacity, setCardOpacity] = useState<number>(95);
  const [sidebarOpacity, setSidebarOpacity] = useState<number>(95);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true); // Default collapsed as requested

  // Settings menu tab state
  const [settingsTab, setSettingsTab] = useState<'opacity' | 'wallpaper' | 'backup'>('opacity');

  // Bottom Popups
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  // Dynamic Border Rotation State for main card (changes color every 1 minute)
  const borderColors = [
    '#3b82f6', // Xanh dương
    '#ec4899', // Hồng neon
    '#10b981', // Xanh lá
    '#f59e0b', // Vàng cam
    '#8b5cf6', // Tím
    '#00f5ff'  // Xanh ngọc sáng
  ];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % borderColors.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load configuration & wallpapers from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('web_embed_menu_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMenuItems(parsed);
      } catch (e) {
        setMenuItems(DEFAULT_MENU_ITEMS);
        localStorage.setItem('web_embed_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
      }
    } else {
      setMenuItems(DEFAULT_MENU_ITEMS);
      localStorage.setItem('web_embed_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
    }

    const savedWallpaper = localStorage.getItem('web_embed_wallpaper');
    if (savedWallpaper) {
      try {
        setCurrentWallpaper(JSON.parse(savedWallpaper));
      } catch (e) {}
    }

    const savedCardOpacity = localStorage.getItem('web_embed_card_opacity');
    if (savedCardOpacity) setCardOpacity(Number(savedCardOpacity));

    const savedSidebarOpacity = localStorage.getItem('web_embed_sidebar_opacity');
    if (savedSidebarOpacity) setSidebarOpacity(Number(savedSidebarOpacity));
  }, []);

  // Show Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Save changes to LocalStorage
  const saveMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    localStorage.setItem('web_embed_menu_items', JSON.stringify(newItems));
  };

  const updateWallpaper = (wp: Wallpaper) => {
    setCurrentWallpaper(wp);
    localStorage.setItem('web_embed_wallpaper', JSON.stringify(wp));
    showToast(`Đã thay đổi hình nền thành: ${wp.name}`, 'success');
  };

  const handleCardOpacityChange = (val: number) => {
    setCardOpacity(val);
    localStorage.setItem('web_embed_card_opacity', String(val));
  };

  const handleSidebarOpacityChange = (val: number) => {
    setSidebarOpacity(val);
    localStorage.setItem('web_embed_sidebar_opacity', String(val));
  };

  // Categories list
  const categoriesList: string[] = ['Tất cả', ...Array.from(new Set<string>(menuItems.map(item => item.category)))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Học tập & Tài liệu': return 'BookOpen';
      case 'Bản đồ & Định vị': return 'Map';
      case 'Giải trí & Thư giãn': return 'Terminal';
      case 'Công cụ & Tiện ích': return 'Cloud';
      default: return 'Folder';
    }
  };

  // Filter menu items by search & category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Save (Create or Update)
  const handleSaveItem = (itemData: Omit<MenuItem, 'id' | 'createdAt'> & { id?: string }) => {
    let updatedList: MenuItem[];
    if (itemData.id) {
      updatedList = menuItems.map(item => {
        if (item.id === itemData.id) {
          const updatedItem = { ...item, ...itemData };
          if (activeItem?.id === item.id) setActiveItem(updatedItem);
          return updatedItem;
        }
        return item;
      });
      showToast('Cập nhật cấu hình liên kết thành công!', 'success');
    } else {
      const newItem: MenuItem = {
        ...itemData,
        id: 'item_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      updatedList = [newItem, ...menuItems];
      setActiveItem(newItem);
      showToast('Thêm liên kết mới thành công!', 'success');
    }
    saveMenuItems(updatedList);
    setEditingItem(null);
  };

  // Delete
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Anh có chắc chắn muốn xóa trang này khỏi danh mục không?')) {
      const updatedList = menuItems.filter(item => item.id !== id);
      saveMenuItems(updatedList);
      showToast('Đã xóa liên kết khỏi hệ thống.', 'info');
      if (activeItem?.id === id) {
        setActiveItem(null); // Return home if active deleted
      }
    }
  };

  // Edit Action
  const handleEditItem = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Export
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(menuItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `powerservice_menu_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã xuất tệp sao lưu JSON thành công!', 'success');
  };

  // Import
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported) && imported.every(i => i.id && i.name && i.url)) {
            const merged = [...imported, ...menuItems.filter(existing => !imported.some(imp => imp.url === existing.url))];
            saveMenuItems(merged);
            showToast('Đã nhập và đồng bộ dữ liệu menu thành công!', 'success');
          } else {
            showToast('Cấu trúc file JSON sao lưu không hợp lệ.', 'error');
          }
        } catch (err) {
          showToast('Đọc tệp tin thất bại, định dạng không đúng.', 'error');
        }
      };
    }
  };

  // Open URL in New Tab
  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Unique categories for the sidebar Center icons list
  const uniqueCategories = Array.from(new Set<string>(menuItems.map(item => item.category)));

  // Current Active Border Color for 3D Cards
  const activeBorderColor = borderColors[colorIndex];

  return (
    <div className="h-screen w-screen relative flex font-sans overflow-hidden antialiased text-slate-800">
      
      {/* BACKGROUND MANAGER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {currentWallpaper.type === 'video' ? (
          <video
            key={currentWallpaper.id}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
            src={currentWallpaper.url}
          />
        ) : currentWallpaper.type === 'image' ? (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url(${currentWallpaper.url})` }}
          />
        ) : currentWallpaper.type === 'gradient' ? (
          <div
            className={`w-full h-full transition-all duration-700 ${
              currentWallpaper.id === 'grad_dyn' ? 'animate-gradient-bg bg-[length:400%_400%]' : ''
            }`}
            style={{ background: currentWallpaper.css }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: currentWallpaper.css ? currentWallpaper.css : `url(${currentWallpaper.url})`,
              backgroundColor: currentWallpaper.bgColor,
              backgroundSize: currentWallpaper.bgSize || 'auto'
            }}
          />
        )}
      </div>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800 shadow-emerald-500/10' :
              toast.type === 'error' ? 'bg-white border-red-200 text-red-800 shadow-red-500/10' :
              'bg-white border-blue-200 text-blue-800 shadow-blue-500/10'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
              toast.type === 'error' ? 'bg-red-50 text-red-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              <DynamicIcon 
                name={toast.type === 'success' ? 'CheckCircle' : toast.type === 'error' ? 'AlertTriangle' : 'Info'} 
                size={14} 
              />
            </div>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ARCHIVE BUTTON (LƯU TRỮ) - ONLY SHOWS WHEN SIDEBAR IS HIDDEN */}
      <AnimatePresence>
        {sidebarCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-12 h-14 bg-slate-900 text-white rounded-r-2xl shadow-2xl shadow-slate-900/40 border-y border-r border-slate-800/50 transition-all cursor-pointer select-none group"
            title="Mở danh mục Lưu trữ"
          >
            <div className="relative">
              <DynamicIcon name="Bookmark" size={22} className="text-blue-400 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* SIDEBAR MENU (LEFT SIDE) */}
      <div 
        className="h-full relative flex flex-col z-20 shrink-0 backdrop-blur-md transition-all duration-300 overflow-hidden"
        style={{
          width: sidebarCollapsed ? '0px' : '260px',
          borderRight: sidebarCollapsed ? 'none' : '1px solid rgba(226, 232, 240, 0.5)',
          backgroundColor: `rgba(255, 255, 255, ${sidebarOpacity / 100})`,
        }}
      >
        {/* ROUND ARROW BUTTON - Vertical Center Right Edge */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200/80 rounded-full flex items-center justify-center cursor-pointer shadow-md z-[50] hover:scale-110 active:scale-95 transition-transform"
          title={sidebarCollapsed ? "Bung rộng menu" : "Thu gọn menu"}
        >
          <DynamicIcon 
            name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} 
            size={14} 
            className="text-slate-600" 
          />
        </button>

        {/* TOP SECTION: Logo */}
        <div 
          onClick={() => {
            setActiveItem(null);
            showToast('Đã quay trở lại Trang Chủ', 'info');
          }}
          className={`p-5 flex items-center gap-3 border-b border-slate-100/50 cursor-pointer select-none transition-all duration-200 ${
            sidebarCollapsed ? 'justify-center hover:bg-slate-50/20' : 'hover:bg-slate-50/40'
          }`}
          title="Về Trang Chủ"
        >
          <img 
            src="https://i.ibb.co/GvcmMgD3/Logo-Tr-ng.png" 
            alt="Logo Trắng" 
            className="w-8 h-8 object-contain shrink-0 bg-blue-600 rounded-lg p-1 shadow-md shadow-blue-500/20 hover:rotate-12 transition-transform duration-300" 
          />
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-wider text-slate-800 truncate leading-tight uppercase">
                Power Service
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate leading-none">
                Hệ thống nhúng tiện ích
              </span>
            </div>
          )}
        </div>

        {/* SIDEBAR SEARCH & ACTIONS SECTION */}
        <div className={`px-4 py-3 border-b border-slate-100/50 flex flex-col gap-2.5 shrink-0 ${sidebarCollapsed ? 'items-center' : ''}`}>
          {/* Search */}
          {sidebarCollapsed ? (
            <button
              onClick={() => {
                setSidebarCollapsed(false);
              }}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition cursor-pointer"
              title="Tìm kiếm liên kết"
            >
              <DynamicIcon name="Search" size={16} />
            </button>
          ) : (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <DynamicIcon name="Search" size={13} />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm liên kết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <DynamicIcon name="X" size={11} />
                </button>
              )}
            </div>
          )}

          {/* Add Page Button */}
          {sidebarCollapsed ? (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
              title="Thêm trang liên kết mới"
            >
              <DynamicIcon name="Plus" size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="w-full px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DynamicIcon name="Plus" size={13} />
              Thêm Trang Mới
            </button>
          )}

          {/* Guide Button */}
          {sidebarCollapsed ? (
            <button
              onClick={() => setGuideOpen(true)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition cursor-pointer"
              title="Xem hướng dẫn sử dụng"
            >
              <DynamicIcon name="BookOpen" size={16} />
            </button>
          ) : (
            <button
              onClick={() => setGuideOpen(true)}
              className="w-full px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DynamicIcon name="BookOpen" size={13} />
              Sách Hướng Dẫn
            </button>
          )}
        </div>

        {/* CENTER SECTION: Direct Links List */}
        <div className="flex-1 w-full px-3 py-4 overflow-y-auto space-y-1.5 scrollbar-thin">
          {!sidebarCollapsed && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 block mb-2 select-none">
              Danh sách liên kết
            </span>
          )}
          {menuItems.map((item) => {
            const isActive = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveItem(item);
                  showToast(`Đang nhúng: ${item.name}`, 'info');
                }}
                className={`group w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 relative flex items-center gap-2.5 cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                }`}>
                  <DynamicIcon name={item.icon} size={14} />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0 pr-6">
                    <h5 className="text-[11px] font-bold truncate leading-tight">{item.name}</h5>
                    <p className={`text-[8px] truncate leading-none mt-0.5 font-mono ${isActive ? 'text-blue-100/70' : 'text-slate-400'}`}>
                      {item.url.replace(/^https?:\/\/(www\.)?/i, '')}
                    </p>
                  </div>
                )}

                {/* Actions on hover */}
                {!sidebarCollapsed && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm transition-all duration-150 gap-0.5 z-[20]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item, e);
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded transition"
                      title="Chỉnh sửa"
                    >
                      <DynamicIcon name="Edit2" size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id, e);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded transition"
                      title="Xóa bỏ"
                    >
                      <DynamicIcon name="Trash2" size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM SECTION: Notifications, Settings, Profile */}
        <div className="p-4 border-t border-slate-100/50 flex flex-col gap-4 items-center shrink-0">
          
          {/* 1. Notifications Button (Thông báo) */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
                setSettingsOpen(false);
              }}
              className={`p-3 rounded-xl transition-all duration-200 relative ${
                notificationsOpen 
                  ? 'bg-blue-100 text-blue-700 shadow-inner' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Thông báo hệ thống"
            >
              <DynamicIcon name="Bell" size={16} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute left-[65px] bottom-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[280px] z-[99999]"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <DynamicIcon name="Bell" size={12} className="text-blue-500" />
                      Thông báo hệ thống
                    </span>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <DynamicIcon name="X" size={12} />
                    </button>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="border-l-2 border-blue-500 pl-2">
                      <p className="text-[11px] font-bold text-slate-700">Chào mừng Anh đến với Power Service!</p>
                      <p className="text-[9px] text-slate-400">Hệ thống đồng bộ dữ liệu hoàn thành.</p>
                    </div>
                    <div className="border-l-2 border-emerald-500 pl-2">
                      <p className="text-[11px] font-bold text-slate-700">Đã lưu {menuItems.length} liên kết</p>
                      <p className="text-[9px] text-slate-400">Tất cả trang web được bảo vệ an toàn.</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-2">
                      <p className="text-[11px] font-bold text-slate-700">Chuyển ngôn ngữ thành công</p>
                      <p className="text-[9px] text-slate-400">Đã dịch toàn bộ giao diện sang Tiếng Việt.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Settings Button (Cài đặt) */}
          <div className="relative">
            <button
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                settingsOpen 
                  ? 'bg-blue-100 text-blue-700 shadow-inner' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Cấu hình & Cá nhân hóa"
            >
              <DynamicIcon name="Sliders" size={16} />
            </button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute left-[65px] bottom-[-40px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[340px] z-[99999]"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <DynamicIcon name="Sliders" size={12} className="text-blue-500" />
                      Cá nhân hóa & Cấu hình
                    </span>
                    <button 
                      onClick={() => setSettingsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <DynamicIcon name="X" size={12} />
                    </button>
                  </div>

                  {/* Settings Tab Headers */}
                  <div className="grid grid-cols-3 gap-1 mb-3.5 border-b border-slate-100 pb-2.5 select-none">
                    <button
                      onClick={() => setSettingsTab('opacity')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                        settingsTab === 'opacity'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      Cấu hình
                    </button>
                    <button
                      onClick={() => setSettingsTab('wallpaper')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                        settingsTab === 'wallpaper'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      Hình nền
                    </button>
                    <button
                      onClick={() => setSettingsTab('backup')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                        settingsTab === 'backup'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                    >
                      Dữ liệu
                    </button>
                  </div>

                  <div className="space-y-4 text-left max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {settingsTab === 'opacity' && (
                      <div className="space-y-4">
                        {/* Opacity Siderbar */}
                        <div>
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1">
                            <span>Độ trong suốt Menu Sidebar</span>
                            <span className="text-blue-600">{sidebarOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={sidebarOpacity}
                            onChange={(e) => handleSidebarOpacityChange(Number(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                          />
                        </div>

                        {/* Opacity Main Card */}
                        <div>
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1">
                            <span>Độ trong suốt Thẻ chính (Website)</span>
                            <span className="text-blue-600">{cardOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={cardOpacity}
                            onChange={(e) => handleCardOpacityChange(Number(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                          />
                        </div>
                      </div>
                    )}

                    {settingsTab === 'wallpaper' && (
                      <div className="space-y-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Hình Nền Giao Diện
                        </span>

                        {/* Static Wallpaper Grid with previews */}
                        <div className="space-y-4">
                          {/* 1. Tĩnh Ảnh */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Hình nền tĩnh dạng Ảnh</p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {IMAGE_WALLPAPERS.slice(0, 8).map((wp) => (
                                <button
                                  key={wp.id}
                                  onClick={() => updateWallpaper(wp)}
                                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                    currentWallpaper.id === wp.id ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-100 hover:border-slate-300'
                                  }`}
                                  title={wp.name}
                                >
                                  <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[7px] text-white text-center truncate px-0.5">
                                    {wp.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Video động */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Video chuyển động mượt mà</p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {VIDEO_WALLPAPERS.slice(0, 8).map((wp) => (
                                <button
                                  key={wp.id}
                                  onClick={() => updateWallpaper(wp)}
                                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 bg-slate-900 transition cursor-pointer ${
                                    currentWallpaper.id === wp.id ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-100 hover:border-slate-300'
                                  }`}
                                  title={wp.name}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center text-white z-10 group-hover:scale-125 transition-transform">
                                    <DynamicIcon name="Play" size={10} className="fill-white" />
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[7px] text-white text-center truncate px-0.5 z-10">
                                    {wp.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 3. Gradient */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Dải màu sắc Gradient CSS</p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {GRADIENT_WALLPAPERS.map((wp) => (
                                <button
                                  key={wp.id}
                                  onClick={() => updateWallpaper(wp)}
                                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                    currentWallpaper.id === wp.id ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-100 hover:border-slate-300'
                                  }`}
                                  title={wp.name}
                                >
                                  <div className="w-full h-full" style={{ background: wp.css }} />
                                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[7px] text-white text-center truncate px-0.5">
                                    {wp.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 4. Pattern */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Họa tiết đặc biệt (Patterns)</p>
                            <div className="grid grid-cols-3 gap-1.5">
                              {PATTERN_WALLPAPERS.map((wp) => (
                                <button
                                  key={wp.id}
                                  onClick={() => updateWallpaper(wp)}
                                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 bg-slate-200 transition cursor-pointer ${
                                    currentWallpaper.id === wp.id ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-100 hover:border-slate-300'
                                  }`}
                                  title={wp.name}
                                >
                                  <div className="w-full h-full" style={{
                                    background: wp.css ? wp.css : `url(${wp.url})`,
                                    backgroundColor: wp.bgColor,
                                    backgroundSize: wp.bgSize || 'auto'
                                  }} />
                                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[7px] text-white text-center truncate px-0.5">
                                    {wp.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === 'backup' && (
                      <div className="space-y-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 select-none">
                          Quản lý dữ liệu liên kết
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleExportConfig}
                            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Sao lưu JSON"
                          >
                            <DynamicIcon name="Download" size={13} className="text-blue-500 shrink-0" />
                            Sao Lưu
                          </button>
                          <label 
                            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                            title="Nhập dữ liệu JSON"
                          >
                            <DynamicIcon name="Upload" size={13} className="text-emerald-500 shrink-0" />
                            <span>Khôi Phục</span>
                            <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
                setSettingsOpen(false);
              }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                profileOpen 
                  ? 'bg-blue-100 text-blue-700 shadow-inner' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Thông tin người dùng"
            >
              <DynamicIcon name="User" size={16} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute left-[65px] bottom-[-20px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[280px] z-[99999]"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <DynamicIcon name="User" size={12} className="text-blue-500" />
                      Thông tin tài khoản
                    </span>
                    <button 
                      onClick={() => setProfileOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <DynamicIcon name="X" size={12} />
                    </button>
                  </div>
                  <div className="space-y-2.5 text-left text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Email của Anh:</span>
                      <span className="text-slate-700 font-bold break-all">cskh.powerserviceone@gmail.com</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Vai Trò:</span>
                      <span className="text-blue-600 font-bold">Chuyên Gia Quản Trị Trải Nghiệm Khách Hàng (CX Manager)</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Hệ Thống:</span>
                      <span className="text-slate-500 font-medium">Power Service Hub v1.0.0</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* CONTENT AREA (RIGHT SIDE) */}
      <div className={`flex-1 h-full flex flex-col ${activeItem ? 'p-0' : 'p-[15px]'} z-10 overflow-hidden relative`}>
        
        {/* MAIN BODY WRAPPER CARD */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key="embed-viewer-active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <EmbedViewer
                  item={activeItem}
                  onOpenInNewTab={handleOpenInNewTab}
                  cardOpacity={cardOpacity}
                  onGoBack={() => setActiveItem(null)}
                />
              </motion.div>
            ) : (
              /* HOME / LANDING PAGE INTERACTIVE DASHBOARD (When activeItem is null) */
              <motion.div
                key="home-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                {/* 3D Main Card holding Dashboard */}
                <div 
                  className="w-full h-full flex flex-col overflow-y-auto transition-all duration-500 relative"
                  style={{
                    borderRadius: '10px',
                    padding: '15px',
                    borderColor: activeBorderColor,
                    borderWidth: '3px',
                    backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`,
                    boxShadow: `0 15px 35px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6), 4px 4px 0px ${activeBorderColor}22`
                  }}
                >
                  {/* Elegant Category Pills (Dynamic Filtering in the Dashboard) */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 shrink-0 border-b border-slate-100 pb-3">
                    {categoriesList.map((cat) => {
                      const isActive = selectedCategory === cat;
                      const catIcon = getCategoryIcon(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                            isActive
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          {cat !== 'Tất cả' && <DynamicIcon name={catIcon} size={11} />}
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* 3 Columns, 6 Rows bento project cards grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max overflow-y-auto pr-1">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveItem(item);
                          showToast(`Đang hiển thị nhúng: ${item.name}`, 'success');
                        }}
                        className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-lg relative"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                            <DynamicIcon name={item.icon} size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                                {item.name}
                              </h4>
                              {item.embeddable === false && (
                                <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[8px] font-bold px-1 rounded">Tab</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">
                              {item.category}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-normal">
                              {item.description || "Chưa có mô tả ngắn gọn cho trang liên kết này."}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2.5 mt-3 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono truncate max-w-[170px]">
                            {item.url}
                          </span>
                          <span className="text-[10px] text-blue-500 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                            Truy cập
                            <DynamicIcon name="ChevronRight" size={10} />
                          </span>
                        </div>

                        {/* Edit & Delete hover bar */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 bg-white border border-slate-200 shadow-md p-1 rounded-lg z-10 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditItem(item, e);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded"
                            title="Chỉnh sửa liên kết"
                          >
                            <DynamicIcon name="Edit2" size={11} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id, e);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded"
                            title="Xóa liên kết"
                          >
                            <DynamicIcon name="Trash2" size={11} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Create Card placeholder */}
                    <div
                      onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                      }}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-blue-50/10 transition-all duration-200 min-h-[140px]"
                    >
                      <div className="p-2.5 bg-slate-100 rounded-full text-slate-400">
                        <DynamicIcon name="Plus" size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-700">Thêm trang web liên kết mới</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Lưu trữ các công cụ, bảng điều khiển nội bộ</p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* GUIDELINE MODAL (TÀI LIỆU HƯỚNG DẪN) */}
      <AnimatePresence>
        {guideOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <DynamicIcon name="BookOpen" size={18} className="text-blue-600" />
                  Sổ Tay Hướng Dẫn Sử Dụng Hệ Thống
                </h3>
                <button
                  onClick={() => setGuideOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
                >
                  <DynamicIcon name="X" size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">1. Mục đích hệ thống</h4>
                  <p>Hệ thống Power Service Hub cho phép Anh lưu trữ, phân loại và nhúng trực tiếp bất kỳ trang web hoặc dashboard nội bộ nào vào một giao diện làm việc duy nhất để tăng tối đa hiệu suất.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">2. Trải nghiệm sidebar & popup</h4>
                  <p>Sidebar bên trái mặc định ở trạng thái thu gọn nhằm tối ưu không gian hiển thị website. Khi Anh bấm vào biểu tượng danh mục (Menu Cha), hệ thống sẽ hiển thị một danh sách các liên kết con (Menu Con) ngay cạnh biểu tượng đó. Anh có thể rê chuột hoặc bung rộng sidebar để xem đầy đủ tên danh mục.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">3. Xử lý lỗi liên kết bị từ chối nhúng (SAMEORIGIN)</h4>
                  <p>Một số nền tảng lớn (như Google, Facebook) chặn nhúng trực tiếp vì lý do bảo mật. Khi gặp tình trạng này, hệ thống sẽ tự động phát hiện và cung cấp cho Anh nút <strong className="text-blue-600">Mở trang trong tab mới</strong> vô cùng tiện lợi.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">4. Sao lưu & Khôi phục (Backup)</h4>
                  <p>Anh có thể xuất tệp dữ liệu cấu hình JSON thông qua nút <strong className="text-blue-600">Sao lưu</strong> ở góc trên bên phải để làm phương án dự phòng hoặc chia sẻ danh mục của mình sang các thiết bị khác bằng nút <strong className="text-blue-600">Khôi phục</strong>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">5. Tùy chỉnh hình nền động & tĩnh</h4>
                  <p>Bấm vào nút hình bánh răng cấu hình (<DynamicIcon name="Sliders" size={12} className="inline mx-1" />) ở góc dưới menu sidebar để thay đổi giao diện theo tâm trạng với kho hình ảnh tĩnh, video chuyển động 3D lỏng, dải màu gradient cực sống động và họa tiết chấm lưới sang trọng!</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4 text-right shrink-0">
                <button
                  onClick={() => setGuideOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
                >
                  Tôi đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL DIALOG */}
      <AnimatePresence>
        {isModalOpen && (
          <AddEditModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onSave={handleSaveItem}
            editingItem={editingItem}
            categories={categoriesList.filter(c => c !== 'Tất cả')}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
