import { defineConfig, loadEnv } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

process.env.NODE_ENV = 'DEV';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT) || 3020;

  return {
    server: {
      port: port,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('DEV'),
    },
    plugins: [
      ...VitePluginNode({
        adapter: 'nest',
        appPath: './src/main.ts',
        exportName: 'viteNodeApp',
        tsCompiler: 'swc',
        swcOptions: {
          jsc: {
            target: 'es2022',
            parser: {
              syntax: 'typescript',
              decorators: true,
              dynamicImport: true,
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
            },
          },
        },
      }),
    ],
    optimizeDeps: {
      exclude: [
        '@nestjs/microservices',
        '@nestjs/websockets',
        'cache-manager',
        'class-transformer',
        'class-validator',
      ],
    },
  };
});
