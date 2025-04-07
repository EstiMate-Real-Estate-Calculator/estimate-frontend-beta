class Formatter {
  static formatNumber(number, decimals = 0) {
    if (typeof number !== 'number') return 'N/A';
    return number.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  static formatUSD(number, decimals = 0) {
    if (typeof number !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }

  static formatPercentage(number, decimals = 2) {
    if (typeof number !== 'number') return 'N/A';
    return `${(number * 100).toFixed(decimals)}%`;
  }
}

export default Formatter;
