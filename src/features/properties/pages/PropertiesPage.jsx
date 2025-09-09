import React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { Building2, Home, Key, MapPin, Search, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState("venta")
  const [filters, setFilters] = useState({
    type: "Todos los tipos",
    location: "Todas las ubicaciones",
    maxPrice: "Sin límite"
  })
  const [propertiesVisible, setPropertiesVisible] = useState(false)
  const propertiesRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPropertiesVisible(true)
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (propertiesRef.current) {
      observer.observe(propertiesRef.current)
    }

    return () => {
      if (propertiesRef.current) {
        observer.unobserve(propertiesRef.current)
      }
    }
  }, [])

  // Filtrar propiedades según el tab activo y filtros
  const filteredProperties = allProperties.filter(property => {
    const matchesTab = activeTab === "venta" 
      ? property.status === "Venta" 
      : property.status === "Alquiler"
    
    const matchesType = filters.type === "Todos los tipos" || property.type?.toLowerCase() === filters.type.toLowerCase()
    const matchesLocation = filters.location === "Todas las ubicaciones" || property.location.toLowerCase().includes(filters.location.toLowerCase())
    
    return matchesTab && matchesType && matchesLocation
  })

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <img src="/images/hero-inmuebles.jpg" alt="Inmuebles" className="w-full h-full object-cover brightness-[0.65]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up animate-pulse">Nuestros Inmuebles</h1>
          <p className="text-lg max-w-2xl animate-fade-in-up animation-delay-300">
            Encuentra la propiedad perfecta para ti entre nuestra amplia selección de inmuebles.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Tabs defaultValue="venta" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="relative grid w-full grid-cols-2 mb-6 bg-[#F4F4F5] rounded-md select-none">
              <div
                className={`absolute top-1 left-1 h-[32px] bg-white rounded-md shadow transition-transform duration-300 ease-in-out`}
                style={{
                  width: "calc(50% - 12px)",
                  transform: activeTab === "venta" ? "translateX(0%)" : "translateX(calc(100% + 14px))",
                }}
              />
              <TabsTrigger
                value="venta"
                className={`relative z-10 py-2 text-center text-sm font-medium cursor-pointer ${
                  activeTab === "venta" ? "text-black" : "text-gray-500"
                }`}
              >
                Venta
              </TabsTrigger>
              <TabsTrigger
                value="alquiler"
                className={`relative z-10 py-2 text-center text-sm font-medium cursor-pointer ${
                  activeTab === "alquiler" ? "text-black" : "text-gray-500"
                }`}
              >
                Alquiler
              </TabsTrigger>
            </TabsList>
              <TabsContent value="venta" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de propiedad</label>
                    <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Todos los tipos">Todos los tipos</SelectItem>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Apartamento">Apartamento</SelectItem>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ubicación</label>
                    <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Todas las ubicaciones" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Todas las ubicaciones">Todas las ubicaciones</SelectItem>
                        <SelectItem value="El Poblado">El Poblado</SelectItem>
                        <SelectItem value="Laureles">Laureles</SelectItem>
                        <SelectItem value="Envigado">Envigado</SelectItem>
                        <SelectItem value="Belén">Belén</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Precio máximo</label>
                    <Select value={filters.maxPrice} onValueChange={(value) => setFilters({...filters, maxPrice: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sin límite" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Sin límite">Sin límite</SelectItem>
                        <SelectItem value="200000">$200,000</SelectItem>
                        <SelectItem value="500000">$500,000</SelectItem>
                        <SelectItem value="1000000">$1,000,000</SelectItem>
                        <SelectItem value="2000000">$2,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-[#0c4a7b] hover:bg-[#0a3d68] text-white">
                      <Search className="h-4 w-4 mr-2" /> Buscar
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-[#0c4a7b]">
                    <Filter className="h-4 w-4 mr-2" /> Filtros avanzados
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="alquiler" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de propiedad</label>
                    <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="office">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ubicación</label>
                    <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Todas las ubicaciones" />
                      </SelectTrigger>
                      <SelectContent className="bg-white transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2">
                        <SelectItem value="all">Todas las ubicaciones</SelectItem>
                        <SelectItem value="poblado">El Poblado</SelectItem>
                        <SelectItem value="laureles">Laureles</SelectItem>
                        <SelectItem value="envigado">Envigado</SelectItem>
                        <SelectItem value="belén">Belén</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Precio máximo mensual</label>
                    <Select value={filters.maxPrice} onValueChange={(value) => setFilters({...filters, maxPrice: value})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sin límite" />
                      </SelectTrigger>
                      <SelectContent className="bg-white transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2">
                        <SelectItem value="all">Sin límite</SelectItem>
                        <SelectItem value="1000">$1,000</SelectItem>
                        <SelectItem value="2000">$2,000</SelectItem>
                        <SelectItem value="3000">$3,000</SelectItem>
                        <SelectItem value="5000">$5,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-[#0c4a7b] hover:bg-[#0a3d68] text-white">
                      <Search className="h-4 w-4 mr-2" /> Buscar
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-[#0c4a7b]">
                    <Filter className="h-4 w-4 mr-2" /> Filtros avanzados
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16" ref={propertiesRef}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0c4a7b]">
              Propiedades Disponibles ({filteredProperties.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Más recientes" />
                </SelectTrigger>
                <SelectContent className="bg-white transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2">
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="area-asc">Área: menor a mayor</SelectItem>
                  <SelectItem value="area-desc">Área: mayor a menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <Card
                key={index}
                className={`overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-600 ease-out ${
                  propertiesVisible ? 'animate-fade-in-up' : ''
                }`}
                style={propertiesVisible ? {
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                  animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                } : {}}
              >
                <div className="relative h-64">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#0c4a7b]">{property.status}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{property.title}</CardTitle>
                    <p className="text-xl font-bold text-[#0c4a7b]">{property.price}</p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" /> {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-1" /> {property.area}
                    </div>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" /> {property.bedrooms} Hab.
                    </div>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-1" /> {property.bathrooms} Baños
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-[#0c4a7b] hover:bg-[#0a3d68] text-white">
                    <Link to={`/inmuebles/${property.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="outline" size="icon" className="bg-[#0c4a7b] text-white">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Data
const allProperties = [
  {
    id: 1,
    type: "casa",
    title: "Casa Moderna en El Poblado",
    price: "$850,000",
    location: "El Poblado, Medellín",
    area: "280 m²",
    bedrooms: 4,
    bathrooms: 3,
    image: "/property-1.jpg",
    status: "Venta",
  },
  {
    id: 2,
    type: "apartamento",
    title: "Apartamento de Lujo",
    price: "$450,000",
    location: "Laureles, Medellín",
    area: "150 m²",
    bedrooms: 3,
    bathrooms: 2,
    image: "/property-2.jpg",
    status: "Venta",
  },
  {
    id: 3,
    type: "apartamento",
    title: "Penthouse con Vista Panorámica",
    price: "$1,200,000",
    location: "Envigado, Antioquia",
    area: "320 m²",
    bedrooms: 4,
    bathrooms: 4,
    image: "/property-3.jpg",
    status: "Venta",
  },
  {
    id: 4,
    type: "casa",
    title: "Casa Campestre",
    price: "$750,000",
    location: "Llanogrande, Rionegro",
    area: "450 m²",
    bedrooms: 5,
    bathrooms: 4,
    image: "/property-4.jpg",
    status: "Venta",
  },
  {
    id: 5,
    type: "apartamento",
    title: "Apartamento Amoblado",
    price: "$2,500/mes",
    location: "Belén, Medellín",
    area: "95 m²",
    bedrooms: 2,
    bathrooms: 2,
    image: "/property-5.jpg",
    status: "Alquiler",
  },
  {
    id: 6,
    type: "local-comercial",
    title: "Local Comercial",
    price: "$350,000",
    location: "Centro, Medellín",
    area: "120 m²",
    bedrooms: 0,
    bathrooms: 1,
    image: "/property-6.jpg",
    status: "Venta",
  },
  {
    id: 7,
    type: "oficina",
    title: "Oficina Ejecutiva",
    price: "$3,000/mes",
    location: "El Poblado, Medellín",
    area: "85 m²",
    bedrooms: 0,
    bathrooms: 2,
    image: "/property-7.jpg",
    status: "Alquiler",
  },
  {
    id: 8,
    type: "casa",
    title: "Casa Familiar",
    price: "$520,000",
    location: "Sabaneta, Antioquia",
    area: "220 m²",
    bedrooms: 4,
    bathrooms: 3,
    image: "/property-8.jpg",
    status: "Venta",
  },
  {
    id: 9,
    type: "apartamento",
    title: "Apartamento con Terraza",
    price: "$380,000",
    location: "Envigado, Antioquia",
    area: "130 m²",
    bedrooms: 3,
    bathrooms: 2,
    image: "/property-9.jpg",
    status: "Venta",
  },
]