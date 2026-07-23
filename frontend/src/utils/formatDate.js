/**
 * Format tanggal ke format Indonesia
 * Input: "2024-01-15" atau Date object
 * Output: "15 Januari 2024"
 */
export const formatDateIndonesia = (dateString) => {
  if (!dateString) return "-";

  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  const tanggal = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${tanggal} ${namaBulan} ${tahun}`;
};
