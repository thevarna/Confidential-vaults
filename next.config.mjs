/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { resolve } from 'node:path';

// Resolve the path to 'tfhe/tfhe_bg.wasm'
const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = resolve(__dirname, 'node_modules/tfhe/tfhe_bg.wasm');

const nextConfig = {
  webpack: (config, { isServer }) => {
    patchWasmModuleImport(config, isServer);

    if (!isServer) {
      config.output.environment = {
        ...config.output.environment,
        // asyncFunction: true,
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      'tfhe_bg.wasm': wasmPath,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config;
  },
};

function patchWasmModuleImport(config, isServer) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
    layers: true,
    topLevelAwait: true,
  });

  config.optimization.moduleIds = "named";

  config.module.rules.push({
    test: /\.wasm$/,
    type: "asset/resource",
  });

  // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
  if (isServer) {
    config.output.webassemblyModuleFilename = "./../static/wasm/tfhe_bg.wasm";
  } else {
    config.output.webassemblyModuleFilename = "static/wasm/tfhe_bg.wasm";
  }
}

export default nextConfig;