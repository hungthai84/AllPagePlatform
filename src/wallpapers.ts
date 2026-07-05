export interface Wallpaper {
  id: string;
  name: string;
  type: 'image' | 'video' | 'gradient' | 'pattern';
  url?: string;
  thumbnail?: string;
  css?: string;
  bgColor?: string;
  bgSize?: string;
}

export const IMAGE_WALLPAPERS: Wallpaper[] = [
  {
    id: 'img_1',
    name: 'Minimalist White',
    type: 'image',
    url: 'https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg',
    thumbnail: 'https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg'
  },
  {
    id: 'img_2',
    name: 'Geometric Mountain',
    type: 'image',
    url: 'https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg',
    thumbnail: 'https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg'
  },
  {
    id: 'img_3',
    name: 'Yên Bình 15',
    type: 'image',
    url: 'https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg',
    thumbnail: 'https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg'
  },
  {
    id: 'img_4',
    name: 'Yên Bình 14',
    type: 'image',
    url: 'https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg',
    thumbnail: 'https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg'
  },
  {
    id: 'img_5',
    name: 'Yên Bình 13',
    type: 'image',
    url: 'https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg',
    thumbnail: 'https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg'
  },
  {
    id: 'img_6',
    name: 'Yên Bình 12',
    type: 'image',
    url: 'https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg',
    thumbnail: 'https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg'
  },
  {
    id: 'img_7',
    name: 'Ngọc Lan Sáng',
    type: 'image',
    url: 'https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg',
    thumbnail: 'https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg'
  },
  {
    id: 'img_8',
    name: 'Bầu Trời Tuyệt Đẹp',
    type: 'image',
    url: 'https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg',
    thumbnail: 'https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg'
  },
  {
    id: 'img_9',
    name: 'Bình Minh Số 2',
    type: 'image',
    url: 'https://i.ibb.co/rKL4ffH2/2.jpg',
    thumbnail: 'https://i.ibb.co/rKL4ffH2/2.jpg'
  },
  {
    id: 'img_10',
    name: 'Lá Phổi Xanh',
    type: 'image',
    url: 'https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg',
    thumbnail: 'https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg'
  },
  {
    id: 'img_11',
    name: 'Ánh Kim Ngọc Trai',
    type: 'image',
    url: 'https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg',
    thumbnail: 'https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg'
  },
  {
    id: 'img_12',
    name: 'Tranh Nghệ Thuật',
    type: 'image',
    url: 'https://i.ibb.co/Fc1dczn/Wallpaper.jpg',
    thumbnail: 'https://i.ibb.co/Fc1dczn/Wallpaper.jpg'
  },
  {
    id: 'img_13',
    name: 'Trừu Tượng 15',
    type: 'image',
    url: 'https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg',
    thumbnail: 'https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg'
  },
  {
    id: 'img_14',
    name: 'Pastel Thơ Mộng',
    type: 'image',
    url: 'https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg',
    thumbnail: 'https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg'
  },
  {
    id: 'img_15',
    name: 'Sóng Màu 14',
    type: 'image',
    url: 'https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg',
    thumbnail: 'https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg'
  },
  {
    id: 'img_16',
    name: 'Hài Hòa 13',
    type: 'image',
    url: 'https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg',
    thumbnail: 'https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg'
  },
  {
    id: 'img_17',
    name: 'Không Gian Sáng 16',
    type: 'image',
    url: 'https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg',
    thumbnail: 'https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg'
  },
  {
    id: 'img_18',
    name: 'Vòng Tròn Gradient',
    type: 'image',
    url: 'https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg',
    thumbnail: 'https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free'
  },
  {
    id: 'img_19',
    name: 'Tĩnh Tâm Tự Tại',
    type: 'image',
    url: 'https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg',
    thumbnail: 'https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg'
  }
];

