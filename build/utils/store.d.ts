import type { FormValues } from '@typings/form';
declare function saveFormData(vals: Partial<FormValues>): void;
declare function loadFormData(): Promise<{
    [name: string]: any;
}>;
export { saveFormData, loadFormData };
//# sourceMappingURL=store.d.ts.map