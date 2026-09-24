import { affiliateApi } from '../services/api';

/**
 * Format string into a valid external URL with https:// protocol if missing
 */
export const formatExternalUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

/**
 * Handles redirecting the user after login/registration/onboarding.
 * If a target product referral link or product ID was saved, redirect directly to the external product link.
 * Otherwise, navigate to the default user dashboard.
 */
const DEFAULT_PRODUCT_LINKS = {
  '1': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-1': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  '2': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-2': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  '3': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-3': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  '4': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-4': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  '5': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-5': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  '6': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
  'prod-6': 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ',
};

export const PRIMARY_REFERRAL_REDIRECT_URL = 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ';

export const handlePostAuthRedirect = async (navigate) => {
  if (typeof window === 'undefined') {
    return;
  }

  const targetProductLink = localStorage.getItem('referearn_target_product_link');
  const targetProductId = localStorage.getItem('referearn_target_product_id');
  const referrerCode = localStorage.getItem('referearn_referrer_code');

  // Clear target product pointers & referrer code from storage after consuming
  localStorage.removeItem('referearn_target_product_link');
  localStorage.removeItem('referearn_target_product_id');
  localStorage.removeItem('referearn_referrer_code');

  // If user was referred by someone or joined via referral/product link:
  if (targetProductLink && targetProductLink.trim()) {
    const finalUrl = formatExternalUrl(targetProductLink);
    window.location.href = finalUrl;
    return;
  }

  if (targetProductId) {
    try {
      const product = await affiliateApi.getProductById(targetProductId);
      const link = product?.product_link || product?.productLink || DEFAULT_PRODUCT_LINKS[targetProductId];
      if (link && link.trim()) {
        const finalUrl = formatExternalUrl(link);
        window.location.href = finalUrl;
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch product for redirect', e);
      const fallbackLink = DEFAULT_PRODUCT_LINKS[targetProductId] || PRIMARY_REFERRAL_REDIRECT_URL;
      if (fallbackLink) {
        window.location.href = formatExternalUrl(fallbackLink);
        return;
      }
    }
  }

  if (referrerCode && referrerCode.trim()) {
    window.location.href = PRIMARY_REFERRAL_REDIRECT_URL;
    return;
  }

  // Direct website visit (no referral intent): navigate directly to user dashboard
  if (navigate) {
    navigate('/app/dashboard', { replace: true });
  } else {
    window.location.href = '/app/dashboard';
  }
};

