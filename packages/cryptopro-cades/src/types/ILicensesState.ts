import { ILicense } from './ILicense';

/**
 * Информация о лицензиях продуктов КриптоПро.
 */
export interface ILicensesState {
  /** КриптоПро CSP */
  csp: ILicense | null;

  /** КриптоПро OCSP Client */
  tsp: ILicense | null;

  /** КриптоПро TSP Client */
  ocsp: ILicense | null;
}
