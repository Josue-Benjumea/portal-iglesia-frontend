
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/auth/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-D7FILTQ2.js",
      "chunk-OXZSAA2A.js",
      "chunk-UO7HTRBI.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-D7FILTQ2.js",
      "chunk-OXZSAA2A.js",
      "chunk-UO7HTRBI.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-D7FILTQ2.js",
      "chunk-OXZSAA2A.js",
      "chunk-UO7HTRBI.js"
    ],
    "route": "/auth/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5KNQXBFV.js",
      "chunk-RQ2CNPDX.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NHXA4VYE.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "redirectTo": "/adoracion/buscar-canciones",
    "route": "/adoracion"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NHXA4VYE.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "route": "/adoracion/buscar-canciones"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-NHXA4VYE.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "route": "/adoracion/crear-repertorio"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CPOZJHUE.js",
      "chunk-OXZSAA2A.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "redirectTo": "/multimedia/listar-repertorios",
    "route": "/multimedia"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CPOZJHUE.js",
      "chunk-OXZSAA2A.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "route": "/multimedia/listar-repertorios"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-CPOZJHUE.js",
      "chunk-OXZSAA2A.js",
      "chunk-QVV3MSXL.js",
      "chunk-UO7HTRBI.js",
      "chunk-RQ2CNPDX.js"
    ],
    "route": "/multimedia/editar-diapositivas"
  },
  {
    "renderMode": 2,
    "redirectTo": "/auth/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 71475, hash: 'bbbd46add56d0e519ef64b50ade94ccb682d49fc1770083a558f3e3b506fad2c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17289, hash: 'a5967df67719962d359fba36ab6edefba4e46d99f94f65af34f458059b3a675a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 158410, hash: '5b213ba8e02db54dc908be3dd315bb2da1be87863294a3e48e3885d20eb3bc63', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'auth/register/index.html': {size: 183023, hash: '5231ca7dfd2be20ece1c49fc227e536c5afd71d01ddda7fbf9d51eafbb76da26', text: () => import('./assets-chunks/auth_register_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 153761, hash: '455a75ac0f5fb249ad8067d380d718f3bd169896bd07bcb58464c756f8d95fbd', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'adoracion/buscar-canciones/index.html': {size: 158514, hash: '2d6ae21c458f76fd31f2483680a8c530f817630b9d04c3e7635561508ce1df8e', text: () => import('./assets-chunks/adoracion_buscar-canciones_index_html.mjs').then(m => m.default)},
    'adoracion/crear-repertorio/index.html': {size: 158514, hash: 'a5b3086e4d6abdd9dcf7d00111d9bbf71c7ee8f60b05a7294167d16d6e205c1f', text: () => import('./assets-chunks/adoracion_crear-repertorio_index_html.mjs').then(m => m.default)},
    'multimedia/listar-repertorios/index.html': {size: 158566, hash: 'a4c4fe52a38b4cb31b5c4a1227cba3bcd07210cef635d0da898ae3b3ecce3362', text: () => import('./assets-chunks/multimedia_listar-repertorios_index_html.mjs').then(m => m.default)},
    'multimedia/editar-diapositivas/index.html': {size: 158566, hash: '3d97a3d8b3152a597817c6586ce76612e540aef8a7e73c02a4c08ac4e4ec114b', text: () => import('./assets-chunks/multimedia_editar-diapositivas_index_html.mjs').then(m => m.default)},
    'styles-5W7ETEKB.css': {size: 101611, hash: 'wijy3Mb8+BQ', text: () => import('./assets-chunks/styles-5W7ETEKB_css.mjs').then(m => m.default)}
  },
};
