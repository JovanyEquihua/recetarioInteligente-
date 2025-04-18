"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { X, Check, ChevronRight, ChevronLeft } from "lucide-react"

const sabores = [
  { id: 'dulce', nombre: 'Dulce', icono: '🍰' },
  { id: 'salado', nombre: 'Salado', icono: '🍟' },
  { id: 'amargo', nombre: 'Amargo', icono: '🍫' },
  { id: 'acido', nombre: 'Ácido', icono: '🍋' },
  { id: 'umami', nombre: 'Umami', icono: '🍄' }
]

const tiposComida = [
  { id: 'italiana', nombre: 'Italiana', icono: '🍝' },
  { id: 'mexicana', nombre: 'Mexicana', icono: '🌮' },
  { id: 'asiatica', nombre: 'Asiática', icono: '🍜' },
  { id: 'mediterranea', nombre: 'Mediterránea', icono: '🥗' },
  { id: 'americana', nombre: 'Americana', icono: '🍔' }
]

export default function PreferenciasWizard({ onComplete, onClose }) {
 
  const [step, setStep] = useState(1)
  const [selectedSabores, setSelectedSabores] = useState([])
  const [selectedTiposComida, setSelectedTiposComida] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { update } = useSession();
  const toggleSabor = (saborId) => {
    setSelectedSabores(prev => 
      prev.includes(saborId) 
        ? prev.filter(id => id !== saborId) 
        : [...prev, saborId]
    )
  }

  const toggleTipoComida = (tipoId) => {
    setSelectedTiposComida(prev => 
      prev.includes(tipoId) 
        ? prev.filter(id => id !== tipoId) 
        : prev.length < 3 
          ? [...prev, tipoId] 
          : prev
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const preferencias = {
        sabores: selectedSabores,
        tiposComida: selectedTiposComida
      }

      const res = await fetch('/api/usuario/preferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          preferencias,
          primerInicioSesion: false 
        })
      })

      if (!res.ok) throw new Error('Error al guardar preferencias')

        await update();

      setSuccess(true)
      setTimeout(() => onComplete(), 1500)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-xl font-bold text-gray-800">Configura tus preferencias</h2>
         
        </div>

        {/* Barra de progreso horizontal */}
        <div className="px-6 pt-2 pb-4">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-[#8B1C62] -translate-y-1/2 z-10 transition-all duration-300" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-20">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-[#8B1C62] text-white' : 'bg-white border-2 border-gray-300 text-gray-400'}`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                <p className="text-xs text-center mt-1 text-gray-600">
                  {s === 1 ? 'Sabores' : s === 2 ? 'Comidas' : 'Listo'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Selecciona tus sabores favoritos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sabores.map(sabor => (
                  <button
                    key={sabor.id}
                    type="button"
                    onClick={() => toggleSabor(sabor.id)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${selectedSabores.includes(sabor.id) ? 'border-[#8B1C62] bg-[#8B1C62]/10' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="text-2xl mb-2">{sabor.icono}</span>
                    <span>{sabor.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Elige hasta 3 tipos de comida preferidos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tiposComida.map(tipo => (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => toggleTipoComida(tipo.id)}
                    disabled={selectedTiposComida.length >= 3 && !selectedTiposComida.includes(tipo.id)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${selectedTiposComida.includes(tipo.id) ? 'border-[#8B1C62] bg-[#8B1C62]/10' : 'border-gray-200 hover:border-gray-300'} ${selectedTiposComida.length >= 3 && !selectedTiposComida.includes(tipo.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-2xl mb-2">{tipo.icono}</span>
                    <span>{tipo.nombre}</span>
                  </button>
                ))}
              </div>
              {selectedTiposComida.length > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  Seleccionados: {selectedTiposComida.length}/3
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center py-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Todo listo!</h3>
              <p className="text-gray-600 mb-6">
                Hemos guardado tus preferencias. Ahora podemos recomendarte recetas que se ajusten a tu gusto.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-gray-800 mb-2">Tus preferencias:</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Sabores:</span> {selectedSabores.map(id => sabores.find(s => s.id === id).nombre).join(', ')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Tipos de comida:</span> {selectedTiposComida.map(id => tiposComida.find(t => t.id === id).nombre).join(', ')}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-center">
              <Check className="inline mr-2" size={16} />
              Preferencias guardadas correctamente
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="border-t p-4 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`px-4 py-2 rounded-md ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#8B1C62] hover:bg-[#8B1C62]/10'}`}
          >
            <ChevronLeft className="inline mr-1" size={18} />
            Anterior
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && selectedSabores.length === 0) ||
                (step === 2 && selectedTiposComida.length === 0)
              }
              className={`px-4 py-2 rounded-md ${((step === 1 && selectedSabores.length === 0) || (step === 2 && selectedTiposComida.length === 0)) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#8B1C62] text-white hover:bg-[#9e2a70]'}`}
            >
              Siguiente
              <ChevronRight className="inline ml-1" size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 bg-[#8B1C62] text-white rounded-md hover:bg-[#9e2a70] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin inline mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : 'Finalizar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}