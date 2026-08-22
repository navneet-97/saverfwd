import './Badge.css';

export default function Badge({ children, color, bg, className = '' }) {
  const style = {};
  if (color) style.color = color;
  if (bg) style.background = bg;

  return (
    <span className={`badge ${className}`} style={style}>
      {children}
    </span>
  );
}
