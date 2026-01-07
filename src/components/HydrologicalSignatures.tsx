import { useI18n } from '../i18n';
import MetricCard from './MetricCard';
import RoundedPanel from './ui/RoundedPanel';
import type { Signatures } from '../utils/types';

interface HydrologicalSignaturesProps {
  metrics: Signatures;
  signatureUnits: Record<string, string>;
}

/**
 * HydrologicalSignatures - Metrics grid for hydrological signatures
 * 
 * Renders a grid of MetricCard components for displaying hydrological
 * signature metrics (mean_q, q1, q95, etc.) with their units.
 * 
 * @example
 * ```tsx
 * <HydrologicalSignatures 
 *   metrics={metricsData}
 *   signatureUnits={{ mean_q: 'm³/s', q1: 'm³/s' }}
 * />
 * ```
 */
export default function HydrologicalSignatures({ metrics, signatureUnits }: HydrologicalSignaturesProps) {
  const { t } = useI18n();

  return (
    <RoundedPanel>
      <h3>{t('hydrological_signatures')}</h3>
      <div className="flex gap-3 flex-wrap">
        {Object.entries(metrics).map(([name, value]) => (
          <MetricCard key={name} name={name} value={value} unit={signatureUnits[name]} />
        ))}
      </div>
    </RoundedPanel>
  );
}
