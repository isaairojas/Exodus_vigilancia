/**
 * Figma: "Ventana de configuración de operación" (730:5223) — Configuraciones (730:5261)
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=730-5261
 * Última sincronización: 2026-10-29
 */
import { useNavigate } from 'react-router-dom';
import { Divider } from '../../design-system/components/atoms/Divider/Divider';
import { ConfigCard } from '../../design-system/components/molecules/ProcesoCard/ProcesoCard';
import { AppHeader } from '../../design-system/components/organisms/AppHeader/AppHeader';
import { Sheet } from '../../design-system/components/organisms/Sheet/Sheet';
import { useRegresar } from '../../navigation/botones';
import { useSession } from '../../navigation/session';
import configPrint from '../../assets/icons/config-print.svg';
import './Configuracion.css';

export function Configuraciones() {
  const navigate = useNavigate();
  const session = useSession();
  const regresar = () => navigate('/acceso/menu');
  useRegresar(regresar);

  return (
    <div className="config">
      <AppHeader onBack={regresar} userName={session.nombre} userId={session.usuario} />
      <Sheet variant="module" style={{ gap: 6, paddingTop: 22 }}>
        <div className="config__titulo-bloque">
          <p className="config__titulo">Configuraciones</p>
          <Divider />
        </div>
        <div className="config__lista">
          <ConfigCard
            icon={configPrint}
            titulo="Impresión"
            descripcion="Procesos de impresión y gestión de impresoras"
            onClick={() => navigate('/configuracion/impresion')}
          />
          <div />
        </div>
      </Sheet>
    </div>
  );
}