export const VIDEO_WALLPAPERS: Wallpaper[] = [
  {
    id: 'vid_1',
    name: 'Huyền Ảo 3D',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4'
  },
  {
    id: 'vid_2',
    name: 'Hạt Trôi Nổi',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/9438742/file/original-9334dd4051bb585cc561e8be06870b39.mp4'
  },
  {
    id: 'vid_3',
    name: 'Vòng Xoáy Cực Quang',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/4241992/file/original-1fcb82b5ace105f3ec88a2deb08e842d.mp4'
  },
  {
    id: 'vid_4',
    name: 'Làn Sóng Tương Lai',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/34993295/file/original-2ea4b30fcd7c6eac3ca0f4d5bfd3d67b.mp4'
  },
  {
    id: 'vid_5',
    name: 'Bong Bóng Pha Lê',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/32536603/file/original-db8060ba2540c3bf1cd2f30b4984cd51.mp4'
  },
  {
    id: 'vid_6',
    name: 'Trừu Tượng Lỏng',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/32480516/file/original-f4a88d4031fee315e3175bf1834c24b4.mp4'
  },
  {
    id: 'vid_7',
    name: 'Kính Vạn Hoa',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/32404914/file/original-57644971c47c0d16f90a68404a5e65c1.mp4'
  },
  {
    id: 'vid_8',
    name: 'Neon Lấp Lánh',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/16365481/file/original-527fee647d12f31fce8a309ad136c4bb.mp4'
  },
  {
    id: 'vid_9',
    name: 'Thác Nước Công Nghệ',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/15594644/file/original-6008d4b0ddcff73c116cb7989a144a71.mp4'
  },
  {
    id: 'vid_10',
    name: 'Đường Cong Mềm Mại',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/14779635/file/original-1aca59fc5dc52bee9dcd291a27effcbf.mp4'
  },
  {
    id: 'vid_11',
    name: 'Sương Khói Gradient',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/10782874/file/original-06f7280dda982b62cd9452b0da032598.mp4'
  },
  {
    id: 'vid_12',
    name: 'Cát Chảy Vàng',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/32524948/file/original-3c68e4ad227ae70e1875ef71289be2b0.mp4',
    thumbnail: 'https://i.postimg.cc/jS3rSGdF/videoframe-8901.png'
  },
  {
    id: 'vid_13',
    name: 'Tia Sáng Không Gian',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4',
    thumbnail: 'https://i.postimg.cc/BnmJ1jNN/videoframe-3046.png'
  },
  {
    id: 'vid_14',
    name: 'Đại Dương Tím',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/16718734/file/original-f2df9314dbf922d5452d7a8a5885d744.mp4',
    thumbnail: 'https://i.postimg.cc/NfYtJ6zp/videoframe-1990.png'
  },
  {
    id: 'vid_15',
    name: 'Mây Khói Thần Tiên',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/43797830/file/original-b9bafe56dd75a7ae175f827cfc662738.mp4',
    thumbnail: 'https://i.postimg.cc/yNJW1hB0/videoframe-3097.png'
  },
  {
    id: 'vid_16',
    name: 'Giải Thiên Hà Vàng',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/16365364/file/original-dcc3ad4c0f5802c6670d36fcca720e5e.mp4',
    thumbnail: 'https://i.postimg.cc/vBgPtKyD/videoframe-4678.png'
  },
  {
    id: 'vid_17',
    name: 'Hành Tinh Ma Thuật',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/43797856/file/original-46c91cbdf46a3cbc3f30a85f061ed817.mp4',
    thumbnail: 'https://i.postimg.cc/L6TVLSPN/videoframe-3537.png'
  },
  {
    id: 'vid_18',
    name: 'Dòng Sông Ánh Sáng',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/12532568/file/original-816b8af88c5a4336e9f0467a7848033e.mp4'
  },
  {
    id: 'vid_19',
    name: 'Gợn Sóng Kỹ Thuật Số',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/9535990/file/original-3a87c5fdf2433287d096795a11fa9ee4.mp4'
  },
  {
    id: 'vid_20',
    name: 'Hòa Âm Thần Bí',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/13253460/file/original-85659da2508a303a516780470e3ae354.mp4'
  },
  {
    id: 'vid_21',
    name: 'Mặt Trời Neon',
    type: 'video',
    url: 'https://cdn.dribbble.com/userupload/9783516/file/original-47f57ffecea5c7874ff6d6c2f0ce42bf.mp4'
  }
];

export const GRADIENT_WALLPAPERS: Wallpaper[] = [
  {
    id: 'grad_dyn',
    name: 'Sóng Màu Động (Animated)',
    type: 'gradient',
    css: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
  },
  {
    id: 'grad_1',
    name: 'Tím Xanh Hiện Đại',
    type: 'gradient',
    css: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'
  },
  {
    id: 'grad_2',
    name: 'Đại Dương Xanh',
    type: 'gradient',
    css: 'linear-gradient(45deg, #13547a 0%, #80d0c7 100%)'
  },
  {
    id: 'grad_3',
    name: 'Hoàng Hôn Ấm Áp',
    type: 'gradient',
    css: 'linear-gradient(45deg, #ed6ea0 0%, #ec8c69 100%)'
  },
  {
    id: 'grad_4',
    name: 'Đêm Vũ Trụ',
    type: 'gradient',
    css: 'linear-gradient(45deg, #000428 0%, #004e92 100%)'
  },
  {
    id: 'grad_5',
    name: 'Rừng Khuya Sâu Thẳm',
    type: 'gradient',
    css: 'linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
  },
  {
    id: 'grad_6',
    name: 'Xanh Thép Mạnh Mẽ',
    type: 'gradient',
    css: 'linear-gradient(45deg, #373b44 0%, #4286f4 100%)'
  },
  {
    id: 'grad_7',
    name: 'Sương Mai Thủy Chung',
    type: 'gradient',
    css: 'linear-gradient(45deg, #7028e4 0%, #e5b2ca 100%)'
  },
  {
    id: 'grad_8',
    name: 'Hải Quân Uy Nghi',
    type: 'gradient',
    css: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)'
  },
  {
    id: 'grad_9',
    name: 'Kem Dâu Ngọt Ngào',
    type: 'gradient',
    css: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'grad_10',
    name: 'Hồng Ngọc Quyến Rũ',
    type: 'gradient',
    css: 'linear-gradient(45deg, #0250c5 0%, #d43f8d 100%)'
  }
];

export const PATTERN_WALLPAPERS: Wallpaper[] = [
  {
    id: 'pat_planets',
    name: 'Hành Tinh Quỹ Đạo',
    type: 'pattern',
    thumbnail: 'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    url: 'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    id: 'pat_dotted_light',
    name: 'Họa Tiết Chấm Sáng',
    type: 'pattern',
    css: 'radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)',
    bgColor: '#e0e7ed',
    bgSize: '10px 10px'
  },
  {
    id: 'pat_dotted_dark',
    name: 'Họa Tiết Chấm Tối',
    type: 'pattern',
    css: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
    bgColor: '#1d1f20',
    bgSize: '11px 11px'
  }
];
