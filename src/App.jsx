import { useEffect, useMemo, useState } from 'react'

const CONFIG_KEY = 'bloquera-config-v1'
const HISTORIAL_KEY = 'bloquera-historial-v1'
const ESTADO_KEY = 'bloquera-estado-v1'
const DIA_KEY = 'bloquera-dia-v1'
const PROVEEDORES_KEY = 'bloquera-proveedores-v1'
const CLIENTES_KEY = 'bloquera-clientes-v1'
const PRODUCTOS_KEY = 'bloquera-productos-v1'
const VENTAS_KEY = 'bloquera-ventas-v1'
const PEDIDOS_KEY = 'bloquera-pedidos-v1'

const PRODUCTOS_DEFAULT = [
  {
    id: 'b12',
    nombre: 'Bloque 12 (12×20×40 cm)',
    categoria: 'Bloques',
    rendimiento: '60',
    precioVenta: '0.65',
    tobosArena: '5',
    tobosArrocillo: '5',
    tobosAgua: '1.125',
    manoObraSaco: '5.5',
    otrosSaco: '0',
  },
  {
    id: 'b14',
    nombre: 'Bloque 14 (14×20×40 cm)',
    categoria: 'Bloques',
    rendimiento: '48',
    precioVenta: '0.80',
    tobosArena: '5',
    tobosArrocillo: '5',
    tobosAgua: '1.125',
    manoObraSaco: '5.5',
    otrosSaco: '0',
  },
  {
    id: 'estantillo',
    nombre: 'Estantillo para cerca (2.0 m)',
    categoria: 'Postes y Potreros',
    rendimiento: '7',
    precioVenta: '4.80',
    tobosArena: '4',
    tobosArrocillo: '4',
    tobosAgua: '1.0',
    manoObraSaco: '4.0',
    otrosSaco: '0.5',
  },
  {
    id: 'esquinero',
    nombre: 'Esquinero reforzado para potrero',
    categoria: 'Postes y Potreros',
    rendimiento: '3.5',
    precioVenta: '9.50',
    tobosArena: '4.5',
    tobosArrocillo: '4.5',
    tobosAgua: '1.0',
    manoObraSaco: '4.5',
    otrosSaco: '1.0',
  },
]

const PROVEEDORES_DEFAULT = [
  {
    id: 'prov-cemento',
    nombre: 'Distribuidora Cemento Unión',
    material: 'cemento',
    contacto: '0991234567',
    precioRef: '10.00',
    unidad: 'saco 42.5 kg',
    nota: 'Entrega en 24h a pie de patio',
  },
  {
    id: 'prov-arena',
    nombre: 'Cantera San Pedro',
    material: 'arena',
    contacto: '0987654321',
    precioRef: '30.00',
    unidad: 'm³ volqueta',
    nota: 'Arena gruesa de río lavada',
  },
  {
    id: 'prov-arrocillo',
    nombre: 'Agregados El Valle',
    material: 'arrocillo',
    contacto: '0995551234',
    precioRef: '55.00',
    unidad: 'm³ volqueta',
    nota: 'Piedra triturada 3/8 limpia',
  },
]

const CLIENTES_DEFAULT = [
  {
    id: 'cli-1',
    nombre: 'Constructora Andina',
    contacto: '0981112233',
    ubicacion: 'Obra Vía Perimetral Km 4',
    nota: 'Pide despacho en camión de 1000 bloques',
  },
  {
    id: 'cli-2',
    nombre: 'Hacienda La Fortuna (Don Manuel)',
    contacto: '0994443322',
    ubicacion: 'Sector San Gabriel - Finca El Bosque',
    nota: 'Compra estantillos y esquineros para cerca cada 15 a 20 días',
  },
  {
    id: 'cli-3',
    nombre: 'Maestro Carlos Mendoza',
    contacto: '0978889900',
    ubicacion: 'Taller y obras centro',
    nota: 'Retiro directo en patio con camioneta',
  },
]

const PEDIDOS_DEFAULT = [
  {
    id: 'ped-1',
    fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
    clienteId: 'cli-1',
    clienteNombre: 'Constructora Andina',
    productoId: 'b14',
    productoNombre: 'Bloque 14 (14×20×40 cm)',
    cantidad: 800,
    precioUnitario: 0.80,
    total: 640.00,
    estado: 'en_cola',
    prioridad: 'alta',
    fechaEntregaEstimada: new Date(Date.now() + 86400000 * 3).toISOString(),
    nota: 'Para vaciado de muros obra Bellavista',
  },
  {
    id: 'ped-2',
    fecha: new Date(Date.now() - 86400000).toISOString(),
    clienteId: 'cli-2',
    clienteNombre: 'Hacienda La Fortuna (Don Manuel)',
    productoId: 'estantillo',
    productoNombre: 'Estantillo para cerca (2.0 m)',
    cantidad: 80,
    precioUnitario: 4.80,
    total: 384.00,
    estado: 'en_cola',
    prioridad: 'media',
    fechaEntregaEstimada: new Date(Date.now() + 86400000 * 5).toISOString(),
    nota: 'Cerca perimetral de potrero nuevo',
  },
]

const DEFAULTS = {
  tipoBloque: '12 de 3 huecos (12×20×40 cm)',
  formula: {
    tobosArena: '5',
    tobosArrocillo: '5',
    tobosAgua: '1.125',
    toboLitros: '20',
    bloquesPorSaco: '60',
  },
  precios: { sacoCemento: '10', arenaM3: '30', arrocilloM3: '55' },
  manoObraSaco: '5.5',
  otrosSaco: '0',
  precioVenta: '0.65',
  umbrales: {
    sacos: '15',
    arena: '2.0',
    arrocillo: '2.0',
  },
}

const ESTADO_DEFAULT = {
  invSacos: '25',
  invArena: '4.5',
  invArrocillo: '3.8',
  invBloques: '350',
  invPorProducto: {
    b12: '350',
    b14: '120',
    estantillo: '30',
    esquinero: '15',
  },
}

const DIA_DEFAULT = {
  productoId: 'b12',
  sacosPlan: '20',
  sacosReal: '',
  bloquesReal: '',
  roturas: '0',
  otras: '0',
  nota: '',
  tandaIniciada: false,
  sacosLanzados: '0',
  arenaLanzada: '0',
  arrocilloLanzado: '0',
}

function cargarConfig() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CONFIG_KEY))
    if (!guardado || typeof guardado !== 'object') return { ...DEFAULTS }
    const desactualizada =
      Boolean(guardado.uso) || (guardado.formula && !guardado.formula.tobosAgua)
    if (desactualizada) return { ...DEFAULTS }
    return {
      ...DEFAULTS,
      ...guardado,
      formula: { ...DEFAULTS.formula, ...guardado.formula },
      precios: { ...DEFAULTS.precios, ...guardado.precios },
      umbrales: { ...DEFAULTS.umbrales, ...(guardado.umbrales || {}) },
    }
  } catch {
    return { ...DEFAULTS }
  }
}

function cargarProductos() {
  try {
    const d = JSON.parse(localStorage.getItem(PRODUCTOS_KEY))
    if (Array.isArray(d) && d.length > 0) return d
    return PRODUCTOS_DEFAULT
  } catch {
    return PRODUCTOS_DEFAULT
  }
}

function cargarProveedores() {
  try {
    const d = JSON.parse(localStorage.getItem(PROVEEDORES_KEY))
    if (Array.isArray(d) && d.length > 0) return d
    return PROVEEDORES_DEFAULT
  } catch {
    return PROVEEDORES_DEFAULT
  }
}

function cargarClientes() {
  try {
    const d = JSON.parse(localStorage.getItem(CLIENTES_KEY))
    if (Array.isArray(d) && d.length > 0) return d
    return CLIENTES_DEFAULT
  } catch {
    return CLIENTES_DEFAULT
  }
}

function cargarPedidos() {
  try {
    const d = JSON.parse(localStorage.getItem(PEDIDOS_KEY))
    if (Array.isArray(d)) return d
    return PEDIDOS_DEFAULT
  } catch {
    return PEDIDOS_DEFAULT
  }
}

function cargarVentas() {
  try {
    const d = JSON.parse(localStorage.getItem(VENTAS_KEY))
    return Array.isArray(d) ? d : []
  } catch {
    return []
  }
}

function cargarEstado() {
  try {
    const d = JSON.parse(localStorage.getItem(ESTADO_KEY))
    if (!d || typeof d !== 'object') return { ...ESTADO_DEFAULT }
    const invPorProducto = { ...ESTADO_DEFAULT.invPorProducto, ...(d.invPorProducto || {}) }
    if (!d.invPorProducto && d.invBloques) {
      invPorProducto.b12 = d.invBloques
    }
    return {
      ...ESTADO_DEFAULT,
      ...d,
      invPorProducto,
    }
  } catch {
    return { ...ESTADO_DEFAULT }
  }
}

function cargarDia() {
  try {
    const d = JSON.parse(localStorage.getItem(DIA_KEY))
    if (!d || typeof d !== 'object') return { ...DIA_DEFAULT }
    return { ...DIA_DEFAULT, ...d }
  } catch {
    return { ...DIA_DEFAULT }
  }
}

