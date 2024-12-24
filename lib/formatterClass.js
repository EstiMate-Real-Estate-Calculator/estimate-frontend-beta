export default class Formatter {
  // Static method to format a number as USD
  static formatUSD(amount) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    return formattedPrice;
  }

  // Static method for formatting USD as shorthand (k or m)
  static formatShortUSD(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Invalid amount';
    }

    const absAmount = Math.abs(amount);
    let formattedAmount;

    if (absAmount >= 1e6) {
      // Millions
      formattedAmount = `${(amount / 1e6).toFixed(1)}m`;
    } else if (absAmount >= 1e3) {
      // Thousands
      formattedAmount = `${(amount / 1e3).toFixed(1)}k`;
    } else {
      formattedAmount = amount.toString();
    }

    return `$${formattedAmount.replace(/\.0$/, '')}`;
  }

  // Static method to format a percentage to the hundredths place
  static formatPercentage(value) {
    return `${(value * 100).toFixed(2)} %`;
  }
}
