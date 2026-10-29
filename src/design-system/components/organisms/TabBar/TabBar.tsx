/**
 * Figma: "Tabs" (558:4702 / 558:4621) con instancias de "Secondary tabs/Icon and label" (553:3468)
 * Última sincronización: 2026-10-28
 */
import type { ReactNode } from 'react';
import './TabBar.css';

export interface TabItem {
  id: string;
  icon: ReactNode;
  label?: string;
  /** El ícono ocupa todo el ancho disponible (pestaña de paquetería, I558:4703;54563:40396). */
  wideIcon?: boolean;
}

interface TabBarProps {
  tabs: TabItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function TabBar({ tabs, selectedId, onSelect }: TabBarProps) {
  return (
    <div className="ds-tabbar" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === selectedId}
          aria-label={t.label ? undefined : t.id}
          className="ds-tab"
          onClick={() => onSelect(t.id)}
        >
          <span className={`ds-tab__state-layer${t.wideIcon ? ' ds-tab__state-layer--logo' : ''}`}>
            <span className={`ds-tab__contents${t.wideIcon ? ' ds-tab__contents--wide' : ''}`}>
              <span className="ds-tab__icon">{t.icon}</span>
              {t.label && <span className="ds-tab__label">{t.label}</span>}
            </span>
            {t.id === selectedId && <span className="ds-tab__indicator" />}
          </span>
        </button>
      ))}
    </div>
  );
}
