interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ title, onClick, disabled = false, className = '' }: ButtonProps) => {
  console.debug('abc');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {title}
    </button>
  );
};

export default Button;
