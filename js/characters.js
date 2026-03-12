/**
 * 10 travelers (from places that rarely know 鹹酥雞) + environment hotspots.
 * Each traveler has flag emoji for visible hotspot badge.
 */
window.CHARACTERS = {
  travelers: [
    { id: 'traveler-iceland',     country: 'Iceland',      name: 'Traveler from Iceland',      flag: '🇮🇸' },
    { id: 'traveler-mongolia',    country: 'Mongolia',    name: 'Traveler from Mongolia',    flag: '🇲🇳' },
    { id: 'traveler-bhutan',      country: 'Bhutan',       name: 'Traveler from Bhutan',      flag: '🇧🇹' },
    { id: 'traveler-madagascar',  country: 'Madagascar',   name: 'Traveler from Madagascar',  flag: '🇲🇬' },
    { id: 'traveler-paraguay',    country: 'Paraguay',     name: 'Traveler from Paraguay',    flag: '🇵🇾' },
    { id: 'traveler-slovenia',    country: 'Slovenia',     name: 'Traveler from Slovenia',    flag: '🇸🇮' },
    { id: 'traveler-namibia',     country: 'Namibia',     name: 'Traveler from Namibia',     flag: '🇳🇦' },
    { id: 'traveler-albania',     country: 'Albania',      name: 'Traveler from Albania',     flag: '🇦🇱' },
    { id: 'traveler-greenland',   country: 'Greenland',    name: 'Traveler from Greenland',   flag: '🇬🇱' },
    { id: 'traveler-bolivia',     country: 'Bolivia',      name: 'Traveler from Bolivia',     flag: '🇧🇴' }
  ]
};

/**
 * Hotspot positions. Use `flag` for travelers (emoji), `icon` for env (emoji or short text).
 */
window.HOTSPOT_CONFIG = [
  { id: 'stall',            left: 120,  top: '35%', width: 200, height: 180, label: 'Fried chicken stall', icon: '🍗' },
  { id: 'stall-buy',        left: 260,  top: '55%', width: 100, height: 50,  label: 'Buy a bag',           icon: '🛒' },
  { id: 'oil-pot',          left: 30,   top: '42%', width: 80,  height: 70,  label: 'Oil pot',             icon: '🍳' },
  { id: 'lantern',          left: 360,  top: '15%', width: 60,  height: 90,  label: 'Lantern',             icon: '🏮' },
  { id: 'basil',            left: 220,  top: '48%', width: 70,  height: 50,  label: 'Basil leaves',        icon: '🌿' },
  { id: 'traveler-iceland',     left: 520,  top: '45%', width: 90,  height: 140, label: 'Traveler from Iceland',     flag: '🇮🇸' },
  { id: 'traveler-mongolia',    left: 720,  top: '42%', width: 90,  height: 140, label: 'Traveler from Mongolia',    flag: '🇲🇳' },
  { id: 'traveler-bhutan',      left: 920,  top: '48%', width: 90,  height: 140, label: 'Traveler from Bhutan',      flag: '🇧🇹' },
  { id: 'traveler-madagascar',  left: 1120, top: '45%', width: 90,  height: 140, label: 'Traveler from Madagascar',  flag: '🇲🇬' },
  { id: 'traveler-paraguay',    left: 1320, top: '42%', width: 90,  height: 140, label: 'Traveler from Paraguay',    flag: '🇵🇾' },
  { id: 'traveler-slovenia',    left: 1520, top: '48%', width: 90,  height: 140, label: 'Traveler from Slovenia',    flag: '🇸🇮' },
  { id: 'traveler-namibia',     left: 1720, top: '45%', width: 90,  height: 140, label: 'Traveler from Namibia',     flag: '🇳🇦' },
  { id: 'traveler-albania',     left: 1920, top: '42%', width: 90,  height: 140, label: 'Traveler from Albania',     flag: '🇦🇱' },
  { id: 'traveler-greenland',   left: 2120, top: '48%', width: 90,  height: 140, label: 'Traveler from Greenland',   flag: '🇬🇱' },
  { id: 'traveler-bolivia',     left: 2320, top: '45%', width: 90,  height: 140, label: 'Traveler from Bolivia',     flag: '🇧🇴' }
];

/**
 * Dialogue: your script. Speaker uses flag + country for travelers.
 */
window.HOTSPOT_DIALOGUES = {
  stall: {
    speaker: 'The stall',
    lines: [
      'Golden fried chicken pieces, basil, and garlic in a paper bag. The smell alone is worth the wait.'
    ]
  },
  'oil-pot': {
    speaker: '',
    lines: [
      'The oil is hot. Everything goes in and comes out crispy. You can hear it from here.'
    ]
  },
  lantern: {
    speaker: '',
    lines: [
      'Red lanterns glow above the street. It\'s 2 AM but the night is still alive here.'
    ]
  },
  basil: {
    speaker: '',
    lines: [
      'That\'s basil — "nine-layer tower" in Chinese. They fry it with the chicken. It\'s not just decoration.'
    ]
  },
  'stall-buy': {
    speaker: 'Vendor',
    lines: [
      'One bag? Coming right up.'
    ]
  },
  'traveler-iceland': {
    speaker: '🇮🇸 Traveler from Iceland',
    lines: [
      'It\'s 2AM… why is the street so alive?',
      'Is that… boiling oil?'
    ]
  },
  'traveler-mongolia': {
    speaker: '🇲🇳 Traveler from Mongolia',
    lines: [
      'You fry… mushrooms too?',
      'In Mongolia we grill meat.'
    ]
  },
  'traveler-bhutan': {
    speaker: '🇧🇹 Traveler from Bhutan',
    lines: [
      'Does this come with chili?',
      'Ah… now it makes sense.'
    ]
  },
  'traveler-madagascar': {
    speaker: '🇲🇬 Traveler from Madagascar',
    lines: [
      'Something smells amazing.',
      'Garlic?'
    ]
  },
  'traveler-paraguay': {
    speaker: '🇵🇾 Traveler from Paraguay',
    lines: [
      'One bag for one person?',
      'No, for friends.'
    ]
  },
  'traveler-slovenia': {
    speaker: '🇸🇮 Traveler from Slovenia',
    lines: [
      'Fried basil?',
      'I didn\'t know leaves could be fried.'
    ]
  },
  'traveler-namibia': {
    speaker: '🇳🇦 Traveler from Namibia',
    lines: [
      'This place is more crowded than our markets.'
    ]
  },
  'traveler-albania': {
    speaker: '🇦🇱 Traveler from Albania',
    lines: [
      'It\'s crunchy… but soft.'
    ]
  },
  'traveler-greenland': {
    speaker: '🇬🇱 Traveler from Greenland',
    lines: [
      'This is the warmest night food I\'ve ever had.'
    ]
  },
  'traveler-bolivia': {
    speaker: '🇧🇴 Traveler from Bolivia',
    lines: [
      'Is this a festival?',
      'No… just a normal night.'
    ]
  }
};
