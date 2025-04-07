class Formatter {
  static formatNumber(number, decimals = 0) {
    if (typeof number !== 'number' || isNaN(number)) return 'N/A'; // Added isNaN check
    return number.toLocaleString('en-US', { // Changed undefined locale to en-US
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  static formatUSD(number, decimals = 0) {
    if (typeof number !== 'number' || isNaN(number)) return 'N/A'; // Added isNaN check
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }

  static formatPercentage(number, decimals = 2) {
    if (typeof number !== 'number' || isNaN(number)) return 'N/A'; // Added isNaN check
     // Assuming input is like 0.1 for 10%
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(number);
    // Original implementation: return `${(number * 100).toFixed(decimals)}%`;
  }

  // --- NEW METHOD ---
  static formatShortUSD(number) {
    if (typeof number !== 'number' || isNaN(number)) return 'N/A';

    if (Math.abs(number) >= 1e6) { // Millions
      return '$' + (number / 1e6).toFixed(1) + 'M';
    } else if (Math.abs(number) >= 1e3) { // Thousands
      return '$' + (number / 1e3).toFixed(0) + 'k'; // Usually no decimals for 'k'
    } else { // Less than 1000
      return this.formatUSD(number, 0); // Use existing formatUSD for smaller numbers, no decimals
    }
  }
  // --- END NEW METHOD ---
}

export default Formatter;