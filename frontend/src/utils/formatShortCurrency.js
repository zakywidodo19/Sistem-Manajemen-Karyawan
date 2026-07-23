export const formatShortCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(2)} M`;
  }

  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(2)} Jt`;
  }

  return `Rp ${Number(amount).toLocaleString("id-ID")}`;
};