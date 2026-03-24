# Agent Guidelines for Risk Management Calculator

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

Risk Management Calculator is a Chrome extension for trading risk calculations. The codebase is written in TypeScript with Google TypeScript Style (gts).

## Build, Lint, and Test Commands

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile TypeScript to JavaScript (runs `tsc`) |
| `npm run lint` | Run gts lint to check code style |
| `npm run fix` | Auto-fix lint issues using gts |
| `npm run clean` | Clean build output |
| `npm run prepare` | Run before package installation (runs compile) |

### Running Tests

This project uses **gts** (Google TypeScript Style) which includes a test runner. To run tests:

```bash
npm test
```

This will:
1. Compile TypeScript (`npm run pretest`)
2. Run tests
3. Run linting (`npm run posttest`)

To run a **single test file**, use:

```bash
npx gts run-tests <test-file-path>
```

Or directly with Jest (if configured):

```bash
npx jest <test-file-path>
```

## Code Style Guidelines

### General

- **Indentation**: 2 spaces (enforced by `.editorconfig`)
- **Line endings**: LF (Unix-style)
- **Encoding**: UTF-8
- **Final newline**: Always insert (enforced by `.editorconfig`)

### TypeScript Configuration

- Strict mode is **enabled** in `tsconfig.json`
- `noUncheckedIndexedAccess`: enabled
- `exactOptionalPropertyTypes`: enabled
- `isolatedModules`: enabled
- `moduleDetection`: force

### Imports and Path Aliases

- Use path alias `@typings/*` for custom types in `./types/`
- Example: `import type { FormValues } from '@typings/form';`

```typescript
// Good
import type { FormValues, CalculationResult } from '@typings/form';
import { someFunction } from './utils/store';

// Avoid relative paths when possible
```

### Naming Conventions

- **Interfaces**: PascalCase, prefixed with descriptive name (e.g., `FormValues`, `CalculationResult`)
- **Types**: PascalCase (e.g., `FormValues`)
- **Functions**: camelCase (e.g., `handleCalculate`, `saveFormData`)
- **Variables**: camelCase (e.g., `formState`, `maxLoss`)
- **Files**: kebab-case (e.g., `debounce.ts`, `store.ts`)

```typescript
// Interface naming
interface FormValues {
  capital: number;
  sl: number;
  risk: number;
  leverage: number;
}

// Function naming
function calculateRisk(values: FormValues): CalculationResult { ... }
const handleCalculate = (e: SubmitEvent) => { ... };
```

### Type Annotations

- Always enable strict TypeScript checking
- Use explicit return types for exported functions
- Use `type` for type aliases, `interface` for object shapes

```typescript
// Good
function calculateRisk(values: FormValues): CalculationResult {
  // ...
}

// Good - use type for unions/aliases
export type { FormValues, CalculationResult };
```

### Error Handling

- Use try-catch blocks for potentially failing operations
- Always log errors for debugging
- Provide fallback values where appropriate

```typescript
// Good
function saveFormData(vals: Partial<FormValues>): void {
  try {
    // ... save logic
  } catch (e) {
    console.log(e);
  }
}
```

### Chrome Extension Specific

- Use `/// <reference types="chrome-types" />` for Chrome API types
- Access DOM elements with proper type casting

```typescript
/// <reference types="chrome-types" />

// Good - proper type casting
const form = document.getElementById('form') as HTMLFormElement;
const input = document.querySelector('input[name="capital"]') as HTMLInputElement;
```

### Code Organization

- Put reusable utilities in `utils/` directory
- Put type definitions in `types/` directory
- Put main scripts in `scripts/` directory
- Keep related functionality together

### Linting

The project uses **gts** (Google TypeScript Style) for linting. Run `npm run lint` to check for issues, and `npm run fix` to auto-fix them.

### What to Avoid

- Do not use `any` type unless absolutely necessary
- Do not disable strict TypeScript checks
- Do not commit build output (`build/` directory)
- Do not use console.log in production code (use sparingly for debugging)

## Development Workflow

1. Make changes to TypeScript source files
2. Run `npm run compile` to check for TypeScript errors
3. Run `npm run lint` to check code style
4. Run `npm run fix` to auto-fix lint issues if any
5. Test the changes manually (this is a Chrome extension)

## Chrome Extension Notes

- This is a Chrome extension using Manifest V3
- Entry point: `scripts/index.ts`
- Builds to `build/` directory
- Types are defined in `types/form.ts`
