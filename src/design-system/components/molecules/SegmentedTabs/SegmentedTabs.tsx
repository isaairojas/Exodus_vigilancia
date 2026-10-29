/**
 * Figma: selector "Procesos impresión | Impresoras" (730:6198 / 730:6543)
 * Última sincronización: 2026-10-29
 */
import './SegmentedTabs.css';

interface SegmentedTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  selectedId: T;
  onSelect: (id: T) => void;
}

export function SegmentedTabs<T extends string>({ tabs, selectedId, onSelect }: SegmentedTabsProps<T>) {
  return (
    <div className="ds-segmented" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === selectedId}
          className={`ds-segmented__tab${t.id === selectedId ? ' ds-segmented__tab--selected' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
