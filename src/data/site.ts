import { Armchair, Coffee, Projector, Users, Wifi } from 'lucide-react';

export const LOGO_SRC = '/images/logo-full-white.png';
export const LOGO_TABLET_SRC = '/images/logo-long-white.png';
export const LOGO_MOBILE_SRC = '/images/logo-min-white.png'
;
export const NAV_LINKS = [
  { href: '#space', label: 'Пространство' },
  { href: '#architecture', label: 'Архитектура' },
  { href: '#scenarios', label: 'Сценарии' },
  { href: '#booking', label: 'Бронирование' },
  { href: '#contacts', label: 'Контакты' },
] as const;

export const EVENT_FORMATS = [
  'Лекции и презентации',
  'Мастер-классы и воркшопы',
  'Корпоративные мероприятия',
  'Частные и бренд-события',
] as const;

export type EventFormat = (typeof EVENT_FORMATS)[number];

export const HERO_VIDEO_MP4_SRC = '/videos/ARKA123_HERO_web_1440p.mp4';
export const HERO_VIDEO_MOBILE_MP4_SRC = '/videos/ARKA123_HERO_mobile_4x5.mp4';
export const HERO_VIDEO_POSTER_SRC = '/images/images-web-03.webp';
export const LOCATION_IMAGE_SRC = '/images/images-web-0.webp';
export const ABOUT_IMAGE_SRC = '/images/images-web-08.webp';

export const BRAND_STORY_POSTER_SRC = '/images/brand-section-poster.webp';
export const BRAND_STORY_VIDEO_SRC = '/videos/ARKA123_BRAND_STORY_web_1080p.mp4';
export const BRAND_STORY_MOBILE_VIDEO_SRC = '/videos/ARKA123_BRAND_STORY_mobile_4x5.mp4';
export const BRAND_STORY_MOBILE_POSTER_SRC = '/images/brand-section-poster-mobile.webp';

export const ARCHITECTURE_PHOTOS = [
  {
    src: '/images/images-web-03.webp',
    alt: 'Арочные окна и городская панорама в светлом зале',
    caption: 'Арочные окна и геометрия',
  },
  {
    src: '/images/images-web-06.webp',
    alt: 'Стеклянные перегородки и зонирование пространства',
    caption: 'Стеклянные перегородки',
  },
  {
    src: '/images/images-web-04.webp',
    alt: 'Колонны и линейные светильники в структуре помещения',
    caption: 'Колонны и потолок',
  },
] as const;

export const FACILITY_ITEMS = [
  {
    icon: Users,
    title: 'Вместимость',
    text: 'До 40 гостей. Итоговое количество зависит от выбранной рассадки и сценария мероприятия.',
  },
  {
    icon: Armchair,
    title: 'Мебель и зонирование',
    text: 'Поможем подобрать и организовать расстановку столов и стульев под ваш формат: лекционная, переговорная, рабочая или свободная конфигурация. Комплектация согласовывается заранее.',
  },
  {
    icon: Projector,
    title: 'Техническое оснащение',
    text: 'Если для мероприятия необходимы проектор, экран, акустика, микрофоны или другое оборудование, обсудим возможность их организации и стоимость до бронирования.',
  },
  {
    icon: Coffee,
    title: 'Кофейная зона',
    text: 'Возможность организовать кофе-паузу и комфортное общение участников.',
  },
  {
    icon: Wifi,
    title: 'Wi-Fi',
    text: 'Доступ к беспроводному интернету для работы, обучения и презентаций.',
  },
] as const;

export const PRICING_ROWS = [
  { duration: '3 часа', price: '390 BYN' },
  { duration: '4 часа', price: '520 BYN' },
  { duration: '5 часов', price: '650 BYN' },
  { duration: '6 часов', price: '780 BYN' },
  { duration: '8 часов', price: '1 040 BYN' },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    index: '01',
    title: 'Расскажите о мероприятии',
    text: 'Оставьте заявку и укажите дату, количество гостей и формат события.',
  },
  {
    index: '02',
    title: 'Согласуем детали',
    text: 'Обсудим продолжительность аренды, рассадку, мебель и необходимые технические решения.',
  },
  {
    index: '03',
    title: 'Подготовим пространство',
    text: 'Согласуем конфигурацию зала и подготовим его к вашему мероприятию.',
  },
  {
    index: '04',
    title: 'Проведите своё событие',
    text: 'Приезжайте в ARKA 123 и сосредоточьтесь на главном — ваших гостях, идеях и впечатлениях.',
  },
] as const;

export const SCENARIOS = [
  {
    index: '00',
    title: 'Исходное пространство',
    text: 'Пустой зал без рассадки и оформления. Это стартовая точка, от которой начинается любой сценарий.',
    image: '/images/images-web-09.png',
    alt: 'Пустой светлый зал с паркетом ёлочкой и часами на стене',
  },
  {
    index: '01',
    title: 'Творческие встречи',
    text: 'Мастер-классы и воркшопы. Зал перестраивается под работу в небольших группах и живую практику за общим столом.',
    image: '/images/scenario-floristry.png',
    alt: 'Участники мастер-класса составляют цветочную композицию',
  },
  {
    index: '02',
    title: 'Лекции и презентации',
    text: 'Выступление спикера с экраном и рядами кресел. Ясная сцена, хорошая акустика и внимание аудитории на главном.',
    image: '/images/scenario-lecture.png',
    alt: 'Докладчик представляет материал аудитории перед экраном',
  },
  {
    index: '03',
    title: 'Командные события',
    text: 'Корпоративные квизы и игры за круглыми столами. Группы сидят лицом друг к другу, а разговор идёт легко.',
    image: '/images/scenario-quiz.png',
    alt: 'Участники командного квиза за круглыми столами',
  },
] as const;
