import type {FormValues, CalculationResult} from '@typings/form';

document.addEventListener('DOMContentLoaded', () => {
  let formState: FormValues = {
    capital: 0,
    sl: 0,
    risk: 0,
    leverage: 0,
  };

  const debouncedSave = debounce(saveFormData, 500);

  hydrateUIInput(formState);

  const form = document.getElementById('form');
  form?.addEventListener('submit', handleCalculate);
  form?.addEventListener('input', e => {
    const {name, value} = e.target as HTMLInputElement;

    if (name in formState) {
      formState[name as keyof FormValues] = parseFloat(value) || 0;
    }

    debouncedSave(formState);
  });

  const clearBtn = document.getElementById('clear-btn');
  clearBtn?.addEventListener('click', () => {
    formState = {capital: 0, sl: 0, risk: 0, leverage: 0};
    const inputs = form?.querySelectorAll('input');
    inputs?.forEach(input => {
      input.value = '';
    });
    clearFormData();
    updateUI({margin: 0, maxLoss: 0, positionSize: 0});
  });

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

function hydrateUIInput(formState: FormValues) {
  void loadFormData().then(data => {
    if (!data.formData) return;

    const {capital, sl, risk, leverage} = data.formData;

    const cp = document.querySelector(
      'input[name="capital"]',
    ) as HTMLInputElement;
    const stop = document.querySelector('input[name="sl"]') as HTMLInputElement;
    const r = document.querySelector('input[name="risk"]') as HTMLInputElement;
    const lev = document.querySelector(
      'input[name="leverage"]',
    ) as HTMLInputElement;

    cp.value = capital || '';
    stop.value = sl || '';
    r.value = risk || '';
    lev.value = leverage || '';

    formState.capital = parseFloat(capital) || 0;
    formState.sl = parseFloat(sl) || 0;
    formState.risk = parseFloat(risk) || 0;
    formState.leverage = parseFloat(leverage) || 0;

    const results = calculateRisk(formState);
    updateUI(results);
  });
}

function handleCalculate(e: SubmitEvent) {
  e.preventDefault();

  const formValues = getFormValues(e.target as HTMLFormElement);

  if (!formValues) return;

  const results = calculateRisk(formValues);
  updateUI(results);
}

function calculateRisk(values: FormValues): CalculationResult {
  const {capital, sl, risk, leverage} = values;

  const riskDecimal = risk / 100;
  const stopLossDecimal = sl / 100;

  const maxLoss = capital * riskDecimal;
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

function getFormValues(form: HTMLFormElement): FormValues {
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  const values: FormValues = {
    capital: parseFloat(formValues['capital'] as string) || 0,
    sl: parseFloat(formValues['sl'] as string) || 0,
    risk: parseFloat(formValues['risk'] as string) || 0,
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

function saveFormData(vals: Partial<FormValues>): void {
  try {
    const {sl, capital, risk, leverage} = vals;
    void chrome.storage.local.set({
      formData: {
        capital: capital || '',
        sl: sl || '',
        risk: risk || '',
        leverage: leverage || '',
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function loadFormData() {
  return chrome.storage.local.get('formData');
}

function clearFormData(): void {
  void chrome.storage.local.set({
    formData: {
      capital: '',
      sl: '',
      risk: '',
      leverage: '',
    },
  });
}

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  delay: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export {debounce};
