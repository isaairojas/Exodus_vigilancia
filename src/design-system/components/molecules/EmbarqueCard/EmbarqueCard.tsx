/**
 * Figma: tarjeta de embarque "Frame 285" (565:6781) — Head + Total cajas / Escaneadas / Restantes
 * Última sincronización: 2026-10-28
 */
import statTotal from '../../../../assets/icons/stat-total.svg';
import statEscaneadas from '../../../../assets/icons/stat-escaneadas.svg';
import statRestantes from '../../../../assets/icons/stat-restantes.svg';
import './EmbarqueCard.css';

interface EmbarqueCardProps {
  destino: string;
  folio: string;
  total: number;
  escaneadas: number;
}

export function EmbarqueCard({ destino, folio, total, escaneadas }: EmbarqueCardProps) {
  const stats = [
    { label: 'Total cajas', icon: statTotal, value: total, height: 28.846 },
    { label: 'Escaneadas', icon: statEscaneadas, value: escaneadas, height: 29.026 },
    { label: 'Restantes', icon: statRestantes, value: total - escaneadas, height: 28.846 },
  ];
  return (
    <div className="ds-embarque">
      <div className="ds-embarque__head">
        <p className="ds-embarque__destino">{destino}</p>
        <p className="ds-embarque__folio">FOLIO EMB: {folio}</p>
      </div>
      <div className="ds-embarque__body">
        {stats.map((s) => (
          <div key={s.label} className="ds-embarque__stat">
            <p className="ds-embarque__stat-label">{s.label}</p>
            <div className="ds-embarque__stat-value">
              <img src={s.icon} alt="" width={28.846} height={s.height} />
              <span>{s.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
