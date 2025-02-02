"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Package, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

interface ShipmentCard {
  id: string
  invoice_number: string
  destination: string
  eta: string
  tracking_number: string
  status: "in-transit" | "delivered" | "pending"
  amount?: number
}

interface ShipmentReport {
  total: number
  inTransit: number
  delivered: number
  pending: number
}

export default function LogisticsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  useAuth()

  const [activeShipments, setActiveShipments] = useState<ShipmentCard[]>([])
  const [shipmentReport, setShipmentReport] = useState<ShipmentReport>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  })
  const [deliveredOrders, setDeliveredOrders] = useState<ShipmentCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<ShipmentCard | null>(null)

  useEffect(() => {
    fetchShipmentData()
  }, [])

  const fetchShipmentData = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const shipments = data.map((shipment) => ({
        ...shipment,
        amount: shipment.amount || undefined,
      })) as ShipmentCard[]

      setActiveShipments(shipments.slice(0, 5))

      const report = shipments.reduce(
        (acc, shipment) => {
          acc.total++
          acc[shipment.status === "in-transit" ? "inTransit" : shipment.status]++
          return acc
        },
        { total: 0, inTransit: 0, delivered: 0, pending: 0 } as ShipmentReport,
      )
      setShipmentReport(report)

      setDeliveredOrders(shipments.filter((shipment) => shipment.status === "delivered"))
    } catch (error) {
      console.error("Error fetching shipment data:", error)
      showToast("Failed to load shipment data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (shipment: ShipmentCard) => {
    setSelectedShipment(shipment)
    setIsInvoiceModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10002B] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#10002B] text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Your Shipments</h1>
            <p className="text-gray-400">You have {shipmentReport.total} total shipments</p>
          </div>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {activeShipments.map((shipment) => (
            <Card
              key={shipment.id}
              className="flex-shrink-0 w-[300px] h-[220px] rounded-3xl p-6 bg-[#3C096C] text-white border-none cursor-pointer"
              onClick={() => handleCardClick(shipment)}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Invoice #{shipment.invoice_number}</h3>
                  <p className="text-sm text-gray-200 mb-2">To: {shipment.destination}</p>
                  <p className="text-sm text-gray-200 mb-2">Tracking: {shipment.tracking_number}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {shipment.status === "delivered" ? "Delivered" : "Shipped"}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      shipment.status === "delivered"
                        ? "bg-green-500"
                        : shipment.status === "in-transit"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Shipment Report */}
      <div className="mx-6 mt-8 p-6 bg-[#240046] rounded-3xl">
        <h2 className="text-2xl font-semibold mb-6">Shipment Report</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Total Shipments</span>
            <span className="font-semibold">{shipmentReport.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-200">In Transit</span>
            <span className="font-semibold">{shipmentReport.inTransit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Delivered</span>
            <span className="font-semibold">{shipmentReport.delivered}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Pending</span>
            <span className="font-semibold">{shipmentReport.pending}</span>
          </div>
        </div>
      </div>

      {/* Delivered Orders History */}
      <div className="px-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Delivered Orders History</h2>
        <div className="space-y-6">
          {deliveredOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between bg-[#3C096C] p-4 rounded-xl cursor-pointer"
              onClick={() => handleCardClick(order)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#16ab13] flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Invoice #{order.invoice_number}</p>
                  <p className="text-sm text-gray-400">Delivered to: {order.destination}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.amount !== undefined ? `$${order.amount.toFixed(2)}` : "N/A"}</p>
                <p className="text-sm text-gray-400">Tracking: {order.tracking_number}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="bg-[#3C096C] text-white">
          <DialogHeader>
            <DialogTitle>
              {selectedShipment ? `Invoice #${selectedShipment.invoice_number}` : "Invoice Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedShipment && (
              <>
                <p>Destination: {selectedShipment.destination}</p>
                <p>Tracking Number: {selectedShipment.tracking_number}</p>
                <p>Status: {selectedShipment.status}</p>
                <p>
                  Amount: {selectedShipment.amount !== undefined ? `$${selectedShipment.amount.toFixed(2)}` : "N/A"}
                </p>
                <p>ETA: {selectedShipment.eta}</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