function cargarHistorial() {
  try {
    const data = JSON.parse(localStorage.getItem(HISTORIAL_KEY))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function num(v) {
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function dinero(n) {
  return '$' + n.toFixed(2)
}

function cant(n) {
  return String(Math.round(num(n) * 100) / 100)
}

function fechaCorta(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function enlaceTel(tlf) {
  const limpio = String(tlf).replace(/[^0-9]/g, '')
  return limpio ? 'tel:' + limpio : null
}

function enlaceWhatsapp(tlf, mensaje) {
  let limpio = String(tlf).replace(/[^0-9]/g, '')
  if (limpio.startsWith('09')) limpio = '593' + limpio.slice(1)
  if (!limpio) return null
  return 'https://wa.me/' + limpio + '?text=' + encodeURIComponent(mensaje)
}

export default function App() {
  const [tab, setTab] = useState('jornada')
  const [cfg, setCfg] = useState(cargarConfig)
  const [productos, setProductos] = useState(cargarProductos)
  const [proveedores, setProveedores] = useState(cargarProveedores)
  const [clientes, setClientes] = useState(cargarClientes)
  const [pedidos, setPedidos] = useState(cargarPedidos)
  const [inv, setInvEstado] = useState(cargarEstado)
  const [hoy, setHoy] = useState(cargarDia)
  const [ventas, setVentas] = useState(cargarVentas)
  const [historial, setHistorial] = useState(cargarHistorial)
  const [momentoActual] = useState(() => Date.now())

  const [modalProveedor, setModalProveedor] = useState(false)
  const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null)
  const [formProveedor, setFormProveedor] = useState({
    nombre: '',
    material: 'cemento',
    contacto: '',
    precioRef: '',
    unidad: 'saco 42.5 kg',
    nota: '',
  })

  const [formPedido, setFormPedido] = useState({
    clienteId: 'cli-1',
    productoId: 'b12',
    cantidad: '400',
    precioUnitario: '',
    prioridad: 'media',
    diasEntrega: '3',
    nota: '',
  })

  const [compra, setCompra] = useState({
    proveedorId: 'prov-cemento',
    sacos: '',
    arena: '',
    arrocillo: '',
    costoTotal: '',
    nota: '',
  })

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    contacto: '',
    ubicacion: '',
    nota: '',
  })

  const [modalNuevoProd, setModalNuevoProd] = useState(false)
  const [nuevoProd, setNuevoProd] = useState({
    id: '',
    nombre: '',
    categoria: 'Prefabricados',
    rendimiento: '50',
    precioVenta: '0.70',
    tobosArena: '5',
    tobosArrocillo: '5',
    tobosAgua: '1.125',
    manoObraSaco: '5.5',
    otrosSaco: '0',
  })

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
  }, [cfg])

  useEffect(() => {
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos))
  }, [productos])

  useEffect(() => {
    localStorage.setItem(PROVEEDORES_KEY, JSON.stringify(proveedores))
  }, [proveedores])

  useEffect(() => {
    localStorage.setItem(CLIENTES_KEY, JSON.stringify(clientes))
  }, [clientes])

  useEffect(() => {
    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos))
  }, [pedidos])

  useEffect(() => {
    localStorage.setItem(ESTADO_KEY, JSON.stringify(inv))
  }, [inv])

  useEffect(() => {
    localStorage.setItem(DIA_KEY, JSON.stringify(hoy))
  }, [hoy])

  useEffect(() => {
    localStorage.setItem(VENTAS_KEY, JSON.stringify(ventas))
  }, [ventas])

  useEffect(() => {
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial))
  }, [historial])

  const productoActivo = useMemo(() => {
    const p = productos.find((x) => x.id === hoy.productoId)
    return p || productos[0] || PRODUCTOS_DEFAULT[0]
  }, [productos, hoy.productoId])

  const setDia = (clave) => (valor) => setHoy((d) => ({ ...d, [clave]: valor }))

  const setInv = (clave) => (valor) =>
    setInvEstado((e) => ({ ...e, [clave]: valor }))

  const setStockProducto = (prodId, valor) => {
    setInvEstado((e) => ({
      ...e,
      invPorProducto: {
        ...e.invPorProducto,
        [prodId]: valor,
      },
      invBloques: prodId === 'b12' ? valor : e.invBloques,
    }))
  }

  const toboLitros = num(cfg.formula.toboLitros) || 20
  const tobosM3 = toboLitros / 1000

  const precios = {
    sacoCemento: num(cfg.precios.sacoCemento),
    arenaM3: num(cfg.precios.arenaM3),
    arrocilloM3: num(cfg.precios.arrocilloM3),
  }

  const costosPorProducto = useMemo(() => {
    const mapa = {}
    for (const p of productos) {
      const r = num(p.rendimiento) || 1
      const tArena = num(p.tobosArena)
      const tArrocillo = num(p.tobosArrocillo)
      const arenaM3 = tArena * tobosM3
      const arrocilloM3 = tArrocillo * tobosM3
      const cCemento = precios.sacoCemento
      const cArena = arenaM3 * precios.arenaM3
      const cArrocillo = arrocilloM3 * precios.arrocilloM3
      const cMO = num(p.manoObraSaco)
      const cOtros = num(p.otrosSaco)
      const costoSaco = cCemento + cArena + cArrocillo + cMO + cOtros
      const costoUnidad = r > 0 ? costoSaco / r : 0
      mapa[p.id] = {
        costoSaco,
        costoUnidad,
        arenaM3Saco: arenaM3,
        arrocilloM3Saco: arrocilloM3,
        tArena,
        tArrocillo,
        rend: r,
      }
    }
    return mapa
  }, [productos, tobosM3, precios.sacoCemento, precios.arenaM3, precios.arrocilloM3])

  const calculosHoy = useMemo(() => {
    const p = productoActivo
    const rend = num(p.rendimiento) || 1
    const cost = costosPorProducto[p.id] || {
      costoSaco: 24,
      costoUnidad: 0.4,
      arenaM3Saco: 0.1,
      arrocilloM3Saco: 0.1,
      tArena: 5,
      tArrocillo: 5,
    }

    const sacosPlan = num(hoy.sacosPlan)
    const unidadesPlan = Math.round(sacosPlan * rend)
    const arenaPlanTobos = cost.tArena * sacosPlan
    const arrocilloPlanTobos = cost.tArrocillo * sacosPlan
    const arenaPlanM3 = arenaPlanTobos * tobosM3
    const arrocilloPlanM3 = arrocilloPlanTobos * tobosM3
    const aguaSacoLitros = num(p.tobosAgua) * toboLitros
    const aguaPlanLitros = aguaSacoLitros * sacosPlan

    const sacosReal = num(hoy.sacosReal) || sacosPlan
    const unidadesRealCalc = Math.round(sacosReal * rend)
    const unidadesReal = num(hoy.bloquesReal) || unidadesRealCalc
    const roturas = num(hoy.roturas)
    const otras = num(hoy.otras)
    const mermaTotal = roturas + otras
    const costoProduccion = cost.costoSaco * sacosReal
    const rendReal = sacosReal > 0 ? unidadesReal / sacosReal : 0

    const invSacosN = num(inv.invSacos)
    const invArenaN = num(inv.invArena)
    const invArrocilloN = num(inv.invArrocillo)
    const stockActualProd = num(inv.invPorProducto?.[p.id] ?? (p.id === 'b12' ? inv.invBloques : 0))

    const invSacosDespues = invSacosN - sacosReal
    const invArenaDespues = invArenaN - cost.arenaM3Saco * sacosReal
    const invArrocilloDespues = invArrocilloN - cost.arrocilloM3Saco * sacosReal
    const stockProdDespues = stockActualProd + unidadesReal - mermaTotal

    const deficitSacos = Math.max(sacosPlan - invSacosN, 0)
    const deficitArenaM3 = Math.max(arenaPlanM3 - invArenaN, 0)
    const deficitArrocilloM3 = Math.max(arrocilloPlanM3 - invArrocilloN, 0)

    const umbralSacos = num(cfg.umbrales?.sacos) || 15
    const umbralArena = num(cfg.umbrales?.arena) || 2.0
    const umbralArrocillo = num(cfg.umbrales?.arrocillo) || 2.0

    return {
      rend,
      costoSaco: cost.costoSaco,
      costoUnidad: cost.costoUnidad,
      sacosPlan,
      unidadesPlan,
      arenaPlanM3,
      arrocilloPlanM3,
      aguaPlanLitros,
      sacosReal,
      unidadesReal,
      unidadesRealCalc,
      rendReal,
      roturas,
      otras,
      mermaTotal,
      mermaValor: mermaTotal * cost.costoUnidad,
      costoProduccion,
      stockActualProd,
      stockProdDespues,
      invSacosN,
      invArenaN,
      invArrocilloN,
      invSacosDespues,
      invArenaDespues,
      invArrocilloDespues,
      deficitSacos,
      deficitArenaM3,
      deficitArrocilloM3,
      umbralSacos,
      umbralArena,
      umbralArrocillo,
      bajoSacos: invSacosN <= umbralSacos || deficitSacos > 0,
      bajoArena: invArenaN <= umbralArena || deficitArenaM3 > 0,
      bajoArrocillo: invArrocilloN <= umbralArrocillo || deficitArrocilloM3 > 0,
    }
  }, [productoActivo, costosPorProducto, hoy, inv, cfg.umbrales, tobosM3, toboLitros])

  const pedidosPendientes = useMemo(() => {
    return pedidos.filter((p) => p.estado !== 'entregado')
  }, [pedidos])

  const evaluacionMaterialesCola = useMemo(() => {
    let sacosRequeridos = 0
    let arenaM3Requerida = 0
    let arrocilloM3Requerido = 0
    let totalUnidades = 0

    const pedidosEnEspera = pedidos.filter((p) => p.estado === 'en_cola')

    for (const ped of pedidosEnEspera) {
      const prodInfo = costosPorProducto[ped.productoId]
      const rend = prodInfo?.rend || 50
      const sacosPed = Math.ceil(ped.cantidad / rend)
      sacosRequeridos += sacosPed
      arenaM3Requerida += sacosPed * (prodInfo?.arenaM3Saco || 0.1)
      arrocilloM3Requerido += sacosPed * (prodInfo?.arrocilloM3Saco || 0.1)
      totalUnidades += ped.cantidad
    }

    const sacosBodega = num(inv.invSacos)
    const arenaBodega = num(inv.invArena)
    const arrocilloBodega = num(inv.invArrocillo)

    const deficitSacos = Math.max(0, sacosRequeridos - sacosBodega)
    const deficitArena = Math.max(0, arenaM3Requerida - arenaBodega)
    const deficitArrocillo = Math.max(0, arrocilloM3Requerido - arrocilloBodega)

    const alcanzaMaterial = deficitSacos === 0 && deficitArena <= 0.05 && deficitArrocillo <= 0.05

    return {
      sacosRequeridos,
      arenaM3Requerida,
      arrocilloM3Requerido,
      totalUnidades,
      sacosBodega,
      arenaBodega,
      arrocilloBodega,
      deficitSacos,
      deficitArena,
      deficitArrocillo,
      alcanzaMaterial,
    }
  }, [pedidos, costosPorProducto, inv.invSacos, inv.invArena, inv.invArrocillo])

  const analisisGoodwill = useMemo(() => {
    const ahora = momentoActual
    const mapaClientes = {}

    for (const c of clientes) {
      mapaClientes[c.id] = {
        cliente: c,
        totalComprado: 0,
        pedidosRealizados: 0,
        pedidosPendientes: 0,
        ultimoPedidoFecha: null,
        diasDesdeUltimoPedido: null,
        intervaloPromedioDias: null,
        frecuenciaSugerida: 'Ocasional',
        puntuacionFidelidad: 70,
        estadoCartera: 'Al día',
        previsionSiguientePedido: null,
        productosPreferidos: {},
      }
    }

    const todosDespachos = [...ventas]
    for (const d of todosDespachos) {
      const id = d.clienteId
      if (!mapaClientes[id]) continue
      mapaClientes[id].totalComprado += d.total
      mapaClientes[id].pedidosRealizados += 1

      const fechaD = new Date(d.fecha).getTime()
      if (!mapaClientes[id].ultimoPedidoFecha || fechaD > mapaClientes[id].ultimoPedidoFecha) {
        mapaClientes[id].ultimoPedidoFecha = fechaD
      }

      const prodId = d.productoId
      mapaClientes[id].productosPreferidos[prodId] =
        (mapaClientes[id].productosPreferidos[prodId] || 0) + d.cantidad
    }

    for (const ped of pedidos) {
      const id = ped.clienteId
      if (!mapaClientes[id]) continue
      if (ped.estado === 'en_cola' || ped.estado === 'en_produccion') {
        mapaClientes[id].pedidosPendientes += 1
      }
      const fechaP = new Date(ped.fecha).getTime()
      if (!mapaClientes[id].ultimoPedidoFecha || fechaP > mapaClientes[id].ultimoPedidoFecha) {
        mapaClientes[id].ultimoPedidoFecha = fechaP
      }
    }

    const previsiones = []
    for (const id of Object.keys(mapaClientes)) {
      const entry = mapaClientes[id]
      if (entry.ultimoPedidoFecha) {
        const diasDiff = Math.round((ahora - entry.ultimoPedidoFecha) / 86400000)
        entry.diasDesdeUltimoPedido = diasDiff

        let intervaloEstimado = 20
        if (entry.cliente.id === 'cli-2') intervaloEstimado = 15
        if (entry.cliente.id === 'cli-1') intervaloEstimado = 10
        if (entry.cliente.id === 'cli-3') intervaloEstimado = 7

        entry.intervaloPromedioDias = intervaloEstimado
        const diasRestantes = intervaloEstimado - diasDiff

        if (diasRestantes <= 5) {
          previsiones.push({
            clienteNombre: entry.cliente.nombre,
            clienteId: entry.cliente.id,
            diasRestantes,
            diasDesdeUltimo: diasDiff,
            recomendacion:
              diasRestantes <= 0
                ? 'Cliente con alta probabilidad de compra esta semana. Contactar proactivamente.'
                : 'Estimado de nuevo pedido en ' + diasRestantes + ' días. Mantener stock disponible.',
          })
        }

        let score = 60 + Math.min(30, entry.pedidosRealizados * 5)
        if (diasDiff > 45) score -= 15
        if (entry.totalComprado > 500) score += 10
        entry.puntuacionFidelidad = Math.min(100, Math.max(30, score))
      }
    }

    return {
      analisisPorCliente: Object.values(mapaClientes),
      previsiones,
    }
  }, [clientes, ventas, pedidos, momentoActual])

  const proveedorSugerido = (tipo) => {
    return proveedores.find((p) => p.material.toLowerCase() === tipo.toLowerCase()) || proveedores[0]
  }

  const iniciarTandaHoy = () => {
    const sacos = num(hoy.sacosPlan)
    if (sacos <= 0) {
      alert('Ingresa una cantidad valida de sacos para la tanda.')
      return
    }

    const p = productoActivo
    const cost = costosPorProducto[p.id] || {
      arenaM3Saco: 0.1,
      arrocilloM3Saco: 0.1,
    }
    const arenaM3 = cost.arenaM3Saco * sacos
    const arrocilloM3 = cost.arrocilloM3Saco * sacos

    const mensaje =
      '¿Enviar orden de produccion a mezcladora para ' +
      p.nombre +
      '?\n\n' +
      'Se descontaran de bodega:\n' +
      '- ' +
      cant(sacos) +
      ' sacos de cemento\n' +
      '- ' +
      arenaM3.toFixed(2) +
      ' m³ de arena\n' +
      '- ' +
      arrocilloM3.toFixed(2) +
      ' m³ de arrocillo'

    if (!window.confirm(mensaje)) return

    setInvEstado((e) => ({
      ...e,
      invSacos: String(Math.round((num(e.invSacos) - sacos) * 1000) / 1000),
      invArena: String(Math.round((num(e.invArena) - arenaM3) * 1000) / 1000),
      invArrocillo: String(Math.round((num(e.invArrocillo) - arrocilloM3) * 1000) / 1000),
    }))

    setHoy((x) => ({
      ...x,
      tandaIniciada: true,
      sacosLanzados: String(sacos),
      arenaLanzada: String(arenaM3),
      arrocilloLanzado: String(arrocilloM3),
    }))

    alert('Orden enviada a produccion. Materia prima descontada de bodega.')
  }

  const registrarCierreJornada = () => {
    if (calculosHoy.sacosReal <= 0) return
    const p = productoActivo
    const cost = costosPorProducto[p.id] || {
      arenaM3Saco: 0.1,
      arrocilloM3Saco: 0.1,
    }

    const fueIniciada = Boolean(hoy.tandaIniciada)
    const unidadesBuenas = calculosHoy.unidadesReal - calculosHoy.mermaTotal

    const mensaje =
      '¿Finalizar produccion y registrar cierre de jornada para ' +
      p.nombre +
      '?\n\n' +
      'Produccion real lograda: ' +
      cant(calculosHoy.unidadesReal) +
      ' unidades (' +
      cant(calculosHoy.sacosReal) +
      ' sacos)\n' +
      'Merma: ' +
      cant(calculosHoy.mermaTotal) +
      ' unidades (' +
      dinero(calculosHoy.mermaValor) +
      ')\n' +
      'Se incrementara el inventario en patio en: +' +
      cant(unidadesBuenas) +
      ' unidades terminadas'

    if (!window.confirm(mensaje)) return

    setInvEstado((e) => {
      const stockActual = num(e.invPorProducto?.[p.id] ?? (p.id === 'b12' ? e.invBloques : 0))
      const nuevoPorProd = {
        ...e.invPorProducto,
        [p.id]: String(Math.max(0, Math.round(stockActual + unidadesBuenas))),
      }

      let nuevoSacos = num(e.invSacos)
      let nuevaArena = num(e.invArena)
      let nuevoArrocillo = num(e.invArrocillo)

      if (fueIniciada) {
        const difSacos = calculosHoy.sacosReal - num(hoy.sacosLanzados)
        if (Math.abs(difSacos) > 0.001) {
          nuevoSacos -= difSacos
          nuevaArena -= difSacos * cost.arenaM3Saco
          nuevoArrocillo -= difSacos * cost.arrocilloM3Saco
        }
      } else {
        nuevoSacos -= calculosHoy.sacosReal
        nuevaArena -= calculosHoy.sacosReal * cost.arenaM3Saco
        nuevoArrocillo -= calculosHoy.sacosReal * cost.arrocilloM3Saco
      }

      return {
        ...e,
        invSacos: String(Math.round(nuevoSacos * 1000) / 1000),
        invArena: String(Math.round(nuevaArena * 1000) / 1000),
        invArrocillo: String(Math.round(nuevoArrocillo * 1000) / 1000),
        invPorProducto: nuevoPorProd,
        invBloques: p.id === 'b12' ? nuevoPorProd.b12 : e.invBloques,
      }
    })

    const registro = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      fecha: new Date().toISOString(),
      productoId: p.id,
      productoNombre: p.nombre,
      sacosPlan: calculosHoy.sacosPlan,
      unidadesPlan: calculosHoy.unidadesPlan,
      sacos: calculosHoy.sacosReal,
      bloques: calculosHoy.unidadesReal,
      roturas: calculosHoy.roturas,
      otras: calculosHoy.otras,
      costoProduccion: calculosHoy.costoProduccion,
      perdidasValor: calculosHoy.mermaValor,
      rendReal: calculosHoy.rendReal,
      nota: (hoy.nota || '').trim(),
    }

    setHistorial((h) => [registro, ...h])

    if (calculosHoy.rendReal > 0) {
      setProductos((prods) =>
        prods.map((item) =>
          item.id === p.id
            ? { ...item, rendimiento: String(Math.round(calculosHoy.rendReal * 10) / 10) }
            : item,
        ),
      )
    }

    setHoy((x) => ({
      ...x,
      sacosReal: '',
      bloquesReal: '',
      roturas: '0',
      otras: '0',
      nota: '',
      tandaIniciada: false,
      sacosLanzados: '0',
      arenaLanzada: '0',
      arrocilloLanzado: '0',
    }))
    alert('Produccion finalizada con exito. Inventario de productos terminados incrementado en patio.')
  }

  const crearOPonerEnColaPedido = (e) => {
    e.preventDefault()
    const cantidad = num(formPedido.cantidad)
    if (cantidad <= 0) {
      alert('Ingresa una cantidad valida.')
      return
    }

    const prod = productos.find((x) => x.id === formPedido.productoId) || productoActivo
    const cli = clientes.find((x) => x.id === formPedido.clienteId)
    const precio = num(formPedido.precioUnitario) || num(prod.precioVenta)
    const total = cantidad * precio
    const stockActual = num(inv.invPorProducto?.[prod.id] ?? (prod.id === 'b12' ? inv.invBloques : 0))

    const dias = num(formPedido.diasEntrega) || 3
    const fechaEntrega = new Date(Date.now() + dias * 86400000).toISOString()

    if (stockActual >= cantidad) {
      const decision = window.confirm(
        'Hay stock suficiente en patio (' +
          stockActual +
          ' unidades disponibles).\n\n' +
          '¿Deseas despachar de inmediato?\n' +
          '(Aceptar = Despachar ahora; Cancelar = Agregar a la Cola de Pedidos programados)',
      )

      if (decision) {
        setInvEstado((prev) => {
          const nuevoPorProd = {
            ...prev.invPorProducto,
            [prod.id]: String(Math.max(0, stockActual - cantidad)),
          }
          return {
            ...prev,
            invPorProducto: nuevoPorProd,
            invBloques: prod.id === 'b12' ? nuevoPorProd.b12 : prev.invBloques,
          }
        })

        const regVenta = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          fecha: new Date().toISOString(),
          clienteId: cli?.id || 'general',
          clienteNombre: cli?.nombre || 'Consumidor Final',
          productoId: prod.id,
          productoNombre: prod.nombre,
          cantidad,
          precioUnitario: precio,
          total,
          estadoPago: 'pagado',
          nota: formPedido.nota || 'Despacho directo desde existencia de patio',
        }
        setVentas((v) => [regVenta, ...v])
        alert('Despacho completado con existencias de patio.')
        setFormPedido((fp) => ({ ...fp, cantidad: '', nota: '', precioUnitario: '' }))
        return
      }
    }

    const nuevoPed = {
      id: 'ped-' + Date.now().toString(36),
      fecha: new Date().toISOString(),
      clienteId: cli?.id || 'general',
      clienteNombre: cli?.nombre || 'Consumidor Final',
      productoId: prod.id,
      productoNombre: prod.nombre,
      cantidad,
      precioUnitario: precio,
      total,
      estado: 'en_cola',
      prioridad: formPedido.prioridad || 'media',
      fechaEntregaEstimada: fechaEntrega,
      nota: formPedido.nota || (stockActual < cantidad ? 'Faltan unidades en patio' : 'Programado'),
    }

    setPedidos((peds) => [nuevoPed, ...peds])
    alert('Pedido ingresado con éxito en la Cola de Producción.')
    setFormPedido((fp) => ({ ...fp, cantidad: '', nota: '', precioUnitario: '' }))
  }

  const iniciarProduccionPedido = (pedId) => {
    const ped = pedidos.find((x) => x.id === pedId)
    if (!ped) return

    const prodInfo = costosPorProducto[ped.productoId]
    const rend = prodInfo?.rend || 50
    const sacosReq = Math.ceil(ped.cantidad / rend)
    const arenaReq = sacosReq * (prodInfo?.arenaM3Saco || 0.1)
    const arrocilloReq = sacosReq * (prodInfo?.arrocilloM3Saco || 0.1)

    const mensaje =
      '¿Enviar orden de produccion a planta para ' +
      ped.clienteNombre +
      ' (' +
      ped.cantidad +
      ' ' +
      ped.productoNombre +
      ')?\n\n' +
      'Se descontaran de bodega:\n' +
      '- ' +
      cant(sacosReq) +
      ' sacos de cemento\n' +
      '- ' +
      arenaReq.toFixed(2) +
      ' m³ de arena\n' +
      '- ' +
      arrocilloReq.toFixed(2) +
      ' m³ de arrocillo'

    if (!window.confirm(mensaje)) return

    setInvEstado((e) => ({
      ...e,
      invSacos: String(Math.round((num(e.invSacos) - sacosReq) * 1000) / 1000),
      invArena: String(Math.round((num(e.invArena) - arenaReq) * 1000) / 1000),
      invArrocillo: String(Math.round((num(e.invArrocillo) - arrocilloReq) * 1000) / 1000),
    }))

    setPedidos((peds) =>
      peds.map((item) =>
        item.id === pedId
          ? {
              ...item,
              estado: 'en_produccion',
              sacosConsumidos: sacosReq,
              arenaConsumida: arenaReq,
              arrocilloConsumido: arrocilloReq,
              fechaInicioProduccion: new Date().toISOString(),
            }
          : item,
      ),
    )

    alert('Orden enviada a produccion. Materia prima descontada de bodega con exito.')
  }

  const finalizarProduccionPedido = (pedId) => {
    const ped = pedidos.find((x) => x.id === pedId)
    if (!ped) return

    const mensaje =
      '¿Finalizar produccion de ' +
      ped.cantidad +
      ' unidades de ' +
      ped.productoNombre +
      '?\n\n' +
      'Se incrementara el inventario en patio en +' +
      ped.cantidad +
      ' unidades terminadas.'

    if (!window.confirm(mensaje)) return

    const stockActual = num(inv.invPorProducto?.[ped.productoId] ?? (ped.productoId === 'b12' ? inv.invBloques : 0))
    const nuevoStock = stockActual + ped.cantidad

    setInvEstado((prev) => {
      const nuevoPorProd = {
        ...prev.invPorProducto,
        [ped.productoId]: String(Math.round(nuevoStock)),
      }
      return {
        ...prev,
        invPorProducto: nuevoPorProd,
        invBloques: ped.productoId === 'b12' ? nuevoPorProd.b12 : prev.invBloques,
      }
    })

    setPedidos((peds) =>
      peds.map((item) =>
        item.id === pedId
          ? {
              ...item,
              estado: 'listo',
              fechaFinProduccion: new Date().toISOString(),
            }
          : item,
      ),
    )

    const registro = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      fecha: new Date().toISOString(),
      productoId: ped.productoId,
      productoNombre: ped.productoNombre,
      sacosPlan: ped.sacosConsumidos || 0,
      unidadesPlan: ped.cantidad,
      sacos: ped.sacosConsumidos || 0,
      bloques: ped.cantidad,
      roturas: '0',
      otras: '0',
      costoProduccion: (ped.sacosConsumidos || 0) * (costosPorProducto[ped.productoId]?.costoSaco || 24),
      perdidasValor: 0,
      rendReal: ped.sacosConsumidos ? ped.cantidad / ped.sacosConsumidos : 0,
      nota: 'Produccion finalizada de orden: ' + ped.clienteNombre,
    }
    setHistorial((h) => [registro, ...h])

    alert('Produccion finalizada. +' + ped.cantidad + ' unidades ingresadas a productos terminados en patio. Orden lista para despachar.')
  }

  const despacharPedidoDeCola = (pedId) => {
    const ped = pedidos.find((x) => x.id === pedId)
    if (!ped) return

    const prod = productos.find((x) => x.id === ped.productoId) || productoActivo
    const stockActual = num(inv.invPorProducto?.[ped.productoId] ?? (ped.productoId === 'b12' ? inv.invBloques : 0))

    if (stockActual < ped.cantidad) {
      const confirmacion = window.confirm(
        'El stock actual en patio de ' +
          prod.nombre +
          ' es ' +
          stockActual +
          ' unidades, menor al pedido de ' +
          ped.cantidad +
          '. ¿Deseas despachar de todas formas?',
      )
      if (!confirmacion) return
    }

    setInvEstado((prev) => {
      const nuevoPorProd = {
        ...prev.invPorProducto,
        [ped.productoId]: String(Math.max(0, stockActual - ped.cantidad)),
      }
      return {
        ...prev,
        invPorProducto: nuevoPorProd,
        invBloques: ped.productoId === 'b12' ? nuevoPorProd.b12 : prev.invBloques,
      }
    })

    setPedidos((peds) =>
      peds.map((item) => (item.id === pedId ? { ...item, estado: 'entregado' } : item)),
    )

    const regVenta = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      fecha: new Date().toISOString(),
      clienteId: ped.clienteId,
      clienteNombre: ped.clienteNombre,
      productoId: ped.productoId,
      productoNombre: ped.productoNombre,
      cantidad: ped.cantidad,
      precioUnitario: ped.precioUnitario,
      total: ped.total,
      estadoPago: 'pagado',
      nota: 'Despacho de pedido entregado: ' + (ped.nota || ''),
    }

    setVentas((v) => [regVenta, ...v])
    alert('Pedido despachado y entregado al cliente. Descontado de patio.')
  }

  const borrarPedido = (pedId) => {
    if (window.confirm('¿Eliminar este pedido de la cola?')) {
      setPedidos((peds) => peds.filter((item) => item.id !== pedId))
    }
  }

  const abrirModalCrearProveedor = () => {
    setProveedorEnEdicion(null)
    setFormProveedor({
      nombre: '',
      material: 'cemento',
      contacto: '',
      precioRef: '',
      unidad: 'saco 42.5 kg',
      nota: '',
    })
    setModalProveedor(true)
  }

  const abrirModalEditarProveedor = (pr) => {
    setProveedorEnEdicion(pr.id)
    setFormProveedor({
      nombre: pr.nombre,
      material: pr.material,
      contacto: pr.contacto,
      precioRef: pr.precioRef,
      unidad: pr.unidad,
      nota: pr.nota || '',
    })
    setModalProveedor(true)
  }

  const guardarProveedor = (e) => {
    e.preventDefault()
    if (!formProveedor.nombre.trim()) return

    if (proveedorEnEdicion) {
      setProveedores((provs) =>
        provs.map((p) =>
          p.id === proveedorEnEdicion ? { ...p, ...formProveedor } : p,
        ),
      )
      alert('Proveedor actualizado correctamente.')
    } else {
      const id = 'prov-' + Date.now().toString(36)
      setProveedores((provs) => [...provs, { ...formProveedor, id }])
      alert('Proveedor agregado correctamente.')
    }
    setModalProveedor(false)
  }

  const borrarProveedor = (prId) => {
    const pr = proveedores.find((x) => x.id === prId)
    if (!pr) return
    if (window.confirm('¿Seguro que deseas eliminar al proveedor "' + pr.nombre + '"?')) {
      setProveedores((provs) => provs.filter((x) => x.id !== prId))
    }
  }

  const ejecutarCompra = () => {
    const sacos = num(compra.sacos)
    const arena = num(compra.arena)
    const arrocillo = num(compra.arrocillo)
    if (sacos === 0 && arena === 0 && arrocillo === 0) {
      alert('Ingresa al menos una cantidad comprada.')
      return
    }

    setInvEstado((e) => ({
      ...e,
      invSacos: String(Math.round((num(e.invSacos) + sacos) * 1000) / 1000),
      invArena: String(Math.round((num(e.invArena) + arena) * 1000) / 1000),
      invArrocillo: String(Math.round((num(e.invArrocillo) + arrocillo) * 1000) / 1000),
    }))

    setCompra({
      proveedorId: compra.proveedorId,
      sacos: '',
      arena: '',
      arrocillo: '',
      costoTotal: '',
      nota: '',
    })
    alert('Llegada de material registrada en bodega.')
  }

  const prepararCompraDesdeAlerta = (material, cantidadDeficit) => {
    const prov = proveedorSugerido(material)
    setCompra({
      proveedorId: prov.id,
      sacos: material === 'cemento' ? String(Math.ceil(cantidadDeficit)) : '',
      arena: material === 'arena' ? String(Math.round(cantidadDeficit * 100) / 100) : '',
      arrocillo: material === 'arrocillo' ? String(Math.round(cantidadDeficit * 100) / 100) : '',
      costoTotal: '',
      nota: 'Pedido urgente por stock bajo',
    })
    setTab('bodega')
  }

  const agregarCliente = (e) => {
    e.preventDefault()
    if (!nuevoCliente.nombre.trim()) return
    const id = 'cli-' + Date.now().toString(36)
    setClientes((clis) => [...clis, { ...nuevoCliente, id }])
    setFormPedido((fp) => ({ ...fp, clienteId: id }))
    setNuevoCliente({ nombre: '', contacto: '', ubicacion: '', nota: '' })
    alert('Cliente guardado.')
  }

  const guardarNuevoProducto = (e) => {
    e.preventDefault()
    if (!nuevoProd.nombre.trim()) return
    const id = 'prod-' + Date.now().toString(36)
    setProductos((prods) => [...prods, { ...nuevoProd, id }])
    setInvEstado((prev) => ({
      ...prev,
      invPorProducto: {
        ...prev.invPorProducto,
        [id]: '0',
      },
    }))
    setModalNuevoProd(false)
    setNuevoProd({
      id: '',
      nombre: '',
      categoria: 'Prefabricados',
      rendimiento: '50',
      precioVenta: '0.70',
      tobosArena: '5',
      tobosArrocillo: '5',
      tobosAgua: '1.125',
      manoObraSaco: '5.5',
      otrosSaco: '0',
    })
  }

  const actualizarPrecioProd = (prodId, campo, valor) => {
    setProductos((prods) =>
      prods.map((p) => (p.id === prodId ? { ...p, [campo]: valor } : p)),
    )
  }

  const balanceClientes = useMemo(() => {
    const mapa = {}
    for (const c of clientes) {
      mapa[c.id] = { totalComprado: 0, totalPendiente: 0, totalPagado: 0, despachos: 0 }
    }
    for (const v of ventas) {
      if (!mapa[v.clienteId]) {
        mapa[v.clienteId] = { totalComprado: 0, totalPendiente: 0, totalPagado: 0, despachos: 0 }
      }
      mapa[v.clienteId].totalComprado += v.total
      mapa[v.clienteId].despachos += 1
      if (v.estadoPago === 'pendiente') {
        mapa[v.clienteId].totalPendiente += v.total
      } else {
        mapa[v.clienteId].totalPagado += v.total
      }
    }
    return mapa
  }, [clientes, ventas])

  const totalPorCobrar = useMemo(() => {
    return ventas
      .filter((v) => v.estadoPago === 'pendiente')
      .reduce((sum, v) => sum + v.total, 0)
  }, [ventas])

  return (
    <div className="panel-sistema">
      <header className="barra-superior">
        <div className="marca-empresa">
          <span className="insignia-industria">ERP BLOQUERA</span>
          <div className="titulo-bloque">
            <h1>Panel de Control de Planta</h1>
            <p className="subtitulo">Prefabricados, mezclas, abastecimiento y previsión comercial</p>
          </div>
        </div>

        <div className="resumen-rapido-top">
          <div className="minidato">
            <span className="etiqueta">Cemento</span>
            <span className={calculosHoy.bajoSacos ? 'valor alerta' : 'valor'}>
              {cant(inv.invSacos)} sacos
            </span>
          </div>
          <div className="minidato">
            <span className="etiqueta">Arena</span>
            <span className={calculosHoy.bajoArena ? 'valor alerta' : 'valor'}>
              {cant(inv.invArena)} m³
            </span>
          </div>
          <div className="minidato">
            <span className="etiqueta">Arrocillo</span>
            <span className={calculosHoy.bajoArrocillo ? 'valor alerta' : 'valor'}>
              {cant(inv.invArrocillo)} m³
            </span>
          </div>
          <div className="minidato">
            <span className="etiqueta">Cola pedidos</span>
            <span className="valor">{pedidosPendientes.length} órdenes</span>
          </div>
          <div className="minidato">
            <span className="etiqueta">Por cobrar</span>
            <span className="valor">{dinero(totalPorCobrar)}</span>
          </div>
        </div>
      </header>

      <nav className="nav-pestanas">
        <button
          className={'btn-tab ' + (tab === 'jornada' ? 'activo' : '')}
          onClick={() => setTab('jornada')}
        >
          Jornada de Hoy
        </button>
        <button
          className={'btn-tab ' + (tab === 'cola' ? 'activo' : '')}
          onClick={() => setTab('cola')}
        >
          Cola de Pedidos & MRP ({pedidosPendientes.length})
        </button>
        <button
          className={'btn-tab ' + (tab === 'bodega' ? 'activo' : '')}
          onClick={() => setTab('bodega')}
        >
          Bodega & Materia Prima
        </button>
        <button
          className={'btn-tab ' + (tab === 'ventas' ? 'activo' : '')}
          onClick={() => setTab('ventas')}
        >
          Ventas & Clientes
        </button>
        <button
          className={'btn-tab ' + (tab === 'proveedores' ? 'activo' : '')}
          onClick={() => setTab('proveedores')}
        >
          Proveedores & Pedidos
        </button>
        <button
          className={'btn-tab ' + (tab === 'goodwill' ? 'activo' : '')}
          onClick={() => setTab('goodwill')}
        >
          Goodwill & Previsión
        </button>
        <button
          className={'btn-tab ' + (tab === 'catalogo' ? 'activo' : '')}
          onClick={() => setTab('catalogo')}
        >
          Catálogo & Recetas
        </button>
        <button
          className={'btn-tab ' + (tab === 'historial' ? 'activo' : '')}
          onClick={() => setTab('historial')}
        >
          Historial de Producción
        </button>
      </nav>

      <main className="area-trabajo">
        {tab === 'jornada' && (
          <div className="vista-jornada">
            <section className="caja-banner-seleccion">
              <div className="col-prod-act">
                <label className="etiqueta-fuerte">Producto a Fabricar en este Turno</label>
                <select
                  className="control-select grande"
                  value={hoy.productoId}
                  onChange={(e) => setDia('productoId')(e.target.value)}
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.rendimiento} unid/saco · Venta: {dinero(num(p.precioVenta))})
                    </option>
                  ))}
                </select>
              </div>

              <div className="metricas-clave-prod">
                <div className="chip-metrica">
                  <span className="rotulo">Rendimiento actual</span>
                  <span className="cifra">{productoActivo.rendimiento} unidades / saco</span>
                </div>
                <div className="chip-metrica">
                  <span className="rotulo">Costo estimado</span>
                  <span className="cifra">{dinero(calculosHoy.costoUnidad)} / unidad</span>
                </div>
                <div className="chip-metrica">
                  <span className="rotulo">Stock en patio</span>
                  <span className="cifra">{calculosHoy.stockActualProd} listos</span>
                </div>
              </div>
            </section>

            {(calculosHoy.bajoSacos || calculosHoy.bajoArena || calculosHoy.bajoArrocillo) && (
              <section className="alerta-abastecimiento">
                <div className="alerta-cabecera">
                  <span className="alerta-badge">ATENCION: MATERIA PRIMA AL LIMITE</span>
                  <h3>Faltante o stock critico para el turno de hoy</h3>
                </div>

                <div className="rejilla-alertas-prov">
                  {calculosHoy.bajoSacos && (
                    <div className="tarjeta-alerta-insumo">
                      <div className="info-faltante">
                        <strong>Cemento</strong>
                        <p>
                          {calculosHoy.deficitSacos > 0
                            ? 'Faltan ' + cant(calculosHoy.deficitSacos) + ' sacos para el plan'
                            : 'Stock actual bajo (' + cant(inv.invSacos) + ' sacos en bodega)'}
                        </p>
                      </div>
                      {(() => {
                        const prov = proveedorSugerido('cemento')
                        const msj =
                          'Buenas tardes ' +
                          prov.nombre +
                          ', necesito hacer un pedido de cemento para la bloquera. ¿Tienen disponibilidad inmediata?'
                        const linkWa = enlaceWhatsapp(prov.contacto, msj)
                        const linkTel = enlaceTel(prov.contacto)
                        return (
                          <div className="acciones-prov">
                            <span className="prov-nombre">
                              Pedir a: {prov.nombre} ({prov.contacto}) · Ref: {dinero(num(prov.precioRef))}
                            </span>
                            <div className="botones-accion-rapida">
                              {linkWa && (
                                <a className="btn-accion-mini wa" href={linkWa} target="_blank" rel="noreferrer">
                                  WhatsApp
                                </a>
                              )}
                              {linkTel && (
                                <a className="btn-accion-mini tel" href={linkTel}>
                                  Llamar
                                </a>
                              )}
                              <button
                                className="btn-accion-mini compra"
                                onClick={() => prepararCompraDesdeAlerta('cemento', calculosHoy.deficitSacos || 20)}
                              >
                                Recibir pedido
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {calculosHoy.bajoArena && (
                    <div className="tarjeta-alerta-insumo">
                      <div className="info-faltante">
                        <strong>Arena</strong>
                        <p>
                          {calculosHoy.deficitArenaM3 > 0.001
                            ? 'Faltan ' + calculosHoy.deficitArenaM3.toFixed(2) + ' m³ para el plan'
                            : 'Stock bajo (' + cant(inv.invArena) + ' m³ en bodega)'}
                        </p>
                      </div>
                      {(() => {
                        const prov = proveedorSugerido('arena')
                        const msj =
                          'Buenas tardes ' +
                          prov.nombre +
                          ', requerimos volqueta de arena para la bloquera. ¿A cómo tienen el m³ puesto en patio?'
                        const linkWa = enlaceWhatsapp(prov.contacto, msj)
                        const linkTel = enlaceTel(prov.contacto)
                        return (
                          <div className="acciones-prov">
                            <span className="prov-nombre">
                              Pedir a: {prov.nombre} ({prov.contacto}) · Ref: {dinero(num(prov.precioRef))}/m³
                            </span>
                            <div className="botones-accion-rapida">
                              {linkWa && (
                                <a className="btn-accion-mini wa" href={linkWa} target="_blank" rel="noreferrer">
                                  WhatsApp
                                </a>
                              )}
                              {linkTel && (
                                <a className="btn-accion-mini tel" href={linkTel}>
                                  Llamar
                                </a>
                              )}
                              <button
                                className="btn-accion-mini compra"
                                onClick={() => prepararCompraDesdeAlerta('arena', calculosHoy.deficitArenaM3 || 4)}
                              >
                                Recibir pedido
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {calculosHoy.bajoArrocillo && (
                    <div className="tarjeta-alerta-insumo">
                      <div className="info-faltante">
                        <strong>Arrocillo</strong>
                        <p>
                          {calculosHoy.deficitArrocilloM3 > 0.001
                            ? 'Faltan ' + calculosHoy.deficitArrocilloM3.toFixed(2) + ' m³ para el plan'
                            : 'Stock bajo (' + cant(inv.invArrocillo) + ' m³ en bodega)'}
                        </p>
                      </div>
                      {(() => {
                        const prov = proveedorSugerido('arrocillo')
                        const msj =
                          'Buenas tardes ' +
                          prov.nombre +
                          ', requerimos arrocillo para la bloquera. Por favor confirmar despacho.'
                        const linkWa = enlaceWhatsapp(prov.contacto, msj)
                        const linkTel = enlaceTel(prov.contacto)
                        return (
                          <div className="acciones-prov">
                            <span className="prov-nombre">
                              Pedir a: {prov.nombre} ({prov.contacto}) · Ref: {dinero(num(prov.precioRef))}/m³
                            </span>
                            <div className="botones-accion-rapida">
                              {linkWa && (
                                <a className="btn-accion-mini wa" href={linkWa} target="_blank" rel="noreferrer">
                                  WhatsApp
                                </a>
                              )}
                              {linkTel && (
                                <a className="btn-accion-mini tel" href={linkTel}>
                                  Llamar
                                </a>
                              )}
                              <button
                                className="btn-accion-mini compra"
                                onClick={() => prepararCompraDesdeAlerta('arrocillo', calculosHoy.deficitArrocilloM3 || 4)}
                              >
                                Recibir pedido
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className="dos-columnas-operacion">
              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">1</span>
                  <div>
                    <h2>Plan de la Mañana</h2>
                    <p className="desc-paso">Define los sacos a preparar para calcular el material necesario</p>
                  </div>
                </div>

                <div className="formulario-cuadricula">
                  <div className="control-grupo destacado">
                    <label>Sacos de cemento a batir hoy</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="1"
                      min="1"
                      className="campo-input grande"
                      value={hoy.sacosPlan}
                      onChange={(e) => setDia('sacosPlan')(e.target.value)}
                    />
                    <span className="texto-ayuda">Meta de producción programada</span>
                  </div>

                  <div className="caja-desglose-material">
                    <div className="linea-desglose">
                      <span className="label-desglose">Producción esperada</span>
                      <span className="valor-desglose">{calculosHoy.unidadesPlan} unidades</span>
                    </div>
                    <div className="linea-desglose">
                      <span className="label-desglose">Cemento necesario</span>
                      <span className="valor-desglose">{calculosHoy.sacosPlan} sacos</span>
                    </div>
                    <div className="linea-desglose">
                      <span className="label-desglose">Arena requerida</span>
                      <span className="valor-desglose">{calculosHoy.arenaPlanM3.toFixed(2)} m³</span>
                    </div>
                    <div className="linea-desglose">
                      <span className="label-desglose">Arrocillo requerido</span>
                      <span className="valor-desglose">{calculosHoy.arrocilloPlanM3.toFixed(2)} m³</span>
                    </div>
                    <div className="linea-desglose">
                      <span className="label-desglose">Agua estimada</span>
                      <span className="valor-desglose">{calculosHoy.aguaPlanLitros.toFixed(0)} L</span>
                    </div>
                  </div>

                  {hoy.tandaIniciada ? (
                    <div className="aviso-tanda-iniciada">
                      <p>Orden en produccion: se descontaron {cant(hoy.sacosLanzados)} sacos de cemento, {num(hoy.arenaLanzada).toFixed(2)} m³ de arena y {num(hoy.arrocilloLanzado).toFixed(2)} m³ de arrocillo de bodega.</p>
                    </div>
                  ) : (
                    <button type="button" className="btn-accion principal fila-completa" onClick={iniciarTandaHoy}>
                      Enviar Orden a Mezcladora (Descontar Materia Prima)
                    </button>
                  )}
                </div>
              </section>

              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">2</span>
                  <div>
                    <h2>Cierre de Jornada (Fin del Turno)</h2>
                    <p className="desc-paso">Registra la producción real, mermas y consolida el patio</p>
                  </div>
                </div>

                <div className="formulario-cuadricula">
                  <div className="control-grupo">
                    <label>Sacos realmente usados</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="1"
                      className="campo-input"
                      placeholder={'= ' + cant(calculosHoy.sacosPlan) + ' planeados'}
                      value={hoy.sacosReal}
                      onChange={(e) => setDia('sacosReal')(e.target.value)}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Unidades logradas (buenas)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="5"
                      className="campo-input"
                      placeholder={'= ' + calculosHoy.unidadesRealCalc + ' calculadas'}
                      value={hoy.bloquesReal}
                      onChange={(e) => setDia('bloquesReal')(e.target.value)}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Roturas en molde o patio</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="1"
                      className="campo-input"
                      value={hoy.roturas}
                      onChange={(e) => setDia('roturas')(e.target.value)}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Otras mermas / descartes</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="1"
                      className="campo-input"
                      value={hoy.otras}
                      onChange={(e) => setDia('otras')(e.target.value)}
                    />
                  </div>

                  <div className="control-grupo fila-completa">
                    <label>Nota u observación (lluvia, personal, humedad de arena)</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="Ej. Tanda matutina con arena húmeda, rinde más mezcla"
                      value={hoy.nota}
                      onChange={(e) => setDia('nota')(e.target.value)}
                    />
                  </div>

                  <div className="fila-completa balance-previo-cierre">
                    <div className="dato-cierre">
                      <span>Rendimiento real</span>
                      <strong>{calculosHoy.rendReal.toFixed(1)} unid / saco</strong>
                    </div>
                    <div className="dato-cierre">
                      <span>Costo de tanda</span>
                      <strong>{dinero(calculosHoy.costoProduccion)}</strong>
                    </div>
                    <div className="dato-cierre">
                      <span>Merma total</span>
                      <strong>
                        {calculosHoy.mermaTotal} unid ({dinero(calculosHoy.mermaValor)})
                      </strong>
                    </div>
                  </div>

                  <button className="btn-accion principal fila-completa" onClick={registrarCierreJornada}>
                    {hoy.tandaIniciada
                      ? 'Finalizar Producción e Incrementar Stock en Patio'
                      : 'Registrar Cierre de Jornada y Actualizar Stock'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {tab === 'cola' && (
          <div className="vista-cola">
            <div className="encabezado-seccion">
              <div>
                <h2>Cola de Pedidos & Planificación MRP</h2>
                <p>Evaluación de existencia en patio, cola de espera y cálculo de materiales requeridos</p>
              </div>
            </div>

            <section className="banner-mrp-cola">
              <div className="mrp-cabecera">
                <span className={'badge-mrp ' + (evaluacionMaterialesCola.alcanzaMaterial ? 'ok' : 'alerta')}>
                  {evaluacionMaterialesCola.alcanzaMaterial ? 'MATERIALES COMPLETOS EN BODEGA' : 'FALTANTE DE MATERIA PRIMA PARA LA COLA'}
                </span>
                <h3>Balance para completar {pedidosPendientes.length} pedidos en cola ({cant(evaluacionMaterialesCola.totalUnidades)} prefabricados)</h3>
              </div>

              <div className="rejilla-mrp-indicadores">
                <div className={'caja-mrp-dato ' + (evaluacionMaterialesCola.deficitSacos > 0 ? 'deficit' : '')}>
                  <span className="mrp-tit">Cemento requerido</span>
                  <strong>{cant(evaluacionMaterialesCola.sacosRequeridos)} sacos</strong>
                  <span className="mrp-sub">En bodega: {cant(evaluacionMaterialesCola.sacosBodega)} sacos</span>
                  {evaluacionMaterialesCola.deficitSacos > 0 && (
                    <span className="mrp-alerta-texto">Faltan {cant(evaluacionMaterialesCola.deficitSacos)} sacos</span>
                  )}
                </div>

                <div className={'caja-mrp-dato ' + (evaluacionMaterialesCola.deficitArena > 0.05 ? 'deficit' : '')}>
                  <span className="mrp-tit">Arena requerida</span>
                  <strong>{evaluacionMaterialesCola.arenaM3Requerida.toFixed(2)} m³</strong>
                  <span className="mrp-sub">En bodega: {cant(evaluacionMaterialesCola.arenaBodega)} m³</span>
                  {evaluacionMaterialesCola.deficitArena > 0.05 && (
                    <span className="mrp-alerta-texto">Faltan {evaluacionMaterialesCola.deficitArena.toFixed(2)} m³</span>
                  )}
                </div>

                <div className={'caja-mrp-dato ' + (evaluacionMaterialesCola.deficitArrocillo > 0.05 ? 'deficit' : '')}>
                  <span className="mrp-tit">Arrocillo requerido</span>
                  <strong>{evaluacionMaterialesCola.arrocilloM3Requerido.toFixed(2)} m³</strong>
                  <span className="mrp-sub">En bodega: {cant(evaluacionMaterialesCola.arrocilloBodega)} m³</span>
                  {evaluacionMaterialesCola.deficitArrocillo > 0.05 && (
                    <span className="mrp-alerta-texto">Faltan {evaluacionMaterialesCola.deficitArrocillo.toFixed(2)} m³</span>
                  )}
                </div>
              </div>

              {!evaluacionMaterialesCola.alcanzaMaterial && (
                <div className="aviso-accion-mrp">
                  <p>Para cumplir los pedidos pendientes necesitas abastecer bodega antes de iniciar la producción.</p>
                  <button className="btn-accion principal" onClick={() => setTab('proveedores')}>
                    Ver Proveedores para Pedir Materiales
                  </button>
                </div>
              )}
            </section>

            <div className="dos-columnas-operacion">
              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">+</span>
                  <div>
                    <h2>Ingresar Pedido a la Cola</h2>
                    <p className="desc-paso">Evalúa existencia en patio o añade a la cola de producción</p>
                  </div>
                </div>

                <form onSubmit={crearOPonerEnColaPedido} className="formulario-cuadricula">
                  <div className="control-grupo fila-completa">
                    <label>Cliente / Comprador</label>
                    <select
                      className="control-select"
                      value={formPedido.clienteId}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, clienteId: e.target.value }))}
                    >
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.ubicacion || c.contacto})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="control-grupo">
                    <label>Producto solicitado</label>
                    <select
                      className="control-select"
                      value={formPedido.productoId}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, productoId: e.target.value }))}
                    >
                      {productos.map((p) => {
                        const stockP = num(inv.invPorProducto?.[p.id] ?? (p.id === 'b12' ? inv.invBloques : 0))
                        return (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (Stock patio: {stockP})
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="control-grupo">
                    <label>Cantidad de unidades</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      className="campo-input"
                      value={formPedido.cantidad}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, cantidad: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Precio acordado ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="campo-input"
                      placeholder={
                        'Ref: ' +
                        dinero(
                          num(
                            (productos.find((x) => x.id === formPedido.productoId) || productoActivo)
                              .precioVenta,
                          ),
                        )
                      }
                      value={formPedido.precioUnitario}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, precioUnitario: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Prioridad de entrega</label>
                    <select
                      className="control-select"
                      value={formPedido.prioridad}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, prioridad: e.target.value }))}
                    >
                      <option value="alta">Alta (Urgente)</option>
                      <option value="media">Media (Normal)</option>
                      <option value="baja">Baja (Sin apuro)</option>
                    </select>
                  </div>

                  <div className="control-grupo">
                    <label>Plazo estimado (días)</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="campo-input"
                      value={formPedido.diasEntrega}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, diasEntrega: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo fila-completa">
                    <label>Detalle o destino de entrega</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="Ej. Retiro en volqueta día jueves por la mañana"
                      value={formPedido.nota}
                      onChange={(e) => setFormPedido((fp) => ({ ...fp, nota: e.target.value }))}
                    />
                  </div>

                  <button type="submit" className="btn-accion principal fila-completa">
                    Evaluar Existencia y Registrar Pedido
                  </button>
                </form>
              </section>

              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">i</span>
                  <div>
                    <h2>Resumen de Existencias en Patio</h2>
                    <p className="desc-paso">Disponibilidad inmediata para atender pedidos sin esperar producción</p>
                  </div>
                </div>

                <div className="lista-disponibilidad-patio">
                  {productos.map((pr) => {
                    const st = num(inv.invPorProducto?.[pr.id] ?? (pr.id === 'b12' ? inv.invBloques : 0))
                    return (
                      <div className="item-disp-patio" key={pr.id}>
                        <div>
                          <strong>{pr.nombre}</strong>
                          <span className="disp-categoria">{pr.categoria}</span>
                        </div>
                        <div className="disp-cifra">
                          <span className={st > 50 ? 'badge-disp ok' : 'badge-disp bajo'}>
                            {st} unidades disponibles
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <section className="bloque-tabla-ventas">
              <h3>Órdenes en Cola de Espera & Producción</h3>
              {pedidos.length === 0 ? (
                <p className="texto-vacio">No hay pedidos registrados en cola.</p>
              ) : (
                <div className="tabla-scroll">
                  <table className="tabla-sistema">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Prioridad</th>
                        <th>Entrega Est.</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((ped) => (
                        <tr key={ped.id}>
                          <td>{fechaCorta(ped.fecha)}</td>
                          <td>
                            <strong>{ped.clienteNombre}</strong>
                            {ped.nota ? <span className="nota-sub"> · {ped.nota}</span> : null}
                          </td>
                          <td>{ped.productoNombre}</td>
                          <td>{cant(ped.cantidad)} unid.</td>
                          <td>
                            <span className={'badge-prioridad ' + ped.prioridad}>
                              {ped.prioridad.toUpperCase()}
                            </span>
                          </td>
                          <td>{fechaCorta(ped.fechaEntregaEstimada)}</td>
                          <td>{dinero(ped.total)}</td>
                          <td>
                            <span className={'badge-estado-pedido ' + ped.estado}>
                              {ped.estado === 'en_cola'
                                ? 'En Espera'
                                : ped.estado === 'en_produccion'
                                  ? 'En Producción'
                                  : ped.estado === 'listo'
                                    ? 'Listo en Patio'
                                    : 'Entregado'}
                            </span>
                          </td>
                          <td>
                            <div className="acciones-fila-cola">
                              {ped.estado === 'en_cola' && (
                                <>
                                  <button
                                    className="btn-mini-accion prod"
                                    title="Iniciar Producción (Descuenta Materia Prima de Bodega)"
                                    onClick={() => iniciarProduccionPedido(ped.id)}
                                  >
                                    Producir (-Materia Prima)
                                  </button>
                                  <button
                                    className="btn-mini-accion desp"
                                    title="Despachar de inmediato desde patio"
                                    onClick={() => despacharPedidoDeCola(ped.id)}
                                  >
                                    Despacho Inmediato
                                  </button>
                                </>
                              )}
                              {ped.estado === 'en_produccion' && (
                                <button
                                  className="btn-mini-accion fin"
                                  title="Finalizar Producción e Incrementar Patio"
                                  onClick={() => finalizarProduccionPedido(ped.id)}
                                >
                                  Finalizar (+Patio)
                                </button>
                              )}
                              {ped.estado === 'listo' && (
                                <button
                                  className="btn-mini-accion desp"
                                  title="Despachar pedido terminado al cliente"
                                  onClick={() => despacharPedidoDeCola(ped.id)}
                                >
                                  Despachar al Cliente
                                </button>
                              )}
                              <button
                                className="btn-mini-del"
                                title="Eliminar pedido"
                                onClick={() => borrarPedido(ped.id)}
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'goodwill' && (
          <div className="vista-goodwill">
            <div className="encabezado-seccion">
              <div>
                <h2>Análisis de Clientes, Goodwill & Previsión Comercial</h2>
                <p>Historial de compras, fidelidad comercial y previsión de necesidades para anticipar pedidos</p>
              </div>
            </div>

            <section className="bloque-previsiones-alertas">
              <h3>Previsión Proactiva de Necesidades (Próximos Pedidos Estimados)</h3>
              <div className="rejilla-previsiones">
                {analisisGoodwill.previsiones.length === 0 ? (
                  <p className="texto-vacio">No hay alertas de demanda previstas para esta semana.</p>
                ) : (
                  analisisGoodwill.previsiones.map((prev, idx) => (
                    <div className="tarjeta-prevision" key={idx}>
                      <div className="prev-cab">
                        <span className="badge-prev">PREVISION COMERCIAL</span>
                        <span className="prev-dias">
                          {prev.diasRestantes <= 0 ? 'Demanda inminente' : 'En ' + prev.diasRestantes + ' días'}
                        </span>
                      </div>
                      <h4>{prev.clienteNombre}</h4>
                      <p className="prev-rec">{prev.recomendacion}</p>
                      <span className="prev-tiempo">Último pedido registrado hace {prev.diasDesdeUltimo} días</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="bloque-tabla-ventas">
              <h3>Índice de Goodwill y Fidelidad por Cliente</h3>
              <div className="tabla-scroll">
                <table className="tabla-sistema">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Volumen Histórico</th>
                      <th>Pedidos</th>
                      <th>Última Compra</th>
                      <th>Frecuencia Media</th>
                      <th>Índice Goodwill</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analisisGoodwill.analisisPorCliente.map((an) => (
                      <tr key={an.cliente.id}>
                        <td>
                          <strong>{an.cliente.nombre}</strong>
                          <span className="nota-sub"> · {an.cliente.ubicacion || 'Sin ubicación'}</span>
                        </td>
                        <td>
                          {an.cliente.contacto ? (
                            <a href={enlaceTel(an.cliente.contacto) || '#'} className="link-tel">
                              {an.cliente.contacto}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{dinero(an.totalComprado)}</td>
                        <td>{an.pedidosRealizados} órdenes</td>
                        <td>
                          {an.diasDesdeUltimoPedido !== null
                            ? 'Hace ' + an.diasDesdeUltimoPedido + ' días'
                            : 'Sin registros'}
                        </td>
                        <td>
                          {an.intervaloPromedioDias ? 'Cada ~' + an.intervaloPromedioDias + ' días' : '—'}
                        </td>
                        <td>
                          <div className="barra-goodwill">
                            <div
                              className="fill-goodwill"
                              style={{ width: an.puntuacionFidelidad + '%' }}
                            />
                            <span className="texto-goodwill">{an.puntuacionFidelidad} / 100</span>
                          </div>
                        </td>
                        <td>
                          <span className={an.puntuacionFidelidad >= 80 ? 'badge-gw vip' : 'badge-gw normal'}>
                            {an.puntuacionFidelidad >= 80 ? 'Cliente Frecuente' : 'En Desarrollo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {tab === 'bodega' && (
          <div className="vista-bodega">
            <div className="encabezado-seccion">
              <div>
                <h2>Bodega Central & Inventario</h2>
                <p>Nivel de existencias de materias primas y productos listos para venta en patio</p>
              </div>
            </div>

            <div className="rejilla-inventarios-tarjetas">
              <div className={'tarjeta-stock ' + (calculosHoy.bajoSacos ? 'alerta-borde' : '')}>
                <div className="stock-top">
                  <span className="tag-tipo">Materia Prima</span>
                  <span className="tag-alerta">{calculosHoy.bajoSacos ? 'Stock Crítico' : 'Normal'}</span>
                </div>
                <h3>Cemento en Bodega</h3>
                <div className="cifra-stock-principal">
                  <input
                    type="number"
                    step="1"
                    className="input-stock-directo"
                    value={inv.invSacos}
                    onChange={(e) => setInv('invSacos')(e.target.value)}
                  />
                  <span className="unidad-stock">sacos</span>
                </div>
                <div className="barra-progreso">
                  <div
                    className="progreso-fill"
                    style={{
                      width: Math.min(100, (num(inv.invSacos) / (num(cfg.umbrales.sacos) * 2)) * 100) + '%',
                    }}
                  />
                </div>
                <p className="pie-stock">
                  Stock mínimo configurado: {cfg.umbrales.sacos} sacos. Proveedor:{' '}
                  {proveedorSugerido('cemento').nombre}
                </p>
              </div>

              <div className={'tarjeta-stock ' + (calculosHoy.bajoArena ? 'alerta-borde' : '')}>
                <div className="stock-top">
                  <span className="tag-tipo">Materia Prima</span>
                  <span className="tag-alerta">{calculosHoy.bajoArena ? 'Stock Crítico' : 'Normal'}</span>
                </div>
                <h3>Arena Lavada</h3>
                <div className="cifra-stock-principal">
                  <input
                    type="number"
                    step="0.1"
                    className="input-stock-directo"
                    value={inv.invArena}
                    onChange={(e) => setInv('invArena')(e.target.value)}
                  />
                  <span className="unidad-stock">m³</span>
                </div>
                <div className="barra-progreso">
                  <div
                    className="progreso-fill"
                    style={{
                      width: Math.min(100, (num(inv.invArena) / (num(cfg.umbrales.arena) * 2)) * 100) + '%',
                    }}
                  />
                </div>
                <p className="pie-stock">
                  Aprox. {cant(num(inv.invArena) / tobosM3)} tobos de 20L. Proveedor:{' '}
                  {proveedorSugerido('arena').nombre}
                </p>
              </div>

              <div className={'tarjeta-stock ' + (calculosHoy.bajoArrocillo ? 'alerta-borde' : '')}>
                <div className="stock-top">
                  <span className="tag-tipo">Materia Prima</span>
                  <span className="tag-alerta">{calculosHoy.bajoArrocillo ? 'Stock Crítico' : 'Normal'}</span>
                </div>
                <h3>Arrocillo / Piedrín</h3>
                <div className="cifra-stock-principal">
                  <input
                    type="number"
                    step="0.1"
                    className="input-stock-directo"
                    value={inv.invArrocillo}
                    onChange={(e) => setInv('invArrocillo')(e.target.value)}
                  />
                  <span className="unidad-stock">m³</span>
                </div>
                <div className="barra-progreso">
                  <div
                    className="progreso-fill"
                    style={{
                      width: Math.min(100, (num(inv.invArrocillo) / (num(cfg.umbrales.arrocillo) * 2)) * 100) + '%',
                    }}
                  />
                </div>
                <p className="pie-stock">
                  Aprox. {cant(num(inv.invArrocillo) / tobosM3)} tobos. Proveedor:{' '}
                  {proveedorSugerido('arrocillo').nombre}
                </p>
              </div>
            </div>

            <section className="bloque-patio-productos">
              <h3>Inventario de Prefabricados Terminados en Patio</h3>
              <div className="rejilla-productos-patio">
                {productos.map((p) => {
                  const stockActual = inv.invPorProducto?.[p.id] ?? (p.id === 'b12' ? inv.invBloques : '0')
                  const costoU = costosPorProducto[p.id]?.costoUnidad || 0
                  return (
                    <div className="tarjeta-prod-patio" key={p.id}>
                      <div className="prod-patio-info">
                        <h4>{p.nombre}</h4>
                        <span className="categoria-prod">{p.categoria}</span>
                      </div>
                      <div className="prod-patio-inputs">
                        <label>Stock en patio</label>
                        <input
                          type="number"
                          step="1"
                          className="campo-input"
                          value={stockActual}
                          onChange={(e) => setStockProducto(p.id, e.target.value)}
                        />
                      </div>
                      <div className="prod-patio-valor">
                        <span>Valoración estimada</span>
                        <strong>{dinero(num(stockActual) * costoU)}</strong>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="panel-recepcion-material">
              <div className="tarjeta-cab">
                <span className="paso-num">+</span>
                <div>
                  <h2>Recepción de Materia Prima (Entrada de Compras)</h2>
                  <p className="desc-paso">Registra facturas o viajes de cemento, arena y arrocillo</p>
                </div>
              </div>

              <div className="formulario-cuadricula">
                <div className="control-grupo fila-completa">
                  <label>Proveedor que abastece</label>
                  <select
                    className="control-select"
                    value={compra.proveedorId}
                    onChange={(e) => setCompra((x) => ({ ...x, proveedorId: e.target.value }))}
                  >
                    {proveedores.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.nombre} ({pr.material} · {pr.contacto})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="control-grupo">
                  <label>Sacos de cemento ingresados</label>
                  <input
                    type="number"
                    step="1"
                    className="campo-input"
                    placeholder="0"
                    value={compra.sacos}
                    onChange={(e) => setCompra((x) => ({ ...x, sacos: e.target.value }))}
                  />
                </div>

                <div className="control-grupo">
                  <label>Arena ingresada (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="campo-input"
                    placeholder="0.0"
                    value={compra.arena}
                    onChange={(e) => setCompra((x) => ({ ...x, arena: e.target.value }))}
                  />
                </div>

                <div className="control-grupo">
                  <label>Arrocillo ingresado (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="campo-input"
                    placeholder="0.0"
                    value={compra.arrocillo}
                    onChange={(e) => setCompra((x) => ({ ...x, arrocillo: e.target.value }))}
                  />
                </div>

                <div className="control-grupo fila-completa">
                  <label>Detalle de la compra o número de factura</label>
                  <input
                    type="text"
                    className="campo-input"
                    placeholder="Ej. Viaje de volqueta #145, pagado al contado"
                    value={compra.nota}
                    onChange={(e) => setCompra((x) => ({ ...x, nota: e.target.value }))}
                  />
                </div>

                <button className="btn-accion principal fila-completa" onClick={ejecutarCompra}>
                  Registrar Entrada al Inventario
                </button>
              </div>
            </section>
          </div>
        )}

        {tab === 'ventas' && (
          <div className="vista-ventas">
            <div className="encabezado-seccion">
              <div>
                <h2>Ventas & Clientes (CRM Comercial)</h2>
                <p>Directorio de clientes, saldos por cobrar e historial de despachos concluidos</p>
              </div>
            </div>

            <div className="dos-columnas-operacion">
              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">+</span>
                  <div>
                    <h2>Agregar Nuevo Cliente / Finca</h2>
                    <p className="desc-paso">Registra contactos de obras o fincas para pedidos</p>
                  </div>
                </div>

                <form onSubmit={agregarCliente} className="formulario-cuadricula">
                  <div className="control-grupo fila-completa">
                    <label>Nombre o Razón Social</label>
                    <input
                      type="text"
                      required
                      className="campo-input"
                      placeholder="Ej. Finca Ganadera El Recreo"
                      value={nuevoCliente.nombre}
                      onChange={(e) => setNuevoCliente((x) => ({ ...x, nombre: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Teléfono o Celular</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="099..."
                      value={nuevoCliente.contacto}
                      onChange={(e) => setNuevoCliente((x) => ({ ...x, contacto: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo">
                    <label>Ubicación / Sector de entrega</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="Ej. Recinto Las Palmas Km 12"
                      value={nuevoCliente.ubicacion}
                      onChange={(e) => setNuevoCliente((x) => ({ ...x, ubicacion: e.target.value }))}
                    />
                  </div>

                  <div className="control-grupo fila-completa">
                    <label>Notas de contacto</label>
                    <input
                      type="text"
                      className="campo-input"
                      placeholder="Ej. Comprador frecuente de estantillos"
                      value={nuevoCliente.nota}
                      onChange={(e) => setNuevoCliente((x) => ({ ...x, nota: e.target.value }))}
                    />
                  </div>

                  <button type="submit" className="btn-accion principal fila-completa">
                    Guardar Cliente
                  </button>
                </form>
              </section>

              <section className="panel-operativo">
                <div className="tarjeta-cab">
                  <span className="paso-num">$</span>
                  <div>
                    <h2>Balance de Cuentas por Cobrar</h2>
                    <p className="desc-paso">Estado global de cobranzas de prefabricados</p>
                  </div>
                </div>

                <div className="caja-desglose-material">
                  <div className="linea-desglose">
                    <span className="label-desglose">Total despachado histórico</span>
                    <span className="valor-desglose">
                      {dinero(ventas.reduce((s, v) => s + v.total, 0))}
                    </span>
                  </div>
                  <div className="linea-desglose">
                    <span className="label-desglose">Saldo pendiente por cobrar</span>
                    <span className="valor-desglose texto-alerta">{dinero(totalPorCobrar)}</span>
                  </div>
                  <div className="linea-desglose">
                    <span className="label-desglose">Clientes registrados</span>
                    <span className="valor-desglose">{clientes.length} contactos</span>
                  </div>
                </div>
              </section>
            </div>

            <section className="bloque-tabla-ventas">
              <h3>Directorio de Clientes & Cuentas por Cobrar</h3>
              <div className="tabla-scroll">
                <table className="tabla-sistema">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Contacto</th>
                      <th>Ubicación</th>
                      <th>Despachos</th>
                      <th>Total Comprado</th>
                      <th>Saldo Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => {
                      const bal = balanceClientes[c.id] || {
                        totalComprado: 0,
                        totalPendiente: 0,
                        despachos: 0,
                      }
                      return (
                        <tr key={c.id}>
                          <td>
                            <strong>{c.nombre}</strong>
                            {c.nota ? <span className="nota-sub"> · {c.nota}</span> : null}
                          </td>
                          <td>
                            {c.contacto ? (
                              <a href={enlaceTel(c.contacto) || '#'} className="link-tel">
                                {c.contacto}
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td>{c.ubicacion || '—'}</td>
                          <td>{bal.despachos}</td>
                          <td>{dinero(bal.totalComprado)}</td>
                          <td className={bal.totalPendiente > 0 ? 'texto-alerta' : 'texto-ok'}>
                            {dinero(bal.totalPendiente)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bloque-tabla-ventas">
              <h3>Historial de Despachos Realizados</h3>
              {ventas.length === 0 ? (
                <p className="texto-vacio">No hay ventas registradas aún.</p>
              ) : (
                <div className="tabla-scroll">
                  <table className="tabla-sistema">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>P. Unitario</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((v) => (
                        <tr key={v.id}>
                          <td>{fechaCorta(v.fecha)}</td>
                          <td>{v.clienteNombre}</td>
                          <td>{v.productoNombre}</td>
                          <td>{cant(v.cantidad)}</td>
                          <td>{dinero(v.precioUnitario)}</td>
                          <td>{dinero(v.total)}</td>
                          <td>
                            <span className={'badge-estado ' + v.estadoPago}>
                              {v.estadoPago === 'pagado' ? 'Pagado' : 'Por Cobrar'}
                            </span>
                          </td>
                          <td>
                            {v.estadoPago === 'pendiente' ? (
                              <button
                                className="btn-mini-ok"
                                onClick={() => {
                                  setVentas((vts) =>
                                    vts.map((item) =>
                                      item.id === v.id ? { ...item, estadoPago: 'pagado' } : item,
                                    ),
                                  )
                                }}
                              >
                                Marcar Cobrado
                              </button>
                            ) : (
                              <button
                                className="btn-mini-del"
                                onClick={() => setVentas((vts) => vts.filter((item) => item.id !== v.id))}
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'proveedores' && (
          <div className="vista-proveedores">
            <div className="encabezado-seccion">
              <div>
                <h2>Directorio de Proveedores & Abastecimiento</h2>
                <p>Crea, edita y gestiona canteras y cementeras con contactos inmediatos</p>
              </div>
              <button className="btn-accion principal" onClick={abrirModalCrearProveedor}>
                + Nuevo Proveedor
              </button>
            </div>

            <div className="rejilla-proveedores">
              {proveedores.map((pr) => {
                const msj =
                  'Hola ' +
                  pr.nombre +
                  ', nos comunicamos de la bloquera para consultar disponibilidad de ' +
                  pr.material +
                  '.'
                const linkWa = enlaceWhatsapp(pr.contacto, msj)
                const linkTel = enlaceTel(pr.contacto)
                return (
                  <div className="tarjeta-proveedor" key={pr.id}>
                    <div className="prov-cab">
                      <span className="badge-material">{pr.material.toUpperCase()}</span>
                      <span className="prov-precio">
                        Ref: {dinero(num(pr.precioRef))} / {pr.unidad}
                      </span>
                    </div>
                    <h3>{pr.nombre}</h3>
                    <p className="prov-contacto">Teléfono: {pr.contacto || 'Sin número'}</p>
                    {pr.nota ? <p className="prov-nota">{pr.nota}</p> : null}

                    <div className="prov-acciones">
                      {linkWa && (
                        <a className="btn-accion-prov wa" href={linkWa} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      )}
                      {linkTel && (
                        <a className="btn-accion-prov tel" href={linkTel}>
                          Llamar
                        </a>
                      )}
                      <button
                        className="btn-accion-prov edit"
                        onClick={() => abrirModalEditarProveedor(pr)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-accion-prov del"
                        onClick={() => borrarProveedor(pr.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="btn-accion-prov compra"
                        onClick={() => {
                          setCompra((c) => ({ ...c, proveedorId: pr.id }))
                          setTab('bodega')
                        }}
                      >
                        Recibir Compra
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {modalProveedor && (
              <div className="modal-overlay">
                <div className="modal-contenido">
                  <h3>{proveedorEnEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor de Insumos'}</h3>
                  <form onSubmit={guardarProveedor} className="formulario-cuadricula">
                    <div className="control-grupo fila-completa">
                      <label>Nombre de la Empresa o Contacto</label>
                      <input
                        type="text"
                        required
                        className="campo-input"
                        placeholder="Ej. Cantera Río Lindo"
                        value={formProveedor.nombre}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, nombre: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Material principal</label>
                      <select
                        className="control-select"
                        value={formProveedor.material}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, material: e.target.value }))}
                      >
                        <option value="cemento">Cemento</option>
                        <option value="arena">Arena</option>
                        <option value="arrocillo">Arrocillo</option>
                        <option value="general">Varios / Fletes</option>
                      </select>
                    </div>

                    <div className="control-grupo">
                      <label>Teléfono o Celular</label>
                      <input
                        type="text"
                        className="campo-input"
                        placeholder="099..."
                        value={formProveedor.contacto}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, contacto: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Precio referencial ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="campo-input"
                        placeholder="30.00"
                        value={formProveedor.precioRef}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, precioRef: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Unidad de medida</label>
                      <input
                        type="text"
                        className="campo-input"
                        placeholder="m³ volqueta / saco"
                        value={formProveedor.unidad}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, unidad: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo fila-completa">
                      <label>Condiciones de entrega o notas</label>
                      <input
                        type="text"
                        className="campo-input"
                        placeholder="Ej. Despacha los martes y viernes"
                        value={formProveedor.nota}
                        onChange={(e) => setFormProveedor((x) => ({ ...x, nota: e.target.value }))}
                      />
                    </div>

                    <div className="fila-botones modal-pie">
                      <button type="button" className="btn-accion" onClick={() => setModalProveedor(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-accion principal">
                        {proveedorEnEdicion ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'catalogo' && (
          <div className="vista-catalogo">
            <div className="encabezado-seccion">
              <div>
                <h2>Catálogo de Prefabricados & Dosificación</h2>
                <p>Configura las recetas de mezcla por saco, rendimientos esperados y precios de venta</p>
              </div>
              <button className="btn-accion principal" onClick={() => setModalNuevoProd(true)}>
                + Nuevo Prefabricado
              </button>
            </div>

            <div className="rejilla-catalogo-productos">
              {productos.map((p) => {
                const costos = costosPorProducto[p.id] || { costoSaco: 24, costoUnidad: 0.4 }
                return (
                  <div className="tarjeta-receta-prod" key={p.id}>
                    <div className="tarjeta-receta-cab">
                      <div>
                        <h3>{p.nombre}</h3>
                        <span className="categoria-prod">{p.categoria}</span>
                      </div>
                      <div className="costos-resumen-prod">
                        <span>Costo: {dinero(costos.costoUnidad)}</span>
                        <strong>Venta: {dinero(num(p.precioVenta))}</strong>
                      </div>
                    </div>

                    <div className="formulario-receta">
                      <div className="control-grupo">
                        <label>Rendimiento (unid/saco)</label>
                        <input
                          type="number"
                          step="0.5"
                          className="campo-input"
                          value={p.rendimiento}
                          onChange={(e) => actualizarPrecioProd(p.id, 'rendimiento', e.target.value)}
                        />
                      </div>

                      <div className="control-grupo">
                        <label>Precio de venta ($)</label>
                        <input
                          type="number"
                          step="0.05"
                          className="campo-input"
                          value={p.precioVenta}
                          onChange={(e) => actualizarPrecioProd(p.id, 'precioVenta', e.target.value)}
                        />
                      </div>

                      <div className="control-grupo">
                        <label>Tobos arena / saco</label>
                        <input
                          type="number"
                          step="0.5"
                          className="campo-input"
                          value={p.tobosArena}
                          onChange={(e) => actualizarPrecioProd(p.id, 'tobosArena', e.target.value)}
                        />
                      </div>

                      <div className="control-grupo">
                        <label>Tobos arrocillo / saco</label>
                        <input
                          type="number"
                          step="0.5"
                          className="campo-input"
                          value={p.tobosArrocillo}
                          onChange={(e) => actualizarPrecioProd(p.id, 'tobosArrocillo', e.target.value)}
                        />
                      </div>

                      <div className="control-grupo">
                        <label>Tobos agua / saco</label>
                        <input
                          type="number"
                          step="0.25"
                          className="campo-input"
                          value={p.tobosAgua}
                          onChange={(e) => actualizarPrecioProd(p.id, 'tobosAgua', e.target.value)}
                        />
                      </div>

                      <div className="control-grupo">
                        <label>Mano de obra / saco ($)</label>
                        <input
                          type="number"
                          step="0.25"
                          className="campo-input"
                          value={p.manoObraSaco}
                          onChange={(e) => actualizarPrecioProd(p.id, 'manoObraSaco', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pie-receta">
                      <span>Costo total por saco preparado: {dinero(costos.costoSaco)}</span>
                      <span>
                        Margen:{' '}
                        {num(p.precioVenta) > 0 && costos.costoUnidad > 0
                          ? Math.round(((num(p.precioVenta) - costos.costoUnidad) / num(p.precioVenta)) * 100) + '%'
                          : '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {modalNuevoProd && (
              <div className="modal-overlay">
                <div className="modal-contenido">
                  <h3>Crear Nuevo Producto Prefabricado</h3>
                  <form onSubmit={guardarNuevoProducto} className="formulario-cuadricula">
                    <div className="control-grupo fila-completa">
                      <label>Nombre del producto</label>
                      <input
                        type="text"
                        required
                        className="campo-input"
                        placeholder="Ej. Bordillo de acera 50x20x15"
                        value={nuevoProd.nombre}
                        onChange={(e) => setNuevoProd((x) => ({ ...x, nombre: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Categoría</label>
                      <input
                        type="text"
                        className="campo-input"
                        placeholder="Ej. Prefabricados viales"
                        value={nuevoProd.categoria}
                        onChange={(e) => setNuevoProd((x) => ({ ...x, categoria: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Rendimiento por saco</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        className="campo-input"
                        placeholder="25"
                        value={nuevoProd.rendimiento}
                        onChange={(e) => setNuevoProd((x) => ({ ...x, rendimiento: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Precio de venta estimado ($)</label>
                      <input
                        type="number"
                        step="0.05"
                        required
                        className="campo-input"
                        placeholder="1.20"
                        value={nuevoProd.precioVenta}
                        onChange={(e) => setNuevoProd((x) => ({ ...x, precioVenta: e.target.value }))}
                      />
                    </div>

                    <div className="control-grupo">
                      <label>Mano de obra por saco ($)</label>
                      <input
                        type="number"
                        step="0.25"
                        className="campo-input"
                        value={nuevoProd.manoObraSaco}
                        onChange={(e) => setNuevoProd((x) => ({ ...x, manoObraSaco: e.target.value }))}
                      />
                    </div>

                    <div className="fila-botones modal-pie">
                      <button type="button" className="btn-accion" onClick={() => setModalNuevoProd(false)}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn-accion principal">
                        Guardar Prefabricado
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <section className="panel-operativo config-base">
              <div className="tarjeta-cab">
                <span className="paso-num">C</span>
                <div>
                  <h2>Costos Base de Materia Prima & Umbrales de Stock</h2>
                  <p className="desc-paso">Precios generales de compra en bodega y límites para avisos automáticos</p>
                </div>
              </div>

              <div className="formulario-cuadricula">
                <div className="control-grupo">
                  <label>Saco de cemento ($ / 42.5kg)</label>
                  <input
                    type="number"
                    step="0.25"
                    className="campo-input"
                    value={cfg.precios.sacoCemento}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, precios: { ...c.precios, sacoCemento: e.target.value } }))
                    }
                  />
                </div>

                <div className="control-grupo">
                  <label>Arena lavada ($ / m³)</label>
                  <input
                    type="number"
                    step="1"
                    className="campo-input"
                    value={cfg.precios.arenaM3}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, precios: { ...c.precios, arenaM3: e.target.value } }))
                    }
                  />
                </div>

                <div className="control-grupo">
                  <label>Arrocillo triturado ($ / m³)</label>
                  <input
                    type="number"
                    step="1"
                    className="campo-input"
                    value={cfg.precios.arrocilloM3}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, precios: { ...c.precios, arrocilloM3: e.target.value } }))
                    }
                  />
                </div>

                <div className="control-grupo">
                  <label>Umbral alerta cemento (sacos)</label>
                  <input
                    type="number"
                    step="1"
                    className="campo-input"
                    value={cfg.umbrales.sacos}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, umbrales: { ...c.umbrales, sacos: e.target.value } }))
                    }
                  />
                </div>

                <div className="control-grupo">
                  <label>Umbral alerta arena (m³)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="campo-input"
                    value={cfg.umbrales.arena}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, umbrales: { ...c.umbrales, arena: e.target.value } }))
                    }
                  />
                </div>

                <div className="control-grupo">
                  <label>Umbral alerta arrocillo (m³)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="campo-input"
                    value={cfg.umbrales.arrocillo}
                    onChange={(e) =>
                      setCfg((c) => ({ ...c, umbrales: { ...c.umbrales, arrocillo: e.target.value } }))
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'historial' && (
          <div className="vista-historial">
            <div className="encabezado-seccion">
              <div>
                <h2>Historial de Producción & Rendimientos Reales</h2>
                <p>Auditoría de jornadas concluidas, recalibración de bloques por saco y mermas</p>
              </div>
              {historial.length > 0 && (
                <button
                  className="btn-mini-del"
                  onClick={() => {
                    if (window.confirm('¿Borrar todo el historial de producción?')) {
                      setHistorial([])
                    }
                  }}
                >
                  Vaciar Historial
                </button>
              )}
            </div>

            {historial.length === 0 ? (
              <p className="texto-vacio">Aún no hay jornadas registradas. Cierra un turno para ver datos aquí.</p>
            ) : (
              <div className="tabla-scroll">
                <table className="tabla-sistema">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Producto</th>
                      <th>Sacos</th>
                      <th>Unidades Buenas</th>
                      <th>Rendimiento</th>
                      <th>Merma</th>
                      <th>Costo Tanda</th>
                      <th>Observaciones</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((x) => {
                      const mermaTot = (num(x.roturas) || 0) + (num(x.otras) || 0)
                      const rendCalc = num(x.sacos) > 0 ? (num(x.bloques) / num(x.sacos)).toFixed(1) : '—'
                      return (
                        <tr key={x.id}>
                          <td>{fechaCorta(x.fecha)}</td>
                          <td>
                            <strong>{x.productoNombre || 'Bloque 12'}</strong>
                          </td>
                          <td>{cant(x.sacos ?? x.tandas)}</td>
                          <td>{cant(x.bloques)}</td>
                          <td>{x.rendReal ? num(x.rendReal).toFixed(1) : rendCalc} u/saco</td>
                          <td>
                            {mermaTot > 0 ? (
                              <span className="texto-alerta">
                                {mermaTot} ({dinero(x.perdidasValor || 0)})
                              </span>
                            ) : (
                              '0'
                            )}
                          </td>
                          <td>{dinero(x.costoProduccion || 0)}</td>
                          <td>{x.nota || '—'}</td>
                          <td>
                            <button
                              className="btn-mini-del"
                              onClick={() => setHistorial((h) => h.filter((it) => it.id !== x.id))}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="pie-sistema">
        Sistema de Gestión Bloquera & Prefabricados · Datos resguardados localmente en el navegador
      </footer>
    </div>
  )
}
