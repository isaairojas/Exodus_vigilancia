/**
 * Figma: "Inicio sesión"
 * nodeId: 2:113
 * URL: https://www.figma.com/design/GWE1jyD5ZyUbvLUsk6pVkx/?node-id=2-113
 * Última sincronización: 2026-10-28
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button/Button';
import { SelectField, TextField } from '../../design-system/components/atoms/Field/Field';
import { cedisMock, usuarioMock, versionApp } from '../../mocks/acceso';
import { useSession } from '../../navigation/session';
import logoApymsa from '../../assets/icons/logo-apymsa.svg';
import vcard from '../../assets/icons/vcard.svg';
import candado from '../../assets/icons/candado.svg';
import ojo from '../../assets/icons/ojo.svg';
import cedisIcon from '../../assets/icons/cedis.svg';
import avatarRing from '../../assets/icons/avatar-ring.svg';
import avatar from '../../assets/images/avatar.png';
import './InicioSesion.css';

export function InicioSesion() {
  const navigate = useNavigate();
  const session = useSession();
  const [usuario, setUsuario] = useState(session.usuario);
  const [contrasena, setContrasena] = useState(usuarioMock.contrasena);
  const [verContrasena, setVerContrasena] = useState(false);
  const [cedis, setCedis] = useState(session.cedis);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    session.iniciar(usuario, cedis);
    navigate('/acceso/menu');
  };

  return (
    <div className="inicio-sesion">
      <img className="inicio-sesion__logo" src={logoApymsa} alt="Apymsa" />
      <div className="inicio-sesion__back-card" />
      <form className="inicio-sesion__sheet" onSubmit={onSubmit}>
        <p className="inicio-sesion__headline">Inicio de sesión</p>
        <p className="inicio-sesion__subtitle">Ingresa tus credenciales para continuar</p>
        <div className="inicio-sesion__inputs">
          <TextField
            label="Usuario"
            icon={<img src={vcard} alt="" width={21.56} height={16.17} />}
            paddingLeft={13}
            gap={11}
            fontSize={14}
            inputMode="numeric"
            autoComplete="username"
            value={usuario}
            onChange={setUsuario}
          />
          <TextField
            label="Contraseña"
            icon={<img src={candado} alt="" width={15.022} height={18.778} />}
            paddingLeft={17}
            gap={13}
            fontSize={20}
            type={verContrasena ? 'text' : 'password'}
            autoComplete="current-password"
            value={contrasena}
            onChange={setContrasena}
            trailing={
              <button
                type="button"
                className="ds-field__trailing-btn"
                aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setVerContrasena((v) => !v)}
              >
                <img src={ojo} alt="" />
              </button>
            }
          />
          <SelectField
            ariaLabel="CEDIS"
            icon={<img src={cedisIcon} alt="" width={17.826} height={17.603} />}
            value={cedis}
            options={cedisMock}
            onChange={setCedis}
          />
        </div>
        <Button type="submit">Iniciar sesión</Button>
        <div className="inicio-sesion__version">{versionApp}</div>
        <div className="inicio-sesion__photo">
          <img className="inicio-sesion__photo-ring" src={avatarRing} alt="" />
          <div className="inicio-sesion__photo-inner">
            <img src={avatar} alt="" width={84} height={84} />
          </div>
        </div>
      </form>
    </div>
  );
}
