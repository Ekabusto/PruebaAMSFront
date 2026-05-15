# AMS Phone Store

Prueba técnica frontend — SPA para buscar y comprar móviles.

## Cómo arrancarlo

**Con Docker (recomendado):**

```bash
docker build -t ams-phone-store .
docker run -p 8080:80 ams-phone-store
```

Abre [http://localhost:8080](http://localhost:8080).

**Sin Docker:**

```bash
npm install
npm start        # servidor de desarrollo en localhost:5173
npm run build    # build de producción
npm test         # tests
npm run lint     # linting
```

No hace falta ninguna variable de entorno. La URL de la API está directamente en `src/services/api.js`.

## Stack

React 18 con Vite, React Router v6, CSS Modules y Framer Motion para las animaciones. Tests con Vitest y @testing-library/react.

## Notas para el revisor

La caché guarda la respuesta en localStorage junto a un timestamp. Si ha pasado más de una hora, la siguiente petición va a red y reemplaza la entrada. `addToCart()` nunca se cachea porque es una mutación.

El contador del carrito también vive en localStorage. Cuando el POST tiene éxito, `ProductActions` actualiza ese valor y lanza un evento custom `cartUpdated` en el DOM; el `Header` lo escucha y se actualiza. Decidí no meter Context ni estado global para una sola cifra, me parecia too much.

El estado de las peticiones en `ProductListPage` y `ProductDetailPage` lo manejo con `useReducer` en vez de varios `useState` sueltos. Básicamente porque varios `setState` dentro de un efecto pueden dar lugar a renders intermedios raros, y además ESLint se queja con `react-hooks/exhaustive-deps` y esta fue la forma de solventarlo.

Los tests que cubren componentes con animaciones mockean Framer Motion con `vi.mock`, reemplazando `motion.*` por elementos HTML normales. Sin eso los tests dependen del ciclo de animación y son frágiles, en mi experiencia esta era supuestamente la forma de hacerlo.

Tambien decidí hacer la lista de caracteristicas colapsable porque sino eran demasiados elementos dificiles de cuadrar para que el usuario vea todo de una tirada. 
