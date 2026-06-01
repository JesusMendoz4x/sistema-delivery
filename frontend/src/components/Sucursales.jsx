import { useEffect, useRef, useState } from "react";
import centroImg from "../assets/centro.png";
import reformaImg from "../assets/reforma.png";
import macroplazaImg from "../assets/macroplaza.png";
import montealbanImg from "../assets/MonteAlban.png";
import api from "../services/api";

// Datos estáticos: fotos, descripciones y referencias locales
const sucursalesEstaticas = [
  {
    id: 1,
    codigo: "01",
    nombre: "Centro",
    nombreCompleto: "Casablanca Ramen House Centro",
    direccion:
      "Luis Jimenez Figueroa, Col. Centro, 68070 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 22:00 hrs",
    descripcion:
      "Ubicacion centrica con excelente ambiente que destaca por contar con una terraza en azotea ideal para disfrutar del ramen por la tarde.",
    foto: { src: centroImg, alt: "Sucursal Centro" },
    referencias: [
      "A 2 cuadras del Zocalo",
      "Frente al Mercado Benito Juarez",
      "Zona peatonal",
    ],
    lat: 17.0683,
    lng: -96.7214,
  },
  {
    id: 2,
    codigo: "02",
    nombre: "Reforma",
    nombreCompleto: "Casablanca Ramen House Reforma",
    direccion:
      "Av. Fuerza Aerea Mexicana 900, esq. Azucenas, Col. Reforma, 68050 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 22:00 hrs",
    descripcion:
      "La sucursal principal de la zona norte; espacio amplio y contemporaneo famoso por su rapidez extrema en el servicio del menu personalizable.",
    foto: { src: reformaImg, alt: "Sucursal Reforma" },
    referencias: [
      "Esquina con Calle Azucenas",
      "Zona norte de la ciudad",
      "Amplio estacionamiento",
    ],
    lat: 17.0818,
    lng: -96.7135,
  },
  {
    id: 3,
    codigo: "03",
    nombre: "Macroplaza",
    nombreCompleto: "Casablanca Ramen House Macro Plaza",
    direccion:
      "Carretera Internacional Km 1.5, Nueva Santa Lucia, 71244 Santa Lucia del Camino, Oax.",
    horario: "Lun - Dom  ·  12:00 - 21:00 hrs",
    descripcion:
      "Formato optimizado para la zona oriente de la ciudad. Misma experiencia del ramen armado en 6 pasos con servicio al instante.",
    foto: { src: macroplazaImg, alt: "Sucursal Macroplaza" },
    referencias: [
      "Dentro del area de comida",
      "Subiendo escaleras al fondo a la derecha",
      "Plaza comercial",
    ],
    lat: 17.0652,
    lng: -96.6961,
  },
  {
    id: 4,
    codigo: "04",
    nombre: "Monte Alban",
    nombreCompleto: "Casablanca Ramen House Monte Alban",
    direccion:
      "Carretera a Monte Alban 860, Agencia de Policia Montoya, 68143 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 21:45 hrs",
    descripcion:
      "Sucursal de la zona poniente, ideal para comer en el lugar o pedir para llevar a casa mediante plataformas de entrega.",
    foto: { src: montealbanImg, alt: "Sucursal Monte Alban" },
    referencias: [
      "Carretera a Monte Alban",
      "Zona poniente de la ciudad",
      "Servicio a domicilio disponible",
    ],
    lat: 17.0655,
    lng: -96.757,
  },
];

