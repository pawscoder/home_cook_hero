interface Props {
  onSpin: () => void
}

export default function SpinButton({ onSpin }: Props) {
  return (
    <button className="spin-btn" onClick={onSpin}>
      Spin 🎲
    </button>
  )
}
