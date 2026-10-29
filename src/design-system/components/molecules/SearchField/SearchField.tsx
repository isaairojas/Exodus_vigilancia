/**
 * Figma: "Buscador" (558:4625)
 * Última sincronización: 2026-10-28
 */
import searchIcon from '../../../../assets/icons/search.svg';
import './SearchField.css';

interface SearchFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ placeholder, value, onChange }: SearchFieldProps) {
  return (
    <label className="ds-search">
      <img src={searchIcon} alt="" width={18} height={18} />
      <input
        className="ds-search__input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
