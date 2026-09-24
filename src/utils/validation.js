/**
 * Known registered phone numbers in seed database.
 */
const EXISTING_SEEDED_PHONES = [
  '9876543210', // Kishore Kumar
  '9160442966', // Customer Support / Super Admin
];

/**
 * Checks if a phone number already exists in the system.
 * @param {string} rawPhone - The phone number string.
 * @param {string|null} currentUserId - The ID of the currently authenticated user (optional).
 * @returns {boolean} true if phone number already exists for a different user account.
 */
export const checkIsPhoneDuplicate = (rawPhone, currentUserId = null) => {
  if (!rawPhone) return false;
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) return false;
  const last10 = cleanPhone.slice(-10);

  // Check if current logged-in user already owns this phone number
  if (typeof window !== 'undefined') {
    const currentUserStr = localStorage.getItem('referearn_user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        const userCleanPhone = currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '').slice(-10) : '';
        if (userCleanPhone && userCleanPhone === last10) {
          return false; // Owner is editing their own verified phone number
        }
      } catch (e) {}
    }
  }

  // Check against seeded phone numbers
  if (EXISTING_SEEDED_PHONES.includes(last10)) {
    return true;
  }

  // Check against registered phone numbers saved in localStorage
  if (typeof window !== 'undefined') {
    const registeredListStr = localStorage.getItem('referearn_registered_phones');
    if (registeredListStr) {
      try {
        const registeredList = JSON.parse(registeredListStr);
        if (Array.isArray(registeredList)) {
          const match = registeredList.find(
            (item) => item.phone === last10 && (currentUserId ? String(item.userId) !== String(currentUserId) : true)
          );
          if (match) return true;
        }
      } catch (e) {}
    }
  }

  return false;
};

/**
 * Registers a unique phone number into storage.
 */
export const registerUserPhone = (rawPhone, userId = null) => {
  if (!rawPhone || typeof window === 'undefined') return;
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) return;
  const last10 = cleanPhone.slice(-10);

  const registeredListStr = localStorage.getItem('referearn_registered_phones');
  let registeredList = [];
  if (registeredListStr) {
    try {
      registeredList = JSON.parse(registeredListStr);
    } catch (e) {}
  }

  if (!registeredList.some((item) => item.phone === last10)) {
    registeredList.push({ phone: last10, userId });
    localStorage.setItem('referearn_registered_phones', JSON.stringify(registeredList));
  }
};
