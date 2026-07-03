## Code Style

- **No barrel exports.** Do not use `index.ts` files to re-export from other modules. Always import directly from the source file (e.g. `@/utils/random`, not `@/utils`).
