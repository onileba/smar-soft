export const siteConfig = {
  name: 'SmarSoFT',
  domain: 'smar-soft.com',
  siteUrl: 'https://smar-soft.com',
  alternateSiteUrl: 'https://www.smar-soft.com',
  email: 'contacto@smar-soft.com',
  phone: '+52 (000) 000 0000',
  location: 'México | Atención remota y presencial según proyecto',
  legalName: 'SmarSoFT',
  description:
    'Consultoría tecnológica y fábrica de software para empresas que requieren diagnóstico, arquitectura, integración y desarrollo a medida con enfoque de negocio.',
  socialImage: '/og-default.svg',
  defaultSeoTitle: 'SmarSoFT | Consultoría tecnológica y fábrica de software',
  defaultSeoDescription:
    'SmarSoFT ayuda a empresas a diagnosticar, diseñar, integrar y construir soluciones de software con criterio técnico y enfoque de negocio.',
  keywords:
    'consultoría tecnológica, fábrica de software, desarrollo a medida, integración de sistemas, arquitectura de software, modernización tecnológica',
  brand: {
    primary: '#05202b',
    accent: '#00bf9a',
    white: '#ffffff',
    black: '#000000',
    heroImage: '/brand/office-hero.jpg',
  },
};

export const contactPlaceholders = {
  address: '[Pendiente definir domicilio fiscal y/o comercial]',
  privacyEmail: '[Pendiente definir correo para datos personales]',
};

export const socialLinks = [
  {
    label: 'LinkedIn',
    href: '[Pendiente definir URL LinkedIn]',
  },
  {
    label: 'X',
    href: '[Pendiente definir URL X]',
  },
  {
    label: 'Facebook',
    href: '[Pendiente definir URL Facebook]',
  },
];

export const mainNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/fabrica-de-software', label: 'Fábrica de software' },
  { href: '/consultoria', label: 'Consultoría' },
  { href: '/tecnologias', label: 'Tecnologías' },
  { href: '/contacto', label: 'Contacto' },
];

export const footerNavigation = [
  ...mainNavigation,
  { href: '/aviso-de-privacidad', label: 'Aviso de privacidad' },
];
