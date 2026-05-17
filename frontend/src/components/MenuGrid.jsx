import MenuCard from "./MenuCard";

const productos = [
  {
    id: 1,
    nombre: "Gyoza de Wagyu",
    descripcion:
      "Selladas al vacío y terminadas al fuego con reducción de soja añeja y cebollino fino.",
    precio: "24.00",
    badge: "Signature",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAor4gmM7cFq6L3SGwzR-JEoSuepOiyY0TAHmW9kupja2F82r_dkcongMXNxwATZ7YUyQKZjsj63FGJowPdi2Q6Gg4bLvNUeWUz41ZxrY8_yE6ErMtGUJAf4BEzwruh92udofgO_2USqVmEEVzqJi3cOfi9KUr-9-Jnm8wHQqWlX0r00KRgxIEhD_lVdYVI1UOxnIzHKrSl-mp7ryXB7-M1pqcQuMyraz1HiE3Yae6lv5Vh4HBZ05aHBkOM_ArYsJJr7lDKvDy2QEI",
  },
  {
    id: 2,
    nombre: "Tartar de Atún Rojo",
    descripcion:
      "Atún Bluefin con emulsión de chile serrano, aguacate y perlas de yuzu.",
    precio: "32.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcrEUp59Y6Jr6rpIOkRNCriiXUpvL20AhRXtKCh3q22rpNwNLYTUMIWWyG4YvoExM8EEe6Py01To4G9HxC9qxlEdDRC3OTPpKkyRoGKh45xHisOHkuEfadCFFhH0LACm38fIcbtbA8ow_MR1oN4rKr6nzYTSc_e0Ymxcz2ZXEyh_DydhdpgtNhvncgz8TLy7micTLZj4HqiQ7fpAq1JIl0OZF3E4jXYj2TtfgZTbVhQyrNYLXf_gr-R3u3tHEbqHwcannLfxFZqug",
  },
  {
    id: 3,
    nombre: "Rock Shrimp Tempura",
    descripcion:
      "Camarones de roca en tempura ligera con mayonesa de sriracha casera.",
    precio: "28.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBroyZw0GdKer8PZb4I7NObpKMHzfcQ0JlCmOohCD2uIWNxOwYv2wrI2o2h_9R4WUy_qtyfyiWg8bGPtCoEgkyL26XvP_c9ig9IGxY_zNmBHNfL6pIKfD5mgLJ_UxQ2Otm0Dy2Myw6S0Elh6gYIof0Z1YsBasGAr-VF0P3wYMuY5fxI_SR84jC5rDdK2uxPK-mvEqePNUy7aRQSzgDP4aWw5jJD0IefH0Ik0fvO7cWeB86kr0t2aAYVE0KeAoSKH3ZbaxgRRtt_NPE",
  },
  {
    id: 4,
    nombre: "Edamames con Sal de Mar",
    descripcion:
      "Vainas de soja tiernas al vapor terminadas con escamas de sal Maldon.",
    precio: "12.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6ITmu3vmoWk-KfNP0RvAMioZqD4Cgont_sSbEn22Fhnd7mZeybm_t7VdRU-seG0nQX013bx7XJDvY2zJf5xcOlYiFzO1hgUAsJ6KMokp9tO1duifGNJwjyjQhfd04KGDP9EmqZMozM-qgUCk7RoqbsU0sbGIGv1RzjQ-TfjcsrlEsI3RgBtK6pjAXR0yyVoQWPd8dJFpJz7UFAFyF3rCm5UPtPL5Vn40apc97YkWmxqvXrXuxD-jzFc72BbVn94_XgXe0IefM_bg",
  },
  {
    id: 5,
    nombre: "Hamachi Jalapeño",
    descripcion:
      "Cortes finos de Hamachi con rodajas de jalapeño y salsa ponzu cítrica.",
    precio: "34.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZHZg86BygqPbvrmMQ3U4MqJ1G5KZ7aR-bt4flVJVmZ24qdGYy4VSKdnXfy0WIdft_EJ0FCZ9PRw7xid2BsBSVW6Hf_L18IZpijWdPs2kT6D0SrjtjADStgxsg8ayAxxgmrtKLHlXeSJg4ZF2flmhdGrjBEZX5DX-LhZE7aR232ORYuf7eW_WsKyKCirZw3GLg4EonwMPt10_pHmyCYOkZ5cTxWvmW79eWd9dnANG70A5gO4U5Al95veimuP0TBgBJZOJJy2e-RMM",
  },
  {
    id: 6,
    nombre: "Pork Belly Bao",
    descripcion:
      "Pan al vapor relleno de panza de cerdo braseada, pepino y salsa hoisin.",
    precio: "18.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwSd-KDmXAIreefuHCou2o6UWpcPyOoNa0_O7b5Hdm_dUloHKJQVKN3jkU4IKJN3M6DYBIHb4q9OiNhOybGuqqekfKPU_ayrb0rHTrc4bStRk5PsNw4MoWx1KvgGSxBFKHpqXHZJimU3jKqG-aC6TxAp58iR5gSEgOAXAhgIh3F2hTOEmazccmDqaADSFGpoJzGNYJlbVvExPp9BwjukWLEbsVEzQN03Nw3v1Q1b6Y33p9vMhyUuMWSbXGQJBoYHEjML5DAl-4rvQ",
  },
];

function MenuGrid({ categoriaActiva, onAgregar }) {
  return (
    <main className="ml-[280px] mr-[350px] flex-grow min-h-screen bg-background p-[40px]">
      <header className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-['EB_Garamond'] text-[40px] font-semibold text-primary uppercase leading-tight">
            {categoriaActiva}
          </h2>
          <span className="font-['JetBrains_Mono'] text-[12px] text-secondary tracking-widest">
            FILTRAR POR PREFERENCIA
          </span>
        </div>
        <div className="h-px w-full bg-secondary/20"></div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-[24px]">
        {productos.map((producto) => (
          <MenuCard
            key={producto.id}
            {...producto}
            onAgregar={() => onAgregar(producto)}
          />
        ))}
      </div>
    </main>
  );
}

export default MenuGrid;
