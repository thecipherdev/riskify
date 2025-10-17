interface FormValues {
  portfolioAmount: number;
  stopLoss: number;
  riskLevel: number;
  leverage: number;
}

interface CalculationResult {
  margin: number;
  maxLoss: number;
  positionSize: number;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form?.addEventListener('submit', handleCalculate);

  const tooltipMessage = [
    '💡 This is your total trading capital, the full amount in your account available for trading.',
    '💡 The percentage distance from your entry price where the position will automatically close to limit losses',
    "💡 The portion of your total account you're willing to risk on this single trade (e.g., 1% means you risk 1% of your account balance).",
    '⚠️ Leverage amplifies both gains and losses. Higher leverage means higher potential profits, but also higher risk of liquidation.',
  ];

  const tooltips = document.querySelectorAll('.tooltip');

  tooltips.forEach((tooltip, idx) => {
    if (tooltipMessage[idx]) {
      const tooltipText = document.createElement('span');
      tooltipText.className = 'tooltip-text';
      tooltipText.textContent = tooltipMessage[idx];
      tooltip.appendChild(tooltipText);
    }
  });
});

function handleCalculate(e: SubmitEvent) {
  e.preventDefault();

  const formValues = getFormValues(e.target as HTMLFormElement);

  if (!formValues) return;

  const results = calculateRisk(formValues);
  updateUI(results);
}

function calculateRisk(values: FormValues): CalculationResult {
  const {portfolioAmount, stopLoss, riskLevel, leverage} = values;

  const riskDecimal = riskLevel / 100;
  const stopLossDecimal = stopLoss / 100;

  const maxLoss = portfolioAmount * riskDecimal;
  const positionSize = stopLossDecimal > 0 ? maxLoss / stopLossDecimal : 0;
  const margin = leverage > 0 ? positionSize / leverage : 0;

  return {maxLoss, positionSize, margin};
}

function updateUI(results: CalculationResult): void {
  document.getElementById('margin__result')!.textContent = formatCurrency(
    results.margin,
  );
  document.getElementById('maximum-loss__result')!.textContent = formatCurrency(
    results.maxLoss,
  );
  document.getElementById('position-size__result')!.textContent =
    formatCurrency(results.positionSize);
}

function getFormValues(form: HTMLFormElement): FormValues | null {
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  const values: FormValues = {
    portfolioAmount: parseFloat(formValues['portfolio-amount'] as string) || 0,
    stopLoss: parseFloat(formValues['stop-loss'] as string) || 0,
    riskLevel: parseFloat(formValues['risk-level'] as string) || 0,
    leverage: parseFloat(formValues['leverage'] as string) || 0,
  };

  return values;
}

function formatCurrency(val: number, locale = 'en-US') {
  return val.toLocaleString(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
}
