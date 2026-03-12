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
  { id: 'garlic-pile',      left: 180,  top: '56%', width: 70,  height: 60,  label: 'Chopped garlic',      icon: '🧄' },
  { id: 'sauce-bottles',    left: 330,  top: '52%', width: 80,  height: 70,  label: 'Sauce bottles',       icon: '🧂' },
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
    image: 'https://images.unsplash.com/photo-1762944080344-7f15c77f70a1?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Golden fried chicken pieces, basil, and garlic in a paper bag. The smell alone is worth the wait.',
      'When you\'re ready to buy a bag, I might need a hand catching a few things and watching the oil — then it\'s yours.'
    ]
  },
  'oil-pot': {
    speaker: '',
    image: 'https://images.unsplash.com/photo-1762224180896-5761d5bbe90f?w=600&q=80&auto=format&fit=crop',
    lines: [
      'The oil is hot. Everything goes in and comes out crispy. You can hear it from here.',
      'One wrong moment and it\'s burnt; one right moment and it\'s perfect. That\'s the game.'
    ]
  },
  lantern: {
    speaker: '',
    image: 'https://images.unsplash.com/photo-1743704458905-382b8a261d20?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Red lanterns glow above the street. It\'s 2 AM but the night is still alive here.',
      'Back home the streets would be empty. Here they\'re just getting started.'
    ]
  },
  basil: {
    speaker: '',
    image: 'https://images.unsplash.com/photo-1749655248287-d1e0acb5f8d1?w=600&q=80&auto=format&fit=crop',
    lines: [
      'That\'s basil — "nine-layer tower" in Chinese. They fry it with the chicken. It\'s not just decoration.',
      'Crispy leaves and golden chicken in the same bag. Don\'t ask, just try.'
    ]
  },
  'garlic-pile': {
    speaker: '',
    image: 'https://images.unsplash.com/photo-1760445529922-ca58ca23c3a7?w=600&q=80&auto=format&fit=crop',
    lines: [
      'This whole corner is just garlic waiting to be chopped.',
      'The faster you chop, the more the whole street smells like midnight snacks.'
    ]
  },
  'sauce-bottles': {
    speaker: '',
    image: 'https://images.unsplash.com/photo-1656269457984-bd54c519129a?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Sweet, spicy, basil salt, seaweed pepper… every stall has its own mix.',
      'Get the order wrong and the locals will know immediately.'
    ]
  },
  'stall-buy': {
    speaker: 'Vendor',
    image: 'https://images.unsplash.com/photo-1695654398992-125945541043?w=600&q=80&auto=format&fit=crop',
    lines: [
      'One bag? Help me catch a few ingredients and time the fry, then it\'s coming right up.'
    ]
  },
  'traveler-iceland': {
    speaker: '🇮🇸 Traveler from Iceland',
    image: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=600&q=80&auto=format&fit=crop',
    lines: [
      'At 2 AM where I\'m from, you only see the northern lights. Maybe a sheep.',
      'Here? A whole street of people waiting for… fried chicken?',
      'I thought I was dreaming. Then I smelled the garlic.'
    ]
  },
  'traveler-mongolia': {
    speaker: '🇲🇳 Traveler from Mongolia',
    image: 'https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?w=600&q=80&auto=format&fit=crop',
    lines: [
      'We grill meat over fire. Big pieces. No oil.',
      'You put mushrooms in the same pot? And leaves?',
      'I didn\'t know you could fry leaves. I want to try.'
    ]
  },
  'traveler-bhutan': {
    speaker: '🇧🇹 Traveler from Bhutan',
    image: 'https://images.unsplash.com/photo-1578556881786-851d4b79cb73?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Does this come with chili? We put chili on everything.',
      'Ah, garlic and basil… and that smell. Okay.',
      'Now it makes sense. I\'ll take some.'
    ]
  },
  'traveler-madagascar': {
    speaker: '🇲🇬 Traveler from Madagascar',
    image: 'https://images.unsplash.com/photo-1570742544137-3a469196c32b?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Something in the air… vanilla? No. Spices.',
      'Garlic. And something green — basil? We use herbs too, but not like this.',
      'I need to taste that.'
    ]
  },
  'traveler-paraguay': {
    speaker: '🇵🇾 Traveler from Paraguay',
    image: 'https://images.unsplash.com/photo-1614949260630-1d8a27791215?w=600&q=80&auto=format&fit=crop',
    lines: [
      'One bag for one person? That\'s a lot of chicken.',
      'Oh — you share. We do that too. One big thing, everyone eats.',
      'So this is for friends. At 2 in the morning. I like it.'
    ]
  },
  'traveler-slovenia': {
    speaker: '🇸🇮 Traveler from Slovenia',
    image: 'https://images.unsplash.com/photo-1478088913771-e3a36f50bb63?w=600&q=80&auto=format&fit=crop',
    lines: [
      'You fry the leaves? We put basil in soup.',
      'I didn\'t know leaves could be fried. And crunchy?',
      'The chicken and the leaves in one bag. I\'m convinced.'
    ]
  },
  'traveler-namibia': {
    speaker: '🇳🇦 Traveler from Namibia',
    image: 'https://images.unsplash.com/photo-1563985336376-568060942b80?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Our markets are busy. But not at 2 AM.',
      'This is more crowded than our busiest day. And everyone is here for… this?',
      'I have to see what the fuss is about.'
    ]
  },
  'traveler-albania': {
    speaker: '🇦🇱 Traveler from Albania',
    image: 'https://images.unsplash.com/photo-1623167278440-fd212b72e1bd?w=600&q=80&auto=format&fit=crop',
    lines: [
      'I bit into something. Crunchy on the outside.',
      'Then soft. Chicken? And the green stuff — also crunchy. Weird. Good.',
      'I need another piece to understand.'
    ]
  },
  'traveler-greenland': {
    speaker: '🇬🇱 Traveler from Greenland',
    image: 'https://images.unsplash.com/photo-1537267013710-d7b37fa331b3?w=600&q=80&auto=format&fit=crop',
    lines: [
      'It\'s cold where I\'m from. Even at night in summer.',
      'This is the warmest night food I\'ve ever had. In your hands, in the bag.',
      'I get it now. You don\'t eat this in a hurry.'
    ]
  },
  'traveler-bolivia': {
    speaker: '🇧🇴 Traveler from Bolivia',
    image: 'https://images.unsplash.com/photo-1544142447-e43d0fe04bf2?w=600&q=80&auto=format&fit=crop',
    lines: [
      'Is this a festival? A holiday? Why is everyone here?',
      'No? Just… a normal night. People just come for fried chicken at 2 AM.',
      'Okay. I\'m staying. I want a bag too.'
    ]
  }
};
