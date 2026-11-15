# Instrucciones para agentes

taller3: Una web para apuntarse a un taller de cerámica con plazas limitadas. Cada persona se apunta con su nombre. Si quedan plazas, queda apuntada y lo ve en pantalla; si el taller está lleno, entra en la lista de espera y ve en qué puesto está. Cualquiera puede darse de baja; cuando alguien apuntado se…
Stack elegido al crear el proyecto: Web con Vite (JavaScript) (JavaScript (ES modules) + Vite + Vitest). No lo cambies sin un requisito que lo pida.

## SDD Stack Profile
- stack: JavaScript (ES modules) + Vite + Vitest
- test: npm test
- test_file: npx vitest run {file} --maxWorkers=2
- code_paths: src/
- test_paths: tests/
- task_state: trailers
- test_slots: 1
- server: npx vite --host 127.0.0.1 --port 5173
- port: 5173

## Convenciones
- Código y textos de la interfaz en español (o el idioma del proyecto).
- Cualquier cambio de comportamiento lleva su test.
- Vitest con como mucho 2 workers: `test: { maxWorkers: 2 }` en vitest.config (la máquina la comparten otras etapas y el navegador de los e2e).
