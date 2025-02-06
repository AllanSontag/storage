'use client'

import { ArrowLeft, Plus, ArrowRight, Car, Wallet, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MenuItem {
  id: number
  title: string
  subtitle?: string
  icon: React.ReactNode
  color: string
  href: string
}

export default function MenuPage() {
  const router = useRouter()

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Buy New',
      subtitle: 'FASTag',
      icon: <ArrowRight className="w-6 h-6 text-white" />,
      color: '#1fb85c',
      href: '/buy-fastag'
    },
    {
      id: 2,
      title: 'Vehicle',
      subtitle: 'Recharge',
      icon: <Car className="w-6 h-6 text-white" />,
      color: '#6750a4',
      href: '/vehicle-recharge'
    },
    {
      id: 3,
      title: 'Wallet',
      subtitle: 'Recharge',
      icon: <Wallet className="w-6 h-6 text-white" />,
      color: '#6750a4',
      href: '/wallet-recharge'
    },
    {
      id: 4,
      title: 'Auto',
      subtitle: 'Recharge',
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      color: '#e46962',
      href: '/auto-recharge'
    }
  ]

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold">FASTag</h1>
      </div>

      {/* Add New Vehicle Card */}
      <div className="mx-6 mb-6">
        <button 
          onClick={() => router.push('/add-vehicle')}
          className="w-full p-8 bg-[#564ef5] rounded-3xl flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#a5fe33] flex items-center justify-center mb-2">
            <Plus className="w-8 h-8 text-[#111113]" />
          </div>
          <h2 className="text-2xl font-semibold">Add New Vehicle</h2>
          <p className="text-gray-300">Click to proceed</p>
        </button>
      </div>

      {/* Menu Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className="p-6 rounded-3xl flex flex-col items-center text-center"
              style={{ backgroundcolor: item.color }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm text-white/80">{item.subtitle}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <button 
          onClick={() => router.push('/continue')}
          className="w-full py-4 bg-[#1c1e34] rounded-full font-semibold"
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}

