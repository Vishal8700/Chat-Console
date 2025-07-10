// src/components/Weather/icons/weatherIcons.jsx
export const SunnyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="5" stroke="orange" strokeWidth="2" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="orange" strokeWidth="2" />
  </svg>
);

export const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 16h14a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4z" stroke="gray" strokeWidth="2" />
  </svg>
);

export const RainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 16h14a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4z" stroke="blue" strokeWidth="2" />
    <line x1="8" y1="20" x2="8" y2="22" stroke="blue" strokeWidth="2" />
    <line x1="12" y1="20" x2="12" y2="22" stroke="blue" strokeWidth="2" />
    <line x1="16" y1="20" x2="16" y2="22" stroke="blue" strokeWidth="2" />
  </svg>
);

export const SnowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <text x="6" y="18" fontSize="18" fill="lightblue">❄️</text>
  </svg>
);

export const WindIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 12h10a3 3 0 0 1 0 6H8" stroke="teal" strokeWidth="2" />
  </svg>
);

export const DropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-12z" stroke="skyblue" strokeWidth="2" />
  </svg>
);

export const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="white" />
    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" stroke="white" strokeWidth="2" />
  </svg>
);

export const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 4v6h6" stroke="white" strokeWidth="2" />
    <path d="M20 20v-6h-6" stroke="white" strokeWidth="2" />
    <path d="M5 19a9 9 0 1 0 2-14" stroke="white" strokeWidth="2" />
  </svg>
);

export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="red" strokeWidth="2" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="red" strokeWidth="2" />
  </svg>
);

export const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" stroke="white" strokeWidth="2" />
  </svg>
);
