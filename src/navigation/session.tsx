import { createContext, useContext, useState, type ReactNode } from 'react';
import { cedisMock, rolesDe, usuarioMock } from '../mocks/acceso';

interface Session {
  usuario: string;
  nombre: string;
  cedis: string;
  /** Roles del usuario; se evalúan en cada inicio de sesión (ERB-48103). */
  roles: string[];
  iniciar: (usuario: string, cedis: string) => void;
  cerrar: () => void;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState(usuarioMock.numero);
  const [cedis, setCedis] = useState(cedisMock[0]);
  const [roles, setRoles] = useState(rolesDe(usuarioMock.numero));

  return (
    <SessionContext.Provider
      value={{
        usuario,
        // Solo existe un nombre en el diseño (I139:3541;111:1208)
        nombre: usuarioMock.nombre,
        cedis,
        roles,
        iniciar: (u, c) => {
          setUsuario(u);
          setCedis(c);
          setRoles(rolesDe(u));
        },
        cerrar: () => {
          setUsuario(usuarioMock.numero);
          setRoles(rolesDe(usuarioMock.numero));
        },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de SessionProvider');
  return ctx;
}
