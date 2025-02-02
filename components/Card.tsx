interface CardProps {
  card: {
    type: string
    name: string
    amount: number
    number: string
    color: string
    availableBalance: number
    totalDeposited: number
  }
  onClick: () => void
  cardType: 'total' | 'available'
}

// Card background color is set to a darker shade of green (#006400)
// You can adjust this color by changing the --card-bg-color CSS variable
export const Card: React.FC<CardProps> = ({ card, onClick, cardType }) => {
  return (
    <div
      className="flex-shrink-0 w-[320px] h-[160px] rounded-3xl p-4 flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
      style={{ 
        "--card-bg-color": cardType === 'total' ? "#006400" : "#4B0082",
        backgroundColor: "var(--card-bg-color)" 
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <img
          src="https://v0.blob.com/visa-white.png"
          alt="Visa"
          className="h-6"
        />
        {card.type === 'VISA/MC' && (
          <img
            src="https://v0.blob.com/mastercard.png"
            alt="Mastercard"
            className="h-6"
          />
        )}
      </div>
      <div className="text-white">
        <p className="text-sm mb-1">{cardType === 'total' ? 'Saldo Disponível' : 'Disponível para Compra'}</p>
        <p className="text-xl font-semibold mb-2">
          $ {(cardType === 'total' ? card.totalDeposited : card.availableBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-sm">{cardType === 'total' ? 'Total Deposited' : 'Available Balance'}</p>
      </div>
    </div>
  )
}