const estilosAnimacion = `
  @keyframes caida {
    0%   { opacity: 0; transform: translateY(-40px) rotate(-1.5deg); }
    60%  { transform: translateY(6px) rotate(0.4deg); }
    80%  { transform: translateY(-3px) rotate(-0.2deg); }
    100% { opacity: 1; transform: translateY(0) rotate(0deg); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function SucursalCard({ sucursal, index, visible }) {
  const esInvertido = index % 2 === 1;
  const delay = `${0.1 + index * 0.08}s`;

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 pb-16 border-b border-[#D4AF6A]/12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}, transform 0.65s ease ${delay}`,
      }}
    >
      {/* Info */}
      <div
        className={`flex flex-col gap-5 ${esInvertido ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "88px",
              color: "#F2EDE4",
              lineHeight: 0.9,
              borderLeft: "2px solid rgba(212,175,106,0.5)",
              paddingLeft: "14px",
              userSelect: "none",
            }}
          >
            {sucursal.codigo}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "30px",
                color: "#F2EDE4",
                fontWeight: 400,
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              {sucursal.nombre}
            </h2>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#D4AF6A",
                margin: "4px 0 0",
              }}
            >
              {sucursal.nombreCompleto}
            </p>
          </div>
        </div>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(242,237,228,0.72)",
            lineHeight: "1.75",
            maxWidth: "460px",
            margin: 0,
          }}
        >
          {sucursal.descripcion}
        </p>

        <div
          style={{
            borderLeft: "1px solid rgba(212,175,106,0.28)",
            paddingLeft: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[
            { label: "Dirección", valor: sucursal.direccion },
            { label: "Horario", valor: sucursal.horario },
          ].map(({ label, valor }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "rgba(212,175,106,0.55)",
                  marginBottom: "3px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "rgba(242,237,228,0.78)",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {valor}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "rgba(61,53,48,0.3)",
            border: "1px solid rgba(212,175,106,0.13)",
            padding: "14px 18px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(212,175,106,0.65)",
              marginBottom: "10px",
            }}
          >
            Referencias
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "7px",
            }}
          >
            {sucursal.referencias.map((ref, i) => (
              <li
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "9px" }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#D4AF6A",
                    opacity: 0.5,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(242,237,228,0.58)",
                  }}
                >
                  {ref}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${sucursal.lat},${sucursal.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(242,237,228,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF6A")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(242,237,228,0.5)")
          }
        >
          Ver en Maps
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "13px" }}
          >
            open_in_new
          </span>
        </a>
      </div>

      {/* Imagen con animación de caída */}
      <div
        className={`${esInvertido ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}
        style={{
          animation: visible
            ? `caida 0.75s cubic-bezier(0.22,1,0.36,1) ${delay} both`
            : "none",
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          style={{
            border: "1px solid rgba(212,175,106,0.18)",
            padding: "10px",
          }}
        >
          <img
            src={sucursal.foto.src}
            alt={sucursal.foto.alt}
            className="w-full h-[240px] sm:h-[350px] lg:h-[400px] object-cover block"
            style={{
              filter: "saturate(1.05) contrast(1.04)",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "9px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(212,175,106,0.45)",
              }}
            >
              Foto de la sucursal
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(212,175,106,0.3)",
              }}
            >
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(4).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibles, setVisibles] = useState([]);
  const seccionesRef = useRef([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await api.get("/sucursales");
        const listaDB = response.data.data || [];

        const cruzadas = listaDB.map((sucDB, index) => {
          const estatica =
            sucursalesEstaticas.find(
              (s) =>
                s.nombre.toLowerCase().includes(sucDB.nombre.toLowerCase()) ||
                sucDB.nombre.toLowerCase().includes(s.nombre.toLowerCase()),
            ) || sucursalesEstaticas[index % sucursalesEstaticas.length];

          return {
            ...estatica,
            _id: sucDB._id,
            nombre: sucDB.nombre,
            direccion: sucDB.direccion || estatica.direccion,
            lat: sucDB.ubicacion?.latitud || estatica.lat,
            lng: sucDB.ubicacion?.longitud || estatica.lng,
          };
        });

        setSucursales(cruzadas);
        setVisibles(cruzadas.map(() => false));
      } catch {
        setSucursales(sucursalesEstaticas);
        setVisibles(sucursalesEstaticas.map(() => false));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSucursales();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.dataset.index);
          setVisibles((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    seccionesRef.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgb(10,10,10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#D4AF6A",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}
      >
        Cargando red de sucursales...
      </div>
    );
  }

  return (
    <>
      <style>{estilosAnimacion}</style>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgb(10,10,10)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "80px",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              width: "60vw",
              maxWidth: "900px",
              aspectRatio: "1/1",
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(140,0,0,0.32) 0%, rgba(95,0,0,0.14) 35%, rgba(10,10,10,0) 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header className="px-6 md:px-16 pt-8 pb-7">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(212,175,106,0.55)",
                marginBottom: "6px",
              }}
            >
              Red de sucursales
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  color: "#F2EDE4",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  margin: 0,
                  animation: "fadeSlideUp 0.6s ease both",
                }}
              >
                Nuestras Sucursales
              </h1>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(242,237,228,0.4)",
                  paddingBottom: "6px",
                  letterSpacing: "0.1em",
                }}
              >
                {sucursales.length} ubicaciones activas
              </span>
            </div>
            <div
              style={{
                height: "1px",
                backgroundColor: "rgba(212,175,106,0.18)",
                marginTop: "20px",
              }}
            />
          </header>

          <main className="flex flex-col px-6 md:px-16 pb-20">
            {sucursales.map((sucursal, index) => (
              <div
                key={sucursal._id || sucursal.id}
                ref={(node) => {
                  seccionesRef.current[index] = node;
                }}
                data-index={index}
              >
                <SucursalCard
                  sucursal={sucursal}
                  index={index}
                  visible={visibles[index]}
                />
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export default Sucursales;
