'use client'

import { ArrowLeft, CreditCard, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const paymentMethods = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/24' },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '10/25' },
]

export default function MetodosPagamentoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      <div className="flex items-center gap-4 p-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-[#1c1e34] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold">Métodos de Pagamento</h1>
      </div>

      <div className="px-6 space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="p-4 bg-[#1c1e34] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-[#3b46f1]" />
              <div>
                <p className="font-semibold">{method.type} •••• {method.last4}</p>
                <p className="text-[#aea9b1] text-sm">Expira em {method.expiry}</p>
              </div>
            </div>
            <button className="text-[#3b46f1]">Editar</button>
          </div>
        ))}

        <button className="w-full p-4 bg-[#1c1e34] rounded-2xl flex items-center justify-center gap-2 text-[#3b46f1]">
          <Plus className="w-6 h-6" />
          <span>Adicionar novo método de pagamento</span>
        </button>
      </div>
    </div>
  )
}

