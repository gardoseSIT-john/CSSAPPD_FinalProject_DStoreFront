/**
 * Everything brand-specific lives here, so the name, copy and CEO details
 * change in one place. Pictures go in the public/images/ folder.
 */
export const BRAND = {
  name: 'D STORE',
  tagline: 'Everyday pieces, picked with intent.',

  // the moving text band under the hero
  notices: [
    'Support hours from 8AM to 11PM',
    'Choose your drop-off point at checkout',
    'New pieces added every week',
    'Follow the community on Instagram',
  ],

  // the note at the bottom of the home page
  ceo: {
    name: 'Your Name',
    title: 'Founder & CEO',
    photo: '/images/ceo.jpg',
    signature: '/images/signature.png',
    // 'dark' = signed in black/blue ink (it gets turned white on the dark page)
    // 'light' = the signature image is already white
    signatureInk: 'dark' as 'dark' | 'light',
    heading: 'Picked by hand. Worn by us first.',
    message:
      'Every piece on this shelf passed one test: would we wear it out ourselves? ' +
      'If the answer is no, it does not make the drop. Thank you for shopping small ' +
      'and for trusting us with your rotation.',
    signOff: 'See you at the drop-off,',
  },
};
